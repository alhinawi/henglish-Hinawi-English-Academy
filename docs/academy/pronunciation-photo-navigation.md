# Pronunciation photo navigation

The twelve photo speaking tasks now have explicit Previous photo and Next photo controls and a polite current-photo count. The first and last endpoints are disabled rather than wrapping. The existing direct selector remains available and shares the same transition function.

Every actual scene change stops speech, hides the model and recorder, and resets scene-keyed private sentence plans and self-review. The private plan now uses a unique sibling key, preventing a stale duplicate plan when switching scenes while both model and recorder are open. No completion, grade or persistent progress is implied by the count. Existing photo content and practice features are preserved.

Verification covers offline guards and locale parity, a full TypeScript/static production build, and EN/AR 390px traversal through all twelve tasks in both directions, selector synchronization, disabled endpoints, loaded photography, model/recorder/plan resets, and microphone-denial cleanup. No actual recording or audio playback is claimed.
