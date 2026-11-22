# Pronunciation sound-to-sentence workshop

The previous pronunciation chart contained eight vowels and example-word playback only. The workshop keeps those entries, adds the remaining sounds of a traditional British-English teaching inventory (12 steady vowels and 8 glides), and connects each sound to an original sentence, a mouth-position tip and local self-recording.

The inventory is a teaching model, not a claim that all English accents share one set of sounds. Near, chair and tour have explicit variation notes. Speech is synthesized in a UK reference voice, not a phoneme recording or an assessment. The recorder is reused from the speaking academy, keeps audio locally, releases tracks on unmount, and does not give an automatic score.

## References checked November 22, 2026

- https://learnenglish.britishcouncil.org/apps/learnenglish-sounds-right explains pure-vowel/diphthong grouping and word-based listening practice. The UI links to it; no chart image or recorded material was copied.
- https://cambridgeveritas.com/tools/accent-enhancer describes the traditional 12/8 British teaching inventory, accent variation, and the progression from sounds to words, sentences and self-recording. Sentences and practice tips here are original.

## Verification

- 190 offline checks, including all existing pronunciation/audio/recorder regressions.
- TypeScript and canonical Next production build.
- English/Arabic 390px production-export test: all 20 sounds; 12/8 filters; sentence selection; UK speech-request parameters; pending Stop; simulated microphone denial; keyed recorder reset; no overflow.
- UI tests intercept API requests and simulate microphone denial. They do not establish actual vendor speech quality or successful real-device microphone capture.
