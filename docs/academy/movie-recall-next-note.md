# Film caption-recall next-listening note

The optional caption-recall review now includes a private300-character next-listening note. Learners can note one word, small word or spelling detail after comparing their own draft with the reviewed source cue. The auto-direction note has its own clear-only button, disabled when empty, returning focus to the textarea. Clearing marks preserves the note; clearing the note preserves marks/current draft/first snapshot. Collapse preserves it; hiding the source, retrying, changing cue or closing practice discards it through the existing review lifecycle. Nothing is sent or saved, and there is no automatic grade.

Verified344offline checks, Arabic lint, full TypeScript/Next export, EN/AR390 production UI: disabled defaults, independent clearing/focus, collapse preservation, hide/retry resets, draft/snapshot preservation and close/exit behavior. Actual final screenshots inspected for readable note/clear button, RTL and no overflow with sign-in visible. YouTube player mocked, API blocked. No actual playback/audio/capture claim. The first tested clip has one reviewed cue, so multi-cue reset remains structural rather than exercised on this clip.

Run `python scripts/check-movie-recall-next-note-production.py`; use `TEST_ORIGIN` for canonical.
