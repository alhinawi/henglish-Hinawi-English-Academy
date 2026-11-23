# Translation vocabulary: own-sentence practice

Each vocabulary term in the32translation tasks now has optional own-sentence practice, closed by default. The learner can use a word in an original English sentence after recalling its spelling. This adds active use without replacing the task's translation draft or exposing the model answer.

- Independent300character English field per vocabulary term.
- Clear resets only that sentence and returns focus.
- Hiding/revealing the word or collapsing the sentence box retains the sentence.
- Closing help, changing task/filter or leaving resets it.
- No network, persistence, automatic checking, scores or completion claims.
- EN/AR/DElabels. English typing stays LTR in Arabic UI.
- Existing content, word recall, translations and speech controls unchanged.

Verification:299offline regressions, TypeScript and Next export, all32tasks and their vocabulary terms at390px in English and Arabic. Test covers defaults, input isolation, clear/focus, hide/reveal, collapse retention, resets and no horizontal overflow. Screenshots must also be inspected. No actual speech playback is claimed.
