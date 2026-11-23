# Listen to photo follow-up questions

The twelve photo follow-up questions had text and Egyptian Arabic meanings, but no listening control. Each question now has an explicit English listen button inside its closed optional challenge. It reads the question, not a sample answer, without revealing the model.

Uses the existing shared speech control and voice policy, no new service or autoplay. Listening is unavailable while local recording practice is open. Closing the challenge, changing scene, toggling model/recorder or leaving stops speech. EN/AR/DE guidance. Existing photos, private planner, meanings, model and recording remain unchanged. TeacherDashboard untouched.

Verification: 258 offline regressions, locale check, full TypeScript/Next static export passed. Build required a larger local Node heap after the default heap ran out; successful full build used 1536MB. EN/AR390 all12 scenes passed explicit listen/disclosure/recorder guards, loaded photos, model independence and microphone-denial cleanup. Existing photo challenges and model audio suites passed. Actual local pixels inspected, readable/no overflow/دخول visible. Button interaction and fallback UI tested, not actual sound output or microphone capture.
