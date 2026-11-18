# Ready-made English lesson audio

## First fix

The first speaking lesson ships four MP3 files under `public/audio/english/`. They are generated readings of the original English lesson text, not recordings of a named student or native-speaker conversation. The owner requested these prebuilt voices on 2026-11-18. Role A uses Iapetus and role B uses Erinome. No Gacrux or Pulcherrima. Sources were supplied as four WAV files, their spoken transcripts checked against each line, then encoded to 64 kbps mono MP3. No paid TTS endpoint, model download, D1 change or new server service is required for these files.

| File | Exact text | Voice |
| --- | --- | --- |
| conversation-01-line-1.mp3 | What is your name? | Iapetus |
| conversation-01-line-2.mp3 | My name is Salma. Nice to meet you. | Erinome |
| conversation-01-line-3.mp3 | Nice to meet you too. Are you a student? | Iapetus |
| conversation-01-line-4.mp3 | Yes, I study English. | Erinome |

## Delivery and scope

`STATIC_ENGLISH_AUDIO` in `voiceEngine.ts` maps exact trimmed English text to a bundled file. The clip starts directly during the tap, without waiting for an API response or an installed browser voice. Speed uses playbackRate. Existing stop, stale-request, mute and completion behavior is retained. If a file fails, the existing server/cache/browser fallback still runs, once. English lesson buttons remain retryable after an error.

This first patch covers FOUR lines, not every academy. Other known English text still uses the existing server/browser path until a verified clip is added. Reading, writing, vocabulary, grammar, pronunciation and listening consumers use the same central English engine, so matching text benefits without replacing their controls. Non-English speech remains unchanged. Custom, generated and newly imported text is not a bundled recording.

The live mobile failure was reproduced on 2026-11-18: the static site did not deliver usable synthesis audio, while the tested browser had no accepted Microsoft English voice. GET of `/api/tts/synthesize` returned 404 HTML; the button's POST did not yield playable audio. This is not evidence that the user's phone settings are wrong. Browser layouts were emulated, not run on the user's physical device.

## Verification

Run `node scripts/check-static-academy-speech.cjs`, then `npm run build:next` and `python scripts/check-static-academy-speech-production.py`. The mobile Chromium fixture uses the Pixel 7 profile, disables speechSynthesis, enforces user-activation playback, and verifies actual MP3 playback time and ended events for all four lines, no synthesis requests, no error feedback, Stop and retry. It does not stub HTMLAudioElement playback. Full academy-wide static coverage remains follow-up work.
