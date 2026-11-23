# Translation practice hints

Each of the 20 existing practice challenges has an optional context and vocabulary panel before the draft. It uses the task's source `contextHintAr` and `keyVocabulary`, rather than generated translations or lookup requests. Context is explicitly labeled Arabic, including in English/German UI. English terms are LTR and Arabic context/meanings RTL.

Hints start closed and close on previous/next, level filter and direction filter changes. Opening or hiding help does not reveal the full model, alter drafts, revisions or review checks. Model translations remain under their existing explicit button. No grading, upload or persistence is added. Original challenge content, photographs, source audio, filters and second-version workflow remain.

The existing C2 rhetoric context incorrectly called the source sentence an inversion. It now describes its actual paired rhetorical structure, without that claim. No source sentence or model translation was removed.

Verification: 215 offline regressions, i18n, TypeScript/Next export. EN/AR 390px UI checks visit all 20 tasks, check source context/vocabulary visibility, model hiding, draft retention and navigation/filter resets. Existing revision tests cover six levels and both directions. API requests are mocked unavailable in UI tests, not presented as working external translation.
