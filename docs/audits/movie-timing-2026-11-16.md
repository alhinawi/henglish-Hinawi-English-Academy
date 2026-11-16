# Video timing audit - 2026-11-16

## Scope and verified counts
- Statically inspected all 300 built-in catalog entries, representing 286 unique source-video IDs. All 300 had a first stored excerpt beginning after 0 seconds.
- These arrays are sparse educational excerpts, not complete source transcripts. A nonzero first cue does not by itself prove that dialogue starts at zero or that all times should be shifted.
- Audio-reviewed **1 source**: https://www.youtube.com/watch?v=D6me2-OurCw . Confirmed its missing opening sentence, the later family excerpt and offer excerpt, and actual duration 88.321 seconds. Added the opening at 0, the following short reply, corrected the two selected later excerpt windows and removed mismatched passages from the timed view. Original records remain in the original seed data for review, but a source-ID correction is applied to every playback path.
- **285 unique sources remain without a source-audio opening-line/timing audit.** No claim is made that their first sentences or complete transcripts are repaired.
- The companion JSON records every entry's original configured start/end, first cue and cue count. It is a static-data audit, not proof of video availability, caption accuracy or source playback.

## Shared player fixes
- Start and replay from source 0:00. Use YouTube's actual video end, not an unverified catalog excerpt end. Do not reset playback merely because it passes the old excerpt end.
- Highlight only a cue whose start <= source time < end. Before the first cue, in gaps and after the last cue, do not mislabel a future/past line as currently spoken.
- Disable sentence looping when no timed line is active. Reset loop state on source change.
- Keep transcript scrolling instant to avoid unnecessary animation and scroll jumps.
- Label the sparse text as available excerpts, with a visible incomplete-transcript note. Do not fabricate a cue at zero for other videos.
- Apply the source correction to movie search, dynamic catalog, direct player input, saved videos and watch history, including old cached copies.

## Remaining work
A complete per-video audit requires reviewing each of the remaining 285 source uploads, obtaining its actual opening words and measured cue boundaries, and recording its actual duration. This patch does not replace that work with a global -12-second shift or invented captions. No source was removed, no video ID was silently swapped, and no external download was published.
