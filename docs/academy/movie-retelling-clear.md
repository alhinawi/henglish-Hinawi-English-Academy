# Clear the current retelling without losing context

Film private retelling now has an explicit clear-current-version action. It is disabled for an empty field and returns focus to writing. It clears only the editable version, preserving the first snapshot, chosen revision focus, plan and recording. Works before and after starting a second version. EN/AR/DE labels. Existing private-state resets and no-grade behavior remain. TeacherDashboard untouched.

Verification:272 offline regressions, locale check, full TypeScript/Next export passed. New clear and existing focus EN/AR390 suites passed first/second clear, empty disabled state, focus return, first snapshot/plan/revision-focus preservation, existing retry/reset behavior. Actual local pixels inspected: readable, no overflow, دخول visible. First clip/one cue tested; cue reset structural. YouTube mocked; no actual audio/capture claim.
