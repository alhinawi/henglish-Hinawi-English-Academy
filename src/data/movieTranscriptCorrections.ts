import reviewReports from './movieReviews/captionReviews.json';
import { canPublishCaptionReview, captionReviewCues, type CaptionReviewRecord } from './movieReviews/reviewAdapter';
import type { MovieSceneItem, TimedSubtitle } from './movieScenesData';

// Source reviewed 2026-11-16: https://www.youtube.com/watch?v=D6me2-OurCw
// Only the opening 0-4.8s is used as a bounded learning scene. The remainder
// of the 88.321s source is not part of this learning scene.
// Cue boundaries are speech-aligned to the source recording, rounded to 0.1s.
const GODFATHER_REVIEWED_EXCERPTS: TimedSubtitle[] = [
  { id: 'gf-opening', start: 0, end: 4.8,
    en: "Godfather, I don't know what to do. I don't know what to do.",
    arEg: 'يا عراب، مش عارف أعمل إيه. مش عارف أعمل إيه.',
    arFusha: 'أيها العراب، لا أعرف ماذا أفعل. لا أعرف ماذا أفعل.', speaker: 'Johnny Fontane', keyWords: [] },
];

/** Correct by source ID, including old saved/history objects and direct scene links. */
export function applyMovieTranscriptCorrections<T extends MovieSceneItem>(scene: T): T {
  const report = reviewReports.find(record => record.youtubeId === scene.youtubeId) as CaptionReviewRecord | undefined;
  if (report) {
    if (!canPublishCaptionReview(report)) {
      return { ...scene, transcriptTimingStatus: 'quarantined', verificationStatus: 'needs_review', isEmbeddable: false,
        subtitles: [], dialogueQuote: '', vocabulary: [], quizzes: [], speakingLines: [] };
    }
    const subtitles = captionReviewCues(scene, report, true);
    return { ...scene, startTime: report.sceneStart!, endTime: report.sceneEnd!,
      clipDuration: `${Math.floor((report.sceneEnd! - report.sceneStart!) / 60)}:${String(Math.floor((report.sceneEnd! - report.sceneStart!) % 60)).padStart(2, '0')}`,
      transcriptTimingStatus: 'caption-reviewed', subtitles, dialogueQuote: subtitles[0]?.en || '',
      // Old quizzes and echo lines can refer to rejected or paraphrased seed text.
      vocabulary: [], quizzes: [], speakingLines: [] };
  }
  if (scene.youtubeId !== 'D6me2-OurCw') return scene;
  return { ...scene, startTime: 0, endTime: 4.8, clipDuration: '0:05', transcriptTimingStatus: 'reviewed-excerpts',
    subtitles: GODFATHER_REVIEWED_EXCERPTS,
    dialogueQuote: GODFATHER_REVIEWED_EXCERPTS[0].en, vocabulary: [], quizzes: [], speakingLines: [],
  };
}
