# Listen to a completed minimal-pair context

After a correct semantic word choice, learners can request audio of the unchanged full context sentence. This uses the existing LessonSpeechButton and speech pipeline, not a new voice provider. No autoplay. Incorrect/unanswered choices have no sentence audio, so the answer is not given away first.

The audio buttons appear only when the local recorder is closed. Opening the recorder already cancels other audio through the existing onToggle reset. Closing recording makes sentence listening available again. Pair changes unmount the old speech buttons. Existing 18 contrasts, 36 sentences, choices, quiz and recording remain unchanged.

Checks: offline suite, i18n, TypeScript/Next export, EN/AR390px correct/incorrect visibility, recorder guard, pair reset, local denial/reset and pixels. Browser checks exercise the control with API paths unavailable, not proof that audio played or a microphone captured sound. All 36 source sentences remain structurally covered by the existing context regression.
