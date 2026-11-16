import type { TimedSubtitle } from '../data/movieScenesData';

/** YouTube timestamps are absolute source-video seconds, never clip-relative. */
export function activeSubtitleAt(subtitles: TimedSubtitle[], seconds: number): number {
  if (!Number.isFinite(seconds) || seconds < 0) return -1;
  return subtitles.findIndex(sub => Number.isFinite(sub.start) && Number.isFinite(sub.end) && seconds >= sub.start && seconds < sub.end);
}

export function validSubtitles(subtitles: TimedSubtitle[], duration?: number): TimedSubtitle[] {
  return subtitles.filter(sub => sub.en.trim() && Number.isFinite(sub.start) && Number.isFinite(sub.end) && sub.start >= 0 && sub.end > sub.start && (!duration || sub.start < duration))
    .map(sub => ({ ...sub, end: duration ? Math.min(sub.end, duration) : sub.end }))
    .sort((a, b) => a.start - b.start);
}
