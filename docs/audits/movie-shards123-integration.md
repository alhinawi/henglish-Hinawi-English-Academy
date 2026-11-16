# Caption review integration: shards 1-3

Input: 171 source records returned 2026-11-16, structurally valid. Reviewer labels: 144 reviewed_excerpts, 27 needs_review. These are caption-track/ASR reviews, not waveform timing checks.

Conservative publication gate: a source must have no remainingWork, at least one corrected supplied cue, every accepted supplied cue score >= 0.8, positive source duration, and no caption-credit opening. The gate leaves **8 caption-reviewed source sets, 17 supplied cue corrections, 5 brief opening excerpts**. No complete-transcript claim is made. The UI states caption-based review and possible timing/word differences.

**163 source IDs are unavailable for practice**, not deleted: 27 original needs_review, plus otherwise candidate sources containing weak matches/unresolved lines, including one with caption credits incorrectly offered as dialogue. This preserves all 300 catalog records / 286 source IDs. Held sources expose no player, subtitles, vocabulary, quiz, or echo tasks. Source-ID corrections also cover old saved/history/direct inputs. No external source audio/video is bundled.

The complete candidate reports and evidence caveats are retained in src/data/movieReviews/shards123.json for further review. Low-score cues are not promoted because a structural validator passes. A source's reviewStatus flag alone never enables publication.

One clear Arabic issue was corrected: Batman opening addresses Bruce in the masculine, not Rachel in the feminine. The source remains only caption-reviewed.

Checks: validate-movie-reviews.mjs; TypeScript; Arabic lint; production build; browser source-count checks (8 allowed / 163 held), cue bounds, no held-data leaks, stale cache normalization; 390px reviewed/held-state screenshots, no horizontal overflow or page errors. Actual source playback was not repeated for all 171 sources by the integrator.

Remaining: raw matched-caption evidence for weak/unmatched candidates, caption-credit filtering, and later shards. Release held sources only after evidence resolves their gaps.
