# Ready-made English lesson audio

## Speaking coverage

All 32 speaking lessons ship 128 MP3 files under `public/audio/english/`. They are generated readings of the original English lesson text, not recordings of a named student or native-speaker conversation. The owner requested these prebuilt voices on 2026-11-18. Role A uses Iapetus and role B uses Erinome. No Gacrux or Pulcherrima. The first four were supplied as WAV files and encoded to 64 kbps mono MP3; 124 more were supplied as individually generated 48 kbps mono MP3. All files pass decode/duration checks. Concatenated verification transcripts match the full expected text, allowing only number/spelling formatting and British/American spelling transcription differences. The complete id/text/voice/path manifest is in `docs/speaking-audio-manifest.json`. No paid TTS endpoint, model download, D1 change or new server service is required for these files.

| File | Exact text | Voice |
| --- | --- | --- |
| conversation-01-line-1.mp3 | What is your name? | Iapetus |
| conversation-01-line-2.mp3 | My name is Salma. Nice to meet you. | Erinome |
| conversation-01-line-3.mp3 | Nice to meet you too. Are you a student? | Iapetus |
| conversation-01-line-4.mp3 | Yes, I study English. | Erinome |

## Delivery and scope

`STATIC_ENGLISH_AUDIO` in `voiceEngine.ts` maps exact trimmed English text to a bundled file. The clip starts directly during the tap, without waiting for an API response or an installed browser voice. Speed uses playbackRate. Existing stop, stale-request, mute and completion behavior is retained. If a file fails, the existing server/cache/browser fallback still runs, once. English lesson buttons remain retryable after an error.

This patch covers ALL 128 dialogue lines across 32 speaking lessons, not every academy. Other known English text outside these dialogue lines still uses the existing server/browser path until a verified clip is added. Reading, writing, vocabulary, grammar, pronunciation and listening consumers use the same central English engine, so matching text benefits without replacing their controls. Non-English speech remains unchanged. Custom, generated and newly imported text is not a bundled recording.

The live mobile failure was reproduced on 2026-11-18: the static site did not deliver usable synthesis audio, while the tested browser had no accepted Microsoft English voice. GET of `/api/tts/synthesize` returned 404 HTML; the button's POST did not yield playable audio. This is not evidence that the user's phone settings are wrong. Browser layouts were emulated, not run on the user's physical device.

## Verification

Run `node scripts/check-static-academy-speech.cjs`, then `npm run build:next` and `python scripts/check-static-academy-speech-production.py` and `python scripts/check-all-speaking-clips-production.py`. The mobile Chromium fixture uses the Pixel 7 profile, disables speechSynthesis, enforces user-activation playback, and verifies actual MP3 playback time and ended events for all four lines, no synthesis requests, no error feedback, Stop and retry. It does not stub HTMLAudioElement playback. Every speaking dialogue line also passes a mobile-profile actual play-time advance/Stop test. Full academy-wide static coverage remains follow-up work.

## Academy expansion

An additional 232 individually generated MP3 recordings cover all 42 listening lessons (passage and dictation), 36 reading passages, 36 writing models, 36 minimal-pair pronunciation words and 40 legacy-speaking dialogue lines. The full manifest is `docs/academy-audio-manifest.json`. All 360 recordings, including the earlier 128 speaking clips, map to349 distinct exact texts. Shared text keeps the first recording rather than issuing duplicate network calls. Every supplied file is retained. All new recordings fully decode and pass duration/mono-MP3 checks.

This does not yet cover the vocabulary bank, verb forms, pronunciation vowel-chart examples, grammar/course examples, full combined legacy dialogue playback, arbitrary user/AI text or every game item. Those retain the existing fallback. Generated single-word pronunciation needs phonetic review for homographs before treating it as an authoritative IPA recording.
