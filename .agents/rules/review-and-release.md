---
trigger: always_on
description: Mandatory review, testing, and release boundaries for all coding agents.
---

# Review and Release Guardrails

- Never push directly to `main`; use a task-specific branch.
- Never merge a PR or deploy to Production autonomously.
- Do not enable GitHub auto-merge.
- Run `pnpm install --frozen-lockfile` and `pnpm build` for application changes when feasible.
- The repository contains standalone TypeScript test files, but do not assume they are runnable until their runtime/loader and dependencies are verified. Do not invent a test command.
- If a check cannot run, report why and do not label it passed.
- Inspect the final diff and ensure only task-related files changed.
- Do not modify package versions or lockfiles unless the task requires it.
- Do not introduce secrets, API keys, or credential files.
- Any task touching authentication, payments, roles, RLS, database migrations, email, or user data requires explicit risk notes and human review.
