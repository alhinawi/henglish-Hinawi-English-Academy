import type { MovieSceneItem, TimedSubtitle } from '../movieScenesData';

export interface CaptionReviewCue {
  id?: string;
  originalCueId?: string;
  start: number;
  end: number;
  en: string;
  arEg: string;
  arFusha: string;
  reviewed: boolean;
  matchScore?: number;
}
export interface CaptionReviewRecord {
  youtubeId: string;
  sourceUrl: string;
  catalogIds: string[];
  durationSeconds?: number | null;
  reviewStatus: string;
  completeTranscript: boolean;
  newOpeningExcerpts: CaptionReviewCue[];
  existingCueCorrections: CaptionReviewCue[];
  evidence: { method: string; sourceTitle?: string; timingToleranceSeconds?: number; captionSourceUrl?: string | null };
  remainingWork: string[];
}

/** Source identity, bounds and evidence are checked before any candidate is published. */
export function captionReviewCues(scene: MovieSceneItem, record: CaptionReviewRecord, approved: boolean): TimedSubtitle[] {
  if (!approved || record.youtubeId !== scene.youtubeId || record.reviewStatus !== 'reviewed_excerpts' || !record.durationSeconds || record.durationSeconds <= 0) return [];
  const cues = [...record.newOpeningExcerpts, ...record.existingCueCorrections];
  const seen = new Set<string>();
  return cues.filter(cue => {
    if (!cue.reviewed || !cue.en.trim() || !Number.isFinite(cue.start) || !Number.isFinite(cue.end) || cue.start < 0 || cue.end <= cue.start || cue.end > record.durationSeconds!) return false;
    // The same supplied cue may appear in multiple catalog records for one video.
    const key = `${cue.start}:${cue.end}:${cue.en}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).map((cue, index) => ({ id: `review-${scene.youtubeId}-${index}`, start: cue.start, end: cue.end, en: cue.en, arEg: cue.arEg, arFusha: cue.arFusha, keyWords: [] })).sort((a, b) => a.start - b.start);
}

export function canPublishCaptionReview(record: CaptionReviewRecord): boolean {
  return record.reviewStatus === 'reviewed_excerpts' && record.remainingWork.length === 0 &&
    !record.newOpeningExcerpts.some(cue => /transcriber:|reviewer:|captioned by|subtitles by/i.test(cue.en)) &&
    record.existingCueCorrections.length > 0 && record.existingCueCorrections.every(cue => (cue.matchScore ?? 0) >= 0.8) &&
    record.durationSeconds != null && record.durationSeconds > 0;
}
