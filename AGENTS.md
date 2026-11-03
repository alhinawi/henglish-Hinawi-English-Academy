# Henglish Academy — Agent Operating Rules

You are an engineering agent working in the Henglish Academy repository.

## Product context
- Product: Henglish Academy, an English-learning platform with React, TypeScript, Vite, Tailwind CSS, Three.js, Vercel APIs, and Supabase.
- Read `ARCHITECTURE.md` before making architectural or backend changes.
- Read the relevant source files and migrations. Documentation can be stale; verify behavior in code.
- Preserve the existing product, design system, Arabic explanations, English LTR behavior, accessibility, and all working features.

## Mandatory workflow
1. Inspect the current branch, working tree, package scripts, and relevant code before editing.
2. State the problem, evidence, intended change, risks, and verification plan.
3. Work only on a dedicated feature branch. Never commit directly to `main`.
4. Keep each task small and independently reviewable.
5. Run the narrowest relevant checks, then `pnpm build`.
6. Review your own diff for regressions, secrets, unrelated formatting, and accidental generated files.
7. Report exact files changed, commands run, outcomes, limitations, and follow-up work.
8. Open a Pull Request; do not merge it or deploy Production.

## Security and data safety
- Never print, commit, copy into logs, or expose secrets, access tokens, passwords, service-role keys, or private user data.
- Never put privileged credentials in `VITE_*` variables or browser code.
- Never weaken or bypass Supabase RLS, authentication, authorization, rate limits, or server-side validation to make a test pass.
- Never trust a user ID, role, XP amount, or ownership claim supplied by the browser without verifying it server-side.
- Never run destructive SQL, drop/rename production columns, truncate tables, delete user records, or seed production data without explicit human approval.
- Treat all migrations as production-sensitive. Prefer additive, backward-compatible expand-and-contract changes.
- Do not change Vercel environment variables, Supabase production settings, billing, DNS, or deployment configuration without explicit approval.

## Code quality
- TypeScript strictness must be preserved. Avoid `any`, unsafe casts, and suppression comments unless justified and documented.
- Reuse existing services, components, types, and patterns before introducing abstractions.
- Validate untrusted input at API boundaries using the existing validation approach (Zod is installed).
- Handle loading, empty, error, and success states.
- Keep UI responsive and preserve RTL/LTR isolation.
- Avoid adding dependencies unless a clear need is documented.
- Do not claim a test passed unless you ran it and observed a successful exit code.

## Collaboration
- One agent owns a task and its branch at a time.
- Parallel agents may research or review, but must not edit the same worktree or overlapping files.
- The reviewer must inspect the actual diff, not only the implementer's summary.
- If a task is ambiguous, high-risk, or needs credentials/production access, stop and request human input.
- Do not create artificial work to keep the agent busy. Prefer a small, verified improvement over speculative rewrites.

## Completion report
Every task report must include:
- Goal and evidence.
- Files changed.
- Tests/checks run with exact results.
- Security/data impact.
- PR URL (if created).
- Remaining risks and required human decisions.
