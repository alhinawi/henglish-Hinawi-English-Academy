# Real-life conversation review mobile width

Reduced repeated mobile insets around completed conversation turns, chosen/model replies and rewrite fields. Desktop spacing is restored from sm upward. All choices, feedback, audio controls, per-turn drafts and replay/exit reset behavior remain unchanged.

The production runner covers all nine scenarios and every turn at320/390 in English/Arabic, asserts rewrite width at least viewport minus70px,500-character limits, independent drafts and collapse retention, original selected reply and conditional stronger option, no overflow and replay/exit reset. API calls are blocked; this does not verify actual audio playback or recording.
