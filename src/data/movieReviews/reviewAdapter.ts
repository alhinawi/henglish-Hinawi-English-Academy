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
  captionEvidence?: { rawCaptionText: string; start: number; end: number; captionKind?: string; sourceUrl: string };
}
export interface CaptionReviewRecord {
  youtubeId: string;
  sourceUrl: string;
  catalogIds: string[];
  durationSeconds?: number | null;
  reviewStatus: string;
  completeTranscript: boolean;
  completeSceneTranscript?: boolean;
  sceneStart?: number;
  sceneEnd?: number;
  captionEvidenceChecked?: boolean;
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

function normaliseCaption(text: string): string {
  return text.toLowerCase().replace(/’/g, "'").replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean).join(' ');
}

export function canPublishCaptionReview(record: CaptionReviewRecord): boolean {
  const cues = [...record.newOpeningExcerpts, ...record.existingCueCorrections];
  const ordered = [...cues].sort((a, b) => a.start - b.start);
  const coversScene = ordered.length > 0 && ordered[0].start === record.sceneStart && ordered.at(-1)!.end === record.sceneEnd && ordered.every((cue, index) => index === 0 || cue.start === ordered[index - 1].end);
  return coversScene && record.completeSceneTranscript === true && Number.isFinite(record.sceneStart) && Number.isFinite(record.sceneEnd) && record.sceneStart! >= 0 && record.sceneEnd! > record.sceneStart! && record.sceneEnd! <= (record.durationSeconds || 0) && record.captionEvidenceChecked === true && record.reviewStatus === 'reviewed_excerpts' && record.remainingWork.length === 0 &&
    cues.reduce((sum, cue) => sum + cue.en.length, 0) <= 90 &&
    !record.newOpeningExcerpts.some(cue => /transcriber:|reviewer:|captioned by|subtitles by/i.test(cue.en)) &&
    cues.length > 0 && record.existingCueCorrections.every(cue => (cue.matchScore ?? 0) >= 0.8) &&
    record.durationSeconds != null && record.durationSeconds > 0 && cues.every(cue => {
      const evidence = cue.captionEvidence;
      return cue.reviewed && evidence && evidence.sourceUrl === record.sourceUrl &&
        evidence.start === cue.start && evidence.end === cue.end &&
        evidence.rawCaptionText === cue.en && cue.start >= record.sceneStart! && cue.end <= record.sceneEnd! && normaliseCaption(cue.en).length > 0;
    });
}
