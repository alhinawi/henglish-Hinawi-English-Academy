import type { MovieSceneItem, TimedSubtitle } from './movieScenesData';

// Source reviewed 2026-11-16: https://www.youtube.com/watch?v=D6me2-OurCw
// Four reviewed excerpts only, NOT a complete transcript. Other spoken lines remain
// untranscribed. Source duration is 88.321s, not the historical catalog value 95s.
// Cue boundaries are speech-aligned to the source recording, rounded to 0.1s.
const GODFATHER_REVIEWED_EXCERPTS: TimedSubtitle[] = [
  { id: 'gf-opening', start: 0, end: 4.8,
    en: "Godfather, I don't know what to do. I don't know what to do.",
    arEg: 'يا عراب، مش عارف أعمل إيه. مش عارف أعمل إيه.',
    arFusha: 'أيها العراب، لا أعرف ماذا أفعل. لا أعرف ماذا أفعل.', speaker: 'Johnny Fontane', keyWords: [] },
  { id: 'gf-act', start: 4.8, end: 6.6,
    en: 'You can act like a man!', arEg: 'تقدر تتصرف زي الراجل!', arFusha: 'يمكنك أن تتصرف كرجل!', speaker: 'Don Corleone', keyWords: [] },
  { id: 'gf-family', start: 24.8, end: 34,
    en: "You spend time with your family? Sure I do. Good. A man who doesn't spend time with his family can never be a real man.",
    arEg: 'بتقضي وقت مع عيلتك؟ أكيد. كويس. الراجل اللي مبيقضيش وقت مع عيلته عمره ما هيبقى راجل بجد.',
    arFusha: 'هل تقضي وقتا مع عائلتك؟ بالتأكيد. جيد. الرجل الذي لا يقضي وقتا مع عائلته لا يمكن أن يكون رجلا حقيقيا.', speaker: 'Don Corleone / Johnny Fontane', keyWords: [] },
  { id: 'gf-offer', start: 53.1, end: 55.5,
    en: "I'm going to make him an offer he can't refuse.",
    arEg: 'هقدمله عرض ميقدرش يرفضه.', arFusha: 'سأقدم له عرضا لا يستطيع رفضه.', speaker: 'Don Corleone', keyWords: [] },
];

/** Correct by source ID, including old saved/history objects and direct scene links. */
export function applyMovieTranscriptCorrections<T extends MovieSceneItem>(scene: T): T {
  if (scene.youtubeId !== 'D6me2-OurCw') return scene;
  return { ...scene, startTime: 0, endTime: 88.321, clipDuration: '1:28', transcriptTimingStatus: 'reviewed-excerpts',
    subtitles: GODFATHER_REVIEWED_EXCERPTS,
    // Old comprehension questions referred to dialogue absent from this upload.
    // Keep independent vocabulary/quiz learning content, but do not present it as
    // a word-for-word transcript or use it for subtitle highlighting.
  };
}
