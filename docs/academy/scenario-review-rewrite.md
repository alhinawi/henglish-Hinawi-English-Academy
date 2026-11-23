# Write an improved reply after conversation review

Completed real-life conversation review previously showed the chosen reply and feedback without asking the learner to use it. Each reviewed turn now has a separate 500-character English draft. Learners use the original situation and feedback to write an improved reply and compare clarity, politeness and needed detail. No answer is generated, assessed or sent. Original choices, score and feedback stay unchanged. Drafts survive switching review accordions but are discarded on replay or exit. EN/AR/DE guidance, English writing explicitly LTR.

Verification: regression suite, i18n, TypeScript/full static export; EN/AR390 all nine scenarios and every turn, separate drafts and accordion retention, original choice/feedback, conditional stronger option, replay/exit reset. Existing review/audio tests retained. Actual pixels inspected. Audio APIs blocked in UI tests, no playback claim.
