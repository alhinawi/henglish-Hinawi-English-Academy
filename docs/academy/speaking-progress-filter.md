# Speaking lesson progress filter

The 32-lesson catalog can show all lessons, not completed, or completed using the existing account-scoped completion union. Counts cover the whole academy; visible results intersect status with the existing level and search filters. No proficiency judgment is made. Opening a lesson does not mark it complete or award XP.

Default remains all lessons. Reset filters clears status, level and search together. Clear search/Escape keeps status and level. Opening a lesson and returning keeps catalog filters. No new storage or completion write is added; existing owner-keyed remount and completion logic remain unchanged.

Verification: 218 offline regressions, i18n, TypeScript/Next export. Existing expression tests now supply default status/done variables and retain their original search assertions. EN/AR390px UI tests seed two completion IDs in isolated test-browser guest storage only, verify 32/30/2 counts, status-level-search intersection, empty recovery, open/back with no completion change, no overflow and actual pixels. No invented completion is shipped or written to a real user's account. Existing search recovery regression also passes.
