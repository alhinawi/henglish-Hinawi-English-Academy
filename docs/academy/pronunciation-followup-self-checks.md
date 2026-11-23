# Check photo follow-up completeness

The 12 photo follow-ups had private answer fields but no task-specific way to review whether the response answered both parts. Each now has two original manual content checks, 24 total, nested in the optional written answer. English criteria are learning content in every locale; instructions are EN/AR/DE.

Closed and unchecked by default. Collapse retains marks. Clear checks changes neither the answer nor the sentence plan. Clearing the answer does not clear marks. Changing photo or leaving discards local state. No automatic content/pronunciation score, progress effect, storage or network request. Existing recording/model/help behavior preserved. TeacherDashboard untouched.

Verification: 281 offline regressions, locale check (existing fallback warnings), TypeScript/Next export passed. New all-12-photo EN/AR390 suite verifies 24 checks, defaults, collapse retention, independent clear, unchanged answer and scene reset. Existing photo answer suite passed all 12 with model/help/recorder retention and microphone-denial cleanup. Actual local EN/AR390 pixels inspected readable, no overflow, دخول visible. No actual audio playback/capture claim.
