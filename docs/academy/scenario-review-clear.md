# Real-life response review clear controls

The optional own-response reflection across all nine real-life scenarios now has separate clear-only controls for review marks and the 300-character next-try note. Empty controls are disabled. Clearing the note returns focus to its textarea. Neither action affects the speaking plan, completion or score. Existing collapse and close/replay/exit reset behavior is unchanged.

Verification: 340 offline regression checks, Arabic lint, full TypeScript and Next static export. Production UI at 390px in English and Arabic tested all nine scenarios: disabled defaults, independent clearing and note focus, plan preservation, collapse preservation, close/replay/exit resets and mic-denial cleanup. Actual screenshots inspected for readability, overflow, Arabic RTL and visible sign-in. API calls blocked and microphone deliberately denied. No actual media capture or audio playback claim.

Run `python scripts/check-scenario-review-clear-production.py`; use `TEST_ORIGIN` for canonical and `TEST_LANGS` to select languages.
