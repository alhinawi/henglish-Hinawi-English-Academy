# AI teacher mobile suggestion wrapping

Long labels in the horizontal suggestion strip were clipped at320px. Below640px show full-width wrapping44px minimum buttons, with all suggestions visible without horizontal scrolling. Desktop remains horizontal. Preserve exact labels, prompts, LTR isolation and click semantics. No content/API/storage/audio/authentication/grading change.

Verify all7modes320/390ENAR button bounds, label widths, wrapping, nooverflow and no helper request. Never click suggestions in live checks. Inspect actual pixels.
