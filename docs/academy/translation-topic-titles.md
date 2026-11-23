# Find translation tasks by topic

The task picker listed only position, level and language direction. Many tasks looked identical, so finding a specific topic required opening each one. All32 tasks now have distinct short EN/AR/DE topic titles in the picker and a matching active heading above the source. Titles identify a topic without displaying the model translation.

Sources, answers, photos, stable task IDs, filters, wrap navigation, draft/revision/reflection/checklist isolation and hidden-help/model behavior are unchanged. No new network, storage, scoring or dependencies. TeacherDashboard untouched.

Verification:261 offline regressions, locale check, full TypeScript/Next static export passed. EN/AR390 all32 localized titles match active headings; isolated drafts/revisions/checks, all12 level-direction combinations, hidden help/model/revision and previous/next wrap passed. Existing all32 revision-reflection UI suite passed. Actual local pixels inspected: titles readable, no horizontal overflow, دخول visible. Native select truncates long option labels at narrow widths, while the active title is fully readable below. No audio/network claim.
