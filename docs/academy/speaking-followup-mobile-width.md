# Speaking follow-up mobile readability

Reduce mobile outer insets and flatten nested prompt, Arabic meaning, written-reply and self-check fieldset padding. Keep sm-and-up spacing, existing copy and state intact. Topic-words disclosure receives a smaller mobile inset, without changing its contents. No feature additions.

Verification:362offline checks, Arabic lint and full production build pass. Browser tests exercise all32lessons/64follow-up prompts,drafts,retries and notes in English and Arabic at320 and390. Attempt/check cards at least viewport minus80px wide; no horizontal page overflow. Blank guards, chosen focus, first/current answer, clear-only focus, note and plan independence, collapse preservation and close/mode/lesson reset pass. Actual320Arabic/390English pixels inspected. No recording/playback/assessment claim. Canonical verification after deployment.
