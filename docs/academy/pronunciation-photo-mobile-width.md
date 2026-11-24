# Pronunciation photo mobile width

Applied the same readability correction to photo follow-up sentence frames: smaller mobile outer/challenge insets, no border-in-border mobile frame/meaning padding, smaller frame card padding. Desktop spacing preserved. No content/state/feature changes.

All56frame cards across28photos measure322px at390px and252px at320px, in English and Arabic. Actual scene and frame pixels inspected at both widths: readable mixed-language content, no overflow, sign-in visible.

Verified359offline checks, Arabic lint, full TypeScript/Next export, all28photos56meanings and all28sentence-plan interactions EN/AR390. Dedicated width/language checks pass all28photos in both widths/languages. No actual capture/playback/assessment claim.

Run `python scripts/check-pronunciation-photo-mobile-width-production.py`; `TEST_ORIGIN` selects canonical.
