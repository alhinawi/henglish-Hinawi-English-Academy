// ==============================================================================
// Henglish Academy (HENGLISH) - MOVIE SCENE DISCOVERY & SEARCH ENGINE
// Intelligent ranking engine: phrase matching, semantic similarity,
// quote indexing, and YouTube discovery integration
// ==============================================================================

import { MOVIE_SCENES_CATALOG, MovieSceneItem, TimedSubtitle } from '../data/movieScenesData';

export interface MovieSearchResult {
  scene: MovieSceneItem;
  score: number;
  matchedQuote?: string;
  matchedSubtitle?: TimedSubtitle;
  matchType: 'exact-quote' | 'partial-quote' | 'actor' | 'title' | 'idiom' | 'semantic';
  matchHighlightEn?: string;
  matchHighlightAr?: string;
}

/**
 * Normalizes text for clean fuzzy and cross-language comparisons
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Mode A: Search for Movie Scenes by Sentence / Expression
 */
export function searchMovieScenesBySentence(query: string): MovieSearchResult[] {
  const normQuery = cleanText(query);
  if (!normQuery) {
    return MOVIE_SCENES_CATALOG.map(scene => ({
      scene,
      score: 10,
      matchType: 'semantic',
      matchedQuote: scene.dialogueQuote,
    }));
  }

  const queryTokens = normQuery.split(' ').filter(Boolean);
  const results: MovieSearchResult[] = [];

  for (const scene of MOVIE_SCENES_CATALOG) {
    let score = 0;
    let matchType: MovieSearchResult['matchType'] = 'semantic';
    let matchedSubtitle: TimedSubtitle | undefined;
    let matchedQuote: string | undefined = scene.dialogueQuote;

    const normQuote = cleanText(scene.dialogueQuote);
    const normTitle = cleanText(scene.movieTitle);
    const normActor = cleanText(scene.actorName);
    const normCharacter = cleanText(scene.characterName);
    const normDesc = cleanText(scene.sceneDescription);

    // 1. Exact Dialogue Quote Match
    if (normQuote === normQuery) {
      score += 150;
      matchType = 'exact-quote';
      matchedQuote = scene.dialogueQuote;
    } else if (normQuote.includes(normQuery)) {
      score += 90;
      matchType = 'partial-quote';
      matchedQuote = scene.dialogueQuote;
    }

    // 2. Title & Actor matches
    if (normTitle.includes(normQuery)) {
      score += 80;
      matchType = 'title';
    } else if (normActor.includes(normQuery) || normCharacter.includes(normQuery)) {
      score += 70;
      matchType = 'actor';
    }

    // 3. Subtitles Scan
    for (const sub of scene.subtitles) {
      const normSubEn = cleanText(sub.en);
      const normSubAr = cleanText(sub.arEg);

      if (normSubEn.includes(normQuery)) {
        score += 60;
        matchedSubtitle = sub;
        matchedQuote = sub.en;
        matchType = 'partial-quote';
        break;
      } else if (normSubAr.includes(normQuery)) {
        score += 55;
        matchedSubtitle = sub;
        matchedQuote = sub.en;
        matchType = 'semantic';
        break;
      }
    }

    // 4. Vocabulary / Idioms Scan
    for (const vocab of scene.vocabulary) {
      const normTerm = cleanText(vocab.term);
      const normMeaning = cleanText(vocab.meaningAr);
      const normEq = cleanText(vocab.egyptianEquivalent);

      if (normTerm.includes(normQuery)) {
        score += 65;
        matchType = 'idiom';
        break;
      } else if (normMeaning.includes(normQuery) || normEq.includes(normQuery)) {
        score += 50;
        matchType = 'idiom';
        break;
      }
    }

    // 5. Token Overlap
    let tokenMatches = 0;
    for (const token of queryTokens) {
      if (normQuote.includes(token)) tokenMatches += 10;
      if (normTitle.includes(token)) tokenMatches += 8;
      if (normActor.includes(token)) tokenMatches += 6;
      if (normDesc.includes(token)) tokenMatches += 5;
    }
    score += tokenMatches;

    if (score > 0) {
      results.push({
        scene,
        score,
        matchedQuote,
        matchedSubtitle,
        matchType,
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Get scene by unique ID
 */
export function getMovieSceneById(sceneId: string): MovieSceneItem | undefined {
  return MOVIE_SCENES_CATALOG.find(s => s.id === sceneId);
}

/**
 * Mode B: Search YouTube for Educational Movie Scenes (using API if key is available, or curated engine)
 */
export async function searchYouTubeEducationalScenes(
  topicQuery: string,
  apiKey?: string
): Promise<{ id: string; title: string; channel: string; thumbnail: string; duration?: string }[]> {
  const cleanQ = topicQuery.trim();
  const effectiveKey = apiKey || (typeof process !== 'undefined' ? process.env?.VITE_YOUTUBE_API_KEY : undefined);

  if (effectiveKey && effectiveKey !== 'your_youtube_api_key_optional') {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        cleanQ + ' movie scene english dialogue'
      )}&type=video&videoEmbeddable=true&maxResults=8&key=${effectiveKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        return (json.items || []).map((item: any) => ({
          id: item.id?.videoId || '',
          title: item.snippet?.title || '',
          channel: item.snippet?.channelTitle || '',
          thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
        }));
      }
    } catch (err) {
      console.warn('YouTube Data API fetch fallback to curated catalog:', err);
    }
  }

  // Fallback to curated high-fidelity licensed scenes
  const matched = searchMovieScenesBySentence(cleanQ);
  return matched.map(m => ({
    id: m.scene.youtubeId,
    title: `${m.scene.movieTitle} - "${m.scene.dialogueQuote}" (${m.scene.releaseYear})`,
    channel: m.scene.videoSource,
    thumbnail: m.scene.thumbnailUrl || `https://img.youtube.com/vi/${m.scene.youtubeId}/hqdefault.jpg`,
    duration: m.scene.clipDuration,
  }));
}
