# Independent clear controls for film own-words review

Weak piece: learners could not reset own-words review marks or their next-try note without manually undoing each item or leaving practice and losing other work. Added separate clear-only controls. The mark control changes only the three checkmarks; the note control changes only the 300-character note and returns focus. Empty controls are disabled.

Original reviewed cue content, full-clip playback, echo/own-word modes, private retelling, source visibility, plan, recording and completion logic unchanged. No API, storage, scoring, audio or TeacherDashboard changes.

337 offline checks, Arabic lint and full TypeScript/Next export passed. EN/AR390 verified empty controls, independent mark/note clearing, note focus, plan preservation, collapse persistence, mode/close/exit reset, mic-denial cleanup and pause callbacks. Actual expanded review pixels inspected: readable, Arabic RTL, no overflow, دخول visible. Player mocked for deterministic UI checks; no actual media/audio/capture claim. First tested clip has one reviewed cue, so cue reset is structural coverage, not a multi-cue playback claim. Canonical verification follows deployment.
