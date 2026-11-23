# Recall translation vocabulary from Arabic meanings

Every wordbank entry across32translation tasks now has an independent hide/reveal toggle. Arabic meaning remains, model visibility and drafts unchanged. Default visible, closing help/task navigation/exit resets. Hide stops shared speech; explicit listening remains available under a generic hidden-word label, without spelling the answer. EN/AR/DE. No automatic grading, progress,storage or network. TeacherDashboard untouched.

Verification:285offline regressions,locale(existing fallback warnings),full TypeScript/Next export passed. New+existing all32task EN/AR390 suites passed hide/reveal,Arabic retention,hiddenlistenlabel,independent toggles,source/model/draft preservation,helpclose/navigation/filter reset. Actual local EN/AR390pixels inspected readable/nooverflow/دخولvisible. No actual speech playback claim.
