# Translation mobile activity width

Corrected excessive stacked horizontal padding around practice vocabulary sentence activities. Practice-only outer inset and practice/help/vocabulary padding are smaller below the small breakpoint. Mobile sentence/review disclosures no longer add border-in-border padding. Desktop spacing is preserved. No content, state or interaction changes.

Review cards measure 300px at390px and230px at320px in both English and Arabic. Inspected actual pixels for activity start, entire word activity and review at both widths. Text is readable with fewer short wrapped lines; no horizontal overflow, sign-in visible.

Verified358offline checks, Arabic lint, full TypeScript/Next export, all82word activities across44tasks EN/AR390 with existing interaction test. Dedicated320/390test verifies width, no overflow and first/revised sentence/check interaction. No actual audio/assessment claim.

Run `python scripts/check-translation-mobile-activity-width-production.py`; `TEST_ORIGIN` selects canonical.
