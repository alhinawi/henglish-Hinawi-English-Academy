# Listen during completed conversation review

Each expanded completed-attempt turn now has explicit listening controls for the unchanged English prompt, the reply actually chosen in this attempt, and the existing stronger alternative only when that alternative is displayed. The source/selection distinction is preserved. No new dialogue or health advice is generated.

Uses existing LessonSpeechButton/voice pipeline, no autoplay or new provider. Closing a turn unmounts its speech buttons; existing scene/replay reset and speech cancellation remain. Original nine scenarios, photos, scoring, review feedback and transfer practice are retained.

Verification: offline suite, i18n, TypeScript/Next export. EN/AR390px all nine scenarios and every turn verify controls correspond to actual selected replies and conditional alternatives. Existing review test now targets accordion buttons by aria-expanded, retaining its original assertions when audio buttons are present. Tests exercise click/error UI with API paths unavailable, not actual playback/capture evidence. Actual pixels inspected.
