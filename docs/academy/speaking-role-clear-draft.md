# Speaking role current-reply clear

The optional written role rehearsal now has a clear-only control for the current reply. Disabled when empty, it clears the textarea and returns focus without touching the first-reply snapshot, chosen retry focus or next-reply note. It works before and after retry. Existing model, meaning, recording and lifecycle behavior remains unchanged.

Verified346offline checks, Arabic lint and full TypeScript/Next export. All32lessons/bothroles EN/AR390 production UI: clear before/after retry, empty-disabled state, focus return, first snapshot/note/chosen-focus preservation plus existing model/meaning/collapse preservation and turn resets. Actual screenshots inspected: readable current-reply control and preserved snapshot/note, LTR English inside Arabic RTL, no overflow, visible sign-in. API blocked, no actual audio/capture or grading claim.

Run `TEST_LANGS=en python scripts/check-speaking-role-clear-draft-production.py` then for `ar`; set `TEST_ORIGIN` for canonical.
