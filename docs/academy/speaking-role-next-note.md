# Speaking role next-reply note

The optional written role reply across32lessons/bothroles now has a private300-character next-reply note with auto direction and a clear-only button. Empty button disabled; clear returns focus. Note, first/second replies and chosen retry focus are independent. Retry preserves the note. Existing turn/role/restart/close/lesson lifecycle discards it. Model, meaning hints and recorder remain unchanged. This is personal reflection, not feedback or a score.

Verified345offline checks, Arabic lint, full TypeScript/Next export and all32lessons/bothroles EN/AR390 production tests. UI checks cover disabled defaults, independent clear/focus, retry preservation, first/second drafts and chosen guidance preserved, model/meaning/collapse preservation and turn resets. Actual note/button screenshots inspected: readable EN/AR, no overflow, English LTR inside Arabic RTL, sign-in visible. API blocked, no actual audio/capture or grading claim.

Run `TEST_LANGS=en python scripts/check-speaking-role-next-note-production.py` then again for `ar`; set `TEST_ORIGIN` for canonical.
