# Speaking follow-up next-reply note

All64 follow-up tasks across32lessons now have an optional private300-character next-reply note. Auto direction, clear-only button disabled when empty, focus return. Clearing preserves the first/second reply, chosen retry focus and overall plan. Retry and collapse preserve the note; existing task/close/lesson lifecycle discards it. No message, storage, scoring or recorder changes.

Verified347offline checks, Arabic lint, full TypeScript/Next export and all64tasks EN/AR390 production UI. Checks cover disabled defaults, independent clear/focus, draft/snapshot/chosen-focus/plan preservation, retry/collapse preservation and task resets. Actual screenshots inspected: readable note/button, Arabic RTL, no overflow and sign-in visible. API blocked, no actual audio/capture or grading claim.

Run `TEST_LANGS=en python scripts/check-speaking-followup-next-note-production.py` then for `ar`; set `TEST_ORIGIN` for canonical.
