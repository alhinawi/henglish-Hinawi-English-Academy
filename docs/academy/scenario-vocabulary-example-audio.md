# Optional real-life vocabulary example audio

All 38 original English vocabulary examples across nine real-life scenarios now offer an explicit sentence listening control. The existing shared speech component uses the established English audio flow. No autoplay was added.

The control stays inside the closed-by-default example disclosure and behind the existing meaning recall gate. Vocabulary word audio and private sentence drafts are unchanged. Remounting the keyed control clears stale feedback and cancels speech owned by the outgoing example.

Verification: offline coverage checks, reviewed locale parity, full TypeScript/static production build, and EN/AR 390px UI checks across every scenario and vocabulary example. UI tests block the audio service, check the explicit click/failure path and preservation of the learner's draft, and do not claim actual playback.
