# Caption review integration: all 5 shards

Input: 285 unique source records returned 2026-11-16, structurally valid. Shards1-3: 171 records (144 labeled reviewed, 27 partial). Shards4-5: 114 records (107 labeled reviewed, 7 partial). These are caption-track/ASR reviews, not waveform timing checks.

Conservative publication gate: no remainingWork, at least one corrected supplied cue, every supplied cue score >= 0.8, positive source duration, and no caption-credit opening. This leaves **8 caption-reviewed source sets, 17 supplied cue corrections, 5 brief opening excerpts**. No complete-transcript claim. UI states caption-based review and possible timing/word differences.

**277 source IDs are unavailable for practice**, not deleted: all partials and sources containing weak matches/unresolved lines, including caption credits incorrectly offered as speech. Shards4-5 had no eligible source (all had remainingWork and correction records omitted matchScore). Godfather remains independently corrected. All 300 catalog records / 286 source IDs are preserved. Held sources expose no player, subtitles, quote, vocabulary, quiz, or echo tasks. Corrections cover old saved/history/direct inputs. No external source audio/video is bundled.

Held raw candidate reports remain private rather than publishing their dialogue. captionReviews.json stores their source identity, evidence, reasons and candidate counts with no held candidate text. Allowed reports retain reviewed cues and evidence caveats. A reviewStatus flag alone never enables publication.

One clear Arabic issue was corrected: Batman opening addresses Bruce in the masculine, not Rachel in the feminine. Source remains only caption-reviewed.

Checks: validate-movie-reviews.mjs; TypeScript; Arabic lint; production build; browser source-count checks (8 allowed / 277 held), cue bounds, no held-data leaks, stale cache normalization; 390px reviewed/held-state screenshots, no horizontal overflow/page errors. Actual playback was not repeated for all 285 sources by integrator.

Remaining: raw matched-caption evidence for weak/unmatched candidates, caption-credit filtering, sound checks. Release held sources only after evidence resolves their gaps.
