# Film source recall for own-words practice

The weakest part of own-words practice was that learners always saw the source, making copying easier than retrieval. An optional hide/reveal control now removes the source line and masks every option in this exercise's cue menu. Guidance explicitly says the player transcript is unchanged. Echo mode still shows the reviewed source.

Private plans, recorder and self-review are preserved when toggling visibility. Closing practice, changing cue or changing mode resets visibility. No storage, network requests, grading or new dialogue. Reviewed-transcript gate is unchanged. EN/AR/DE guidance included. TeacherDashboard unchanged.

Verification: 250 offline checks; locale check; full TypeScript/Next static export. EN/AR390 tests cover hide/reveal, masked menu, plan preservation, mode/open/close/exit resets, pause callback and mic-denial cleanup. Existing own-words and self-review suites pass. Actual local pixels inspected for readable content, no horizontal overflow and Arabic دخول visibility. YouTube mocked for deterministic UI tests, no actual audio/capture claim. First clip has one cue, cue-reset also checked structurally.
