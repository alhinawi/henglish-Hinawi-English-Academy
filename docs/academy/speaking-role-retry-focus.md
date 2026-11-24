# Speaking role retry focus

The optional written reply rehearsal now offers three focus choices before a second attempt: meaning for this turn, useful detail, or suitable tone. The selected focus and its guidance remain beside the unchanged first-reply snapshot after retry. They are private practice prompts, not feedback or a score. Changing turn/role or closing/leaving resets the choice with the drafts. Existing model, meaning hint and recordings are unchanged.

Verified343offline checks, Arabic lint, full TypeScript/Next export and all32lessons/bothroles at390px in English and Arabic. UI checks cover default meaning selection, detail/tone selection with visible guidance, locked chosen focus after retry, blank guard, immutable first draft, second-draft focus, model/meaning/collapse preservation and turn/role/close/lesson resets. Actual screenshot pixels inspected: readable chosen guidance, English drafts LTR inside Arabic RTL, no overflow and visible sign-in. API blocked, no audio/capture or grading claim.

Run `TEST_LANGS=en python scripts/check-speaking-role-retry-focus-production.py` and again for `ar`; use `TEST_ORIGIN` for canonical.
