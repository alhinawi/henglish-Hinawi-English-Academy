// ==============================================================================
// Henglish Academy (HENGLISH) - RELIABLE VIDEO VERIFICATION SERVICE
// Validates YouTube videos via oEmbed & HTTP checks, detects restrictions & embeds
// ==============================================================================

import { supabase } from './authService';

export type VideoVerificationStatus =
  | 'verified_playable'
  | 'embed_disabled'
  | 'unavailable'
  | 'private_or_deleted'
  | 'needs_review'
  | 'video_only';

export interface VerificationResult {
  youtubeId: string;
  status: VideoVerificationStatus;
  isEmbeddable: boolean;
  title?: string;
  channelName?: string;
  thumbnailUrl?: string;
  authorUrl?: string;
  httpStatus?: number;
  details?: string;
  verifiedAt: string;
}

const VERIFICATION_CACHE_KEY = 'henglish_video_verification_cache_v1';

// In-memory verification cache
const memoryCache = new Map<string, VerificationResult>();

// Load cached verifications from localStorage
function loadCache(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(VERIFICATION_CACHE_KEY);
    if (raw) {
      const parsed: Record<string, VerificationResult> = JSON.parse(raw);
      Object.entries(parsed).forEach(([k, v]) => memoryCache.set(k, v));
    }
  } catch {
    // quiet fallback
  }
}

function saveCache(): void {
  if (typeof window === 'undefined') return;
  try {
    const obj: Record<string, VerificationResult> = {};
    memoryCache.forEach((v, k) => {
      obj[k] = v;
    });
    localStorage.setItem(VERIFICATION_CACHE_KEY, JSON.stringify(obj));
  } catch {
    // quiet fallback
  }
}

// Initial cache load
loadCache();

/**
 * Extracts a clean 11-character YouTube video ID from various URL formats
 */
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const clean = urlOrId.trim();

  // If already exactly 11 valid characters
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  // Standard YouTube URL regex patterns
  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );

  return match ? match[1] : null;
}

/**
 * Verifies a YouTube video ID in real-time
 */
export async function verifyYouTubeVideo(
  youtubeIdOrUrl: string,
  forceRecheck: boolean = false
): Promise<VerificationResult> {
  const youtubeId = extractYouTubeId(youtubeIdOrUrl);
  if (!youtubeId) {
    return {
      youtubeId: youtubeIdOrUrl,
      status: 'unavailable',
      isEmbeddable: false,
      details: 'معرّف يوتيوب غير صالح (Invalid YouTube ID format)',
      verifiedAt: new Date().toISOString(),
    };
  }

  // Check cache if not forced
  if (!forceRecheck && memoryCache.has(youtubeId)) {
    const cached = memoryCache.get(youtubeId)!;
    // Cache valid for 24 hours
    const cacheAgeMs = Date.now() - new Date(cached.verifiedAt).getTime();
    if (cacheAgeMs < 24 * 60 * 60 * 1000) {
      return cached;
    }
  }

  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;

  try {
    const res = await fetch(oembedUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      const result: VerificationResult = {
        youtubeId,
        status: 'verified_playable',
        isEmbeddable: true,
        title: data.title,
        channelName: data.author_name,
        thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        authorUrl: data.author_url,
        httpStatus: 200,
        details: 'الفيديو معتمد ومتاح للتشغيل والتضمين بالكامل',
        verifiedAt: new Date().toISOString(),
      };

      memoryCache.set(youtubeId, result);
      saveCache();
      logVerificationToSupabase(result);
      return result;
    } else if (res.status === 401 || res.status === 403) {
      const result: VerificationResult = {
        youtubeId,
        status: 'embed_disabled',
        isEmbeddable: false,
        httpStatus: res.status,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        details: 'الفيديو موجود لكن صاحب المحتوى عطل التضمين الخارجي (Embedding Restricted)',
        verifiedAt: new Date().toISOString(),
      };
      memoryCache.set(youtubeId, result);
      saveCache();
      logVerificationToSupabase(result);
      return result;
    } else if (res.status === 404) {
      const result: VerificationResult = {
        youtubeId,
        status: 'private_or_deleted',
        isEmbeddable: false,
        httpStatus: 404,
        details: 'الفيديو محذوف أو خاص أو غير متاح على يوتيوب (HTTP 404)',
        verifiedAt: new Date().toISOString(),
      };
      memoryCache.set(youtubeId, result);
      saveCache();
      logVerificationToSupabase(result);
      return result;
    } else {
      const result: VerificationResult = {
        youtubeId,
        status: 'needs_review',
        isEmbeddable: false,
        httpStatus: res.status,
        details: `استجابة غير متوقعة من خوادم يوتيوب (HTTP ${res.status})`,
        verifiedAt: new Date().toISOString(),
      };
      memoryCache.set(youtubeId, result);
      saveCache();
      return result;
    }
  } catch (err: any) {
    // If CORS or network error blocks client oEmbed, test thumbnail image existence
    try {
      const thumbUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      const imgRes = await fetch(thumbUrl, { method: 'HEAD' });
      if (imgRes.ok) {
        const result: VerificationResult = {
          youtubeId,
          status: 'verified_playable',
          isEmbeddable: true,
          thumbnailUrl: thumbUrl,
          details: 'تم التحقق من وجود الفيديو عبر المعاينة الصورية الرسمية (Thumbnail verified)',
          verifiedAt: new Date().toISOString(),
        };
        memoryCache.set(youtubeId, result);
        saveCache();
        return result;
      }
    } catch {
      // ignore
    }

    const result: VerificationResult = {
      youtubeId,
      status: 'needs_review',
      isEmbeddable: true, // fallback to allow attempt
      details: `تعذر الاتصال بفاحص يوتيوب: ${err.message || 'Network error'}`,
      verifiedAt: new Date().toISOString(),
    };
    return result;
  }
}

async function logVerificationToSupabase(result: VerificationResult): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('video_verification_logs').insert({
      youtube_id: result.youtubeId,
      checked_status: result.status,
      is_embeddable: result.isEmbeddable,
      http_response_code: result.httpStatus || 200,
      response_details: result.details || '',
      checked_at: result.verifiedAt,
    });
  } catch {
    // quiet fallback
  }
}

