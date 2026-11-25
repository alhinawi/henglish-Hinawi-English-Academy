# Translation reflection mobile writing width

RevisionReflection now uses8px horizontal padding below640px instead of12px, adding8px of writing room at320/390px. Vertical and desktop padding remain12px. No content, state, scoring, request or TeacherDashboard change.

`check-translation-reflection-writing-width.cjs` guards the class. The production check exercises all44tasks at320/390px in English/Arabic: padding,500limit,auto direction,three focus choices/prompts,task isolation,close/hide/reopen retention,wrap,comparison,draft/revision/checklist preservation and unmount reset. APIs blocked; no AI, audio or proficiency validation. Existing locale fallback warnings remain outside this change.
