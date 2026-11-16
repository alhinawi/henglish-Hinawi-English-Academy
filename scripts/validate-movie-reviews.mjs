import fs from 'node:fs';
import assert from 'node:assert/strict';
const reports = JSON.parse(fs.readFileSync(new URL('../src/data/movieReviews/shards123.json', import.meta.url)));
const ids = new Set();
let published = 0, held = 0, cues = 0, openings = 0;
for (const report of reports) {
  assert.match(report.youtubeId, /^[A-Za-z0-9_-]{11}$/);
  assert(!ids.has(report.youtubeId), `Duplicate source ${report.youtubeId}`); ids.add(report.youtubeId);
  assert.equal(report.sourceUrl, `https://www.youtube.com/watch?v=${report.youtubeId}`);
  assert.equal(report.completeTranscript, false);
  const approved = report.reviewStatus === 'reviewed_excerpts' && report.remainingWork.length === 0 &&
    !report.newOpeningExcerpts.some(c => /transcriber:|reviewer:|captioned by|subtitles by/i.test(c.en)) &&
    report.existingCueCorrections.length > 0 && report.existingCueCorrections.every(c => (c.matchScore ?? 0) >= 0.8) &&
    report.durationSeconds > 0;
  if (!approved) { held++; continue; }
  published++; cues += report.existingCueCorrections.length; openings += report.newOpeningExcerpts.length;
  assert(report.evidence.method);
  assert(report.newOpeningExcerpts.reduce((sum, c) => sum + c.en.length, 0) <= 90);
  for (const cue of [...report.newOpeningExcerpts, ...report.existingCueCorrections]) {
    assert(cue.reviewed && cue.en.trim() && cue.arEg.trim() && cue.arFusha.trim());
    assert(Number.isFinite(cue.start) && cue.start >= 0 && cue.start < cue.end && cue.end <= report.durationSeconds);
  }
}
assert.equal(reports.length, 171); assert.equal(published, 8); assert.equal(held, 163);
console.log({ records: reports.length, publishedCaptionReviewedSources: published, heldSources: held, correctedExistingCues: cues, briefOpeningExcerpts: openings });
console.log('PASS: structure/publication gate. Caption review is not waveform verification or a complete transcript.');
