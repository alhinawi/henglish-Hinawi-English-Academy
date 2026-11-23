# Hear the photo-task example

Four existing photo-led pronunciation tasks offered a model sentence but no way to hear it. Each revealed example now has an explicit listening control using LessonSpeechButton, the existing permitted voice pipeline. No autoplay or new provider. Listening controls disappear while the recorder is open, and model hide, scene change, recording toggle or unmount cancels speech. Text, photos, recorder and existing practice are preserved. EN/AR/DE labels explain optional listening and no pronunciation assessment.

Verification: offline regressions, i18n, TypeScript/full Next static export, EN/AR390 all four loaded photos, hidden-model gate, recorder guard, model/scene reset and denial cleanup. Actual pixels inspected. Audio APIs are unavailable and microphone denied in tests, no real playback/capture claim.
