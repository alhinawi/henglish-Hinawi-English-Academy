# Optional meaning support for caption recall

Recall tasks could be too hard without context. A closed optional meaning hint now exposes the cue's existing Egyptian Arabic translation while the English source stays hidden. The interface explicitly names the language and explains this is meaning support, not a word-for-word answer or listening assessment. No generated translation. Empty meanings do not render; cue change/close resets the native disclosure. Drafts, retry comparison and bounded replay remain unchanged. EN/AR/DE UI.

Verification: regressions, i18n, TypeScript/full Next export; EN/AR390 original nonempty Arabic hint, closed default, English still hidden, draft retention, cue/close reset and all prior retry/replay assertions. Actual pixels inspected. YouTube mocked, no real playback claim.
