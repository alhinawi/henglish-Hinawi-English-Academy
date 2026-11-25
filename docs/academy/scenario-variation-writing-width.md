# Scenario variation writing width

The reply and next-reply note textareas use 8px horizontal padding below 640px, gaining 8px of writing room each. Vertical and desktop padding remain 12px. Only two textarea classes change. Content, state, scoring, audio and TeacherDashboard are unchanged.

416 offline checks, Arabic lint, i18n and production build passed. Nine scenarios, seven variations each, at 320/390px in English and Arabic passed: 700/300 character limits, LTR/auto direction, three rewrite focus choices, blank guard, chosen focus retention, independent first/second replies, notes/checks/plans, clear focus, collapse retention, close/replay reset, completion gate and no horizontal overflow. Reply and note screenshots inspected at all four sizes/languages, with readable fields and visible sign-in. APIs blocked; no actual audio, capture or assessment tested. Canonical verification follows release.
