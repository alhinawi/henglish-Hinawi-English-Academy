# Real-life transfer plan second attempt

All9completed scenarios now let learners keep a first private response plan and write one second plan. Whitespace-only plans cannot start retry. The first snapshot is immutable; second plan starts empty with focus. Clear-current removes only the current plan and preserves first, review marks and next-step note. No automatic grade or model answer.

Recorder and review controls preserve both plans. Closing practice, replaying or leaving discards both through the existing lifecycle. Direction stays automatic so either language is usable. No API/storage/audio/TeacherDashboard changes.

Verified351offline checks, Arabic lint, full TypeScript/Next export and all9scenarios ENAR390 production UI. Actual pixels readable, RTL correct, no overflow, sign-in visible. Mic denial exercised for cleanup; no actual capture/playback/network/assessment claim.

Run `python scripts/check-scenario-transfer-plan-retry-production.py`; `TEST_ORIGIN` selects canonical and `TEST_LANGS` selects language.
