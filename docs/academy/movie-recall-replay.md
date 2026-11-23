# Replay from a recall cue

The reviewed-cue recall panel now has a direct listen-again control. It starts at the selected source-reviewed cue and continues within the current clip using the existing bounded YouTube player. It does not claim to play only one cue, hide the transcript above, or grade the attempt. The note states these limits and asks the learner to pause when ready.

Replay clears an existing sentence loop, leaves the draft and reveal state unchanged, and does not add new dialogue or timestamps. The panel is still restricted to reviewed transcripts, with existing close/clip resets. Original player, sentence-loop, speed, recall and echo/own-words tools remain.

Verification: offline regression suite, i18n, TypeScript/Next export, EN/AR390px interaction and pixels. The player is mocked for UI tests, asserting the bounded load callback, draft/model preservation, explicit scope note and close/reset. This is not evidence of actual YouTube playback or rights/availability changes.
