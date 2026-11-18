# Protected Henglish audio (not activated)

## State

The synthesis route now delegates to the Henglish API Worker. Generation is off unless `TTS_ENABLED` is exactly `true`. This change does not upload keys, change a remote database, deploy a Worker, or generate a public audio library.

Activation is held for the owner's licensing decision and explicit approval for additive TTS tables. A private Alice preview was checked separately. Free ElevenLabs output has publication restrictions; a working key does not establish a right to publish. Do not activate public generation until that question is settled.

## Keys and providers

Only the API Worker receives these secrets:

- `ELEVENLABS_KEYS_POOL`: nine comma-separated slots, IDs 1 through 9. Keep empty slots empty, rather than moving later accounts to another ID.
- `ELEVENLABS_KEY_HENGLISH_13` and `ELEVENLABS_KEY_HENGLISH_14`: dedicated Henglish reserves, tried only after usable shared keys.

No frontend key, Pages key, Vercel key, paid upgrade, billing activation or Google speech provider is required. Never add raw keys to source, logs or generated files. Hosting adapters use the fixed Worker URL in `server/protectedTtsProxy.ts`, not a caller-selected URL.

The Worker allows only the 18 existing catalog voices checked as premade English voices in the account inventory on 2026-11-18. The four accent/gender defaults remain Sarah, Roger, Alice and George. Recheck availability before activation and replace voices before provider retirement rather than silently substituting one. Recorded clips still take priority where a component has one; a proxy failure reaches the existing explicit same-language Microsoft browser fallback. Unknown, default, wrong-language and Google browser voices are not allowed.

## Manifest

From the repository root:

```sh
node scripts/build-tts-manifest.cjs
```

This writes `/tmp/henglish-tts-manifest.sql` and its summary. It reads real tracked curriculum and banks, adds only selected English learning fields and voice-preview phrases, hashes the exact trimmed text, and never calls ElevenLabs. The request must match both the hash and stored text. Arbitrary tutor output, translations, user input and unknown passages cannot consume ElevenLabs quota; those can use only the permitted browser fallback.

The initial manifest contains 76,363 unique texts and 2,132,619 characters, before voice variants. This is not a promise to synthesize the whole library using free accounts. Start with an approved small lesson set, verify it, then expand only within verified free capacity. Text outside the manifest fails closed. If content changes, regenerate and import the new entries before expecting its audio to work.

## Durable safeguards

- D1 binary cache is keyed by text hash, explicit voice and model. Speed is applied in the player, so it cannot charge for another recording.
- The UTC daily character cap defaults to 9,000. `TTS_DAILY_CHAR_CAP` may lower it, not raise it. An atomic SQL reservation prevents concurrent requests from exceeding it. Cache hits do not consume the cap.
- Failures stay counted locally because a lost upstream response may already have consumed characters. No uncertain synthesis request is retried on another key.
- A per-recording D1 lease prevents duplicate concurrent synthesis. It expires after ten minutes if a Worker dies. Completed and failed jobs remove only their own token.
- Each candidate key's subscription is checked immediately before generation. Paid tiers, character overage, an unreadable balance and an insufficient balance are rejected. A shared key may also be in use by another site, so only the provider can enforce its final remaining balance.
- Explicit quota errors park that account until its actual subscription reset timestamp, not the first of a calendar month. If the timestamp cannot be verified, park for 24 hours. Invalid keys park for 24 hours. Quota rejection can fail over within the same request; uncertain network/provider failures cannot.
- Audio must be nonempty, an audio MIME type and at most 1.8 MB. A cache-size budget of 350 MB stops new recordings, never evicts existing audio. This is an internal budget, not proof of remaining account or database capacity.
- Audio is saved before a successful response. Provider error bodies and keys are never returned. Request text is limited to 5,000 characters and the JSON body to 24,000 characters. New requests have a bounded upstream deadline.

## Local checks

```sh
cd backend
npm run typecheck
npm run test:tts
```

The tests use a local D1 instance and synthetic audio only. They cover exact manifest gating, default-off behavior, explicit voices, durable binary reuse, stable key IDs, reset parking and immediate quota failover, rejection of paid plans, atomic daily reservations, concurrent job deduplication and lock cleanup. They do not spend provider characters.

## Activation checklist (requires the separate approvals above)

1. Confirm the public-use license, intended attribution and all voice availability. Do not bypass a license restriction by rotating free accounts.
2. Export the existing remote D1 database to a private backup. Verify the export completed and record its location and timestamp before applying anything. Check actual remaining free storage and request capacity, without activating billing.
3. Inspect `backend/migrations/0005_tts.sql`. It adds only five `tts_` tables and never alters or drops existing tables. Apply only after the explicit schema approval. Import the generated manifest in supported batches and verify representative rows, counts and exact text.
4. Store the keys only as Worker secrets. Verify each key's account tier, overage state and reset. Never print a key.
5. Deploy while `TTS_ENABLED` is absent or false. Check the disabled route and existing account APIs.
6. Only with publication approval, enable the route with a small cap, verify one real lesson and repeat it to confirm a durable cache hit without a second charge. Check mobile playback, Stop, fallback/error state, and unchanged account behavior. Have the owner hear the preview before expanding.

## Rollback

Set `TTS_ENABLED=false` and deploy the Worker to stop new synthesis immediately. Existing audio and all account data remain untouched. Revert the application PR through another reviewed PR if needed. Do not drop TTS tables or restore a database over live user data without a separate recovery decision. The backup is a recovery artifact, not permission to overwrite newer account activity.

Policy references checked during preparation:

- https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform
- https://elevenlabs.io/docs/overview/capabilities/voices
