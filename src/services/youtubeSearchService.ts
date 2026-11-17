// ==============================================================================
// Henglish Academy (HENGLISH) - SECURE YOUTUBE SEARCH & DISCOVERY ENGINE
// Secure YouTube Data API v3 integration with throttling, pagination, and honest fallback
// ==============================================================================

import { getEnvVar } from '../utils/env';
import { verifyYouTubeVideo } from './videoVerificationService';
import { queryVideoCatalog, EducationalVideoItem } from './videoLibraryService';

export interface YouTubeApiSearchResult {
  youtubeId: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string;
  catalogScene?: EducationalVideoItem;
  isEmbeddable: boolean;
}

export interface SearchDiscoveryResponse {
  source: 'live_youtube_api' | 'verified_catalog_fallback';
  items: YouTubeApiSearchResult[];
  nextPageToken?: string;
  prevPageToken?: string;
  totalResults: number;
  apiQuotaExceeded?: boolean;
  message?: string;
}

// In-memory search cache with 30-minute expiration
interface CachedSearch {
  timestamp: number;
  data: SearchDiscoveryResponse;
}
const searchCache = new Map<string, CachedSearch>();

// Request throttling: minimum 500ms between calls
let lastRequestTime = 0;

/**
 * Searches YouTube for English learning clips securely
 */
export async function searchYouTubeVideos(
  query: string,
  pageToken?: string,
  categoryFilter?: string
): Promise<SearchDiscoveryResponse> {
  const cleanQ = query.trim();
  const cacheKey = `${cleanQ}__${pageToken || ''}__${categoryFilter || ''}`;

  // Check cache
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) {
    return cached.data;
  }

  // Throttling check
  const now = Date.now();
  if (now - lastRequestTime < 500) {
    await new Promise(r => setTimeout(r, 500 - (now - lastRequestTime)));
  }
  lastRequestTime = Date.now();

  const apiKey = getEnvVar('VITE_YOUTUBE_API_KEY');

  // If no API key is provided, or in offline/development fallback mode:
  // Provide an honest response drawn from our verified catalog
  if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
    const catalogResult = queryVideoCatalog({
      query: cleanQ,
      category: categoryFilter as any,
      pageSize: 12,
    });

    const fallbackItems: YouTubeApiSearchResult[] = catalogResult.videos.map(v => ({
      youtubeId: v.youtubeId,
      catalogScene: v,
      title: v.sceneTitle,
      description: v.sceneDescription,
      channelTitle: v.director,
      thumbnailUrl: v.thumbnailUrl || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`,
      publishedAt: `${v.releaseYear}-01-01T00:00:00Z`,
      isEmbeddable: v.isEmbeddable,
    }));

    // If the verified catalog has no match for this query, surface curated
    // suggestions instead of a blank result so the learner always gets videos.
    let finalItems = fallbackItems;
    let totalResults = catalogResult.totalMatches;
    let message = 'ys.notice0';
    if (cleanQ && catalogResult.totalMatches === 0) {
      const suggestions = queryVideoCatalog({ pageSize: 12 });
      finalItems = suggestions.videos.map(v => ({
        youtubeId: v.youtubeId,
      catalogScene: v,
        title: v.sceneTitle,
        description: v.sceneDescription,
        channelTitle: v.director,
        thumbnailUrl: v.thumbnailUrl || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`,
        publishedAt: `${v.releaseYear}-01-01T00:00:00Z`,
        isEmbeddable: v.isEmbeddable,
      }));
      totalResults = suggestions.totalMatches;
      message = 'ys.notice1';
    }

    const response: SearchDiscoveryResponse = {
      source: 'verified_catalog_fallback',
      items: finalItems,
      totalResults,
      message,
    };

    searchCache.set(cacheKey, { timestamp: Date.now(), data: response });
    return response;
  }

  // Live YouTube Data API v3 Call
  try {
    const endpoint = new URL('https://www.googleapis.com/youtube/v3/search');
    endpoint.searchParams.set('part', 'snippet');
    endpoint.searchParams.set('maxResults', '12');
    endpoint.searchParams.set('type', 'video');
    endpoint.searchParams.set('videoEmbeddable', 'true');
    endpoint.searchParams.set('safeSearch', 'moderate');
    endpoint.searchParams.set('relevanceLanguage', 'en');
    endpoint.searchParams.set('q', `${cleanQ} English clip`);
    endpoint.searchParams.set('key', apiKey);
    if (pageToken) {
      endpoint.searchParams.set('pageToken', pageToken);
    }

    const res = await fetch(endpoint.toString());

    if (!res.ok) {
      if (res.status === 403) {
        console.warn('YouTube API Quota exceeded or key restricted, falling back to verified catalog.');
        const catalogResult = queryVideoCatalog({ query: cleanQ, pageSize: 12 });
        return {
          source: 'verified_catalog_fallback',
          items: catalogResult.videos.map(v => ({
            youtubeId: v.youtubeId,
      catalogScene: v,
            title: v.sceneTitle,
            description: v.sceneDescription,
            channelTitle: v.director,
            thumbnailUrl: v.thumbnailUrl || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`,
            publishedAt: `${v.releaseYear}-01-01T00:00:00Z`,
            isEmbeddable: v.isEmbeddable,
          })),
          totalResults: catalogResult.totalMatches,
          apiQuotaExceeded: true,
          message: 'ys.notice2',
        };
      }
      throw new Error(`YouTube API HTTP ${res.status}`);
    }

    const json = await res.json();
    const rawItems = json.items || [];

    // Verify embeddability for discovered items
    const verifiedItems: YouTubeApiSearchResult[] = [];
    for (const item of rawItems) {
      const ytid = item.id?.videoId;
      if (ytid) {
        verifiedItems.push({
          youtubeId: ytid,
          title: item.snippet?.title || 'YouTube Video',
          description: item.snippet?.description || '',
          channelTitle: item.snippet?.channelTitle || 'YouTube Channel',
          thumbnailUrl: item.snippet?.thumbnails?.high?.url || `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`,
          publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
          isEmbeddable: true,
        });
      }
    }

    const response: SearchDiscoveryResponse = {
      source: 'live_youtube_api',
      items: verifiedItems,
      nextPageToken: json.nextPageToken,
      prevPageToken: json.prevPageToken,
      totalResults: json.pageInfo?.totalResults || verifiedItems.length,
      message: 'ys.notice3',
    };

    searchCache.set(cacheKey, { timestamp: Date.now(), data: response });
    return response;
  } catch (err: any) {
    console.warn('YouTube API fetch failed, falling back to verified catalog:', err);
    const catalogResult = queryVideoCatalog({ query: cleanQ, pageSize: 12 });
    return {
      source: 'verified_catalog_fallback',
      items: catalogResult.videos.map(v => ({
        youtubeId: v.youtubeId,
      catalogScene: v,
        title: v.sceneTitle,
        description: v.sceneDescription,
        channelTitle: v.director,
        thumbnailUrl: v.thumbnailUrl || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`,
        publishedAt: `${v.releaseYear}-01-01T00:00:00Z`,
        isEmbeddable: v.isEmbeddable,
      })),
      totalResults: catalogResult.totalMatches,
      message: 'ys.notice4',
    };
  }
}

