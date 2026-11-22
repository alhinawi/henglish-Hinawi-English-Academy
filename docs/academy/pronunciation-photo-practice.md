# Pronunciation photo practice

Four optional photo-led sentence tasks connect sound work to an original sentence. Suggested words and focus sounds are prompts, not a closed answer set. Examples stay hidden until requested. No automatic score, speech recognition, upload, or persistence is added. The existing local recorder has its existing 90-second cap; closing or changing scenes unmounts it and clears its recording. Previous minimal-pair and vowel tools are unchanged.

Reused photography, source and license records in `docs/academy-topic-photography.json`:
- Study: `/images/listening/study.webp`, books and pen on a desk.
- Travel: `/images/pool/scene-travel.webp`, passport above a map.
- Meeting: `/images/listening/meeting.webp`, people with notebooks around a table.
- Presentation: `/images/pool/scene-interview.webp`, people watching a presenter.

These are illustrative stock photographs, not Henglish learners, staff or endorsements. Sentences are language prompts, not claims about the photographed people or events.

Verification: `node scripts/check-pronunciation-photo-practice.cjs`, full offline suite, i18n, TypeScript/Next export and `python scripts/check-pronunciation-photo-practice-production.py`. Browser checks cover both EN/AR at 390px, all four photos loading, optional example, scene resets and microphone-denial cleanup. Real microphone capture and playback remain unverified in automation.
