# Last-resort audio rollout

The adapter is off unless `AUDIO_FALLBACK_ENABLED` is exactly `true`. No configuration in this PR enables it. Bind `AUDIO_FALLBACK` to the reviewed shared service and store `AUDIO_FALLBACK_SERVICE_TOKEN` as a server secret. Never put the token in frontend environment variables.

Order: bundled clip, free server audio, permitted Microsoft browser voice, then one shared-service request after genuine failure or a bounded no-start timeout. Stop, route cleanup, supersession, AbortError and autoplay denial never start vendor fallback. Browser code sends only text, profile and failure reason; the server maps the US/UK and male/female profile to the four pinned provider voice IDs. The shared service owns text allowlisting, caching, quotas and key rotation. Denials are terminal.

The allowlist is a reviewed export, not a user-editable endpoint. Run `node scripts/build-audio-fallback-allowlist.cjs`; send the JSON array and its count/hash/source-commit manifest to the shared-service owner. Current scope is bundled static English speech, frequency headwords/examples and the sentence library. Other lesson text and free-form user input remain denied until another reviewed export adds them. Import/deploy this list before enabling the site flag.

Neither the pool nor the adapter has been enabled or deployed by this PR. Live key eligibility and speech quality require the deployer's checks. Local tests use synthetic audio and do not consume vendor quota.
