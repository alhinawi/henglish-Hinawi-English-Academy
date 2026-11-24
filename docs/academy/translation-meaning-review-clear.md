# Translation meaning review marks

All44 translation tasks now have a clear-only button for the two optional meaning-check marks. It is disabled when neither mark is selected. Clearing marks preserves the private next-try note, original draft and revised translation. The existing clear-note control preserves marks and returns focus to the note.

Verified:341offline regression checks, Arabic lint, full TypeScript/Next static export. EN/AR390 production UI across44tasks checks disabled defaults, independent clearing, notes/drafts/revision preservation, all88 Egyptian check meanings, collapse preservation and hide/task resets. Actual pixels inspected: readable EN/AR controls, note, revision, no overflow and visible sign-in. API calls blocked, no AI grading claim. No API/storage/scoring/TeacherDashboard changes.

Run `python scripts/check-translation-meaning-review-clear-production.py`; `TEST_ORIGIN` selects canonical and `TEST_LANGS` selects languages.
