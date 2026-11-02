# Henglish AI Development Team (Google AI Pro + Antigravity)

## Goal

Use the user's existing Google AI Pro subscription through the official Antigravity App/CLI for coding work, while using GitHub Actions only for deterministic repository checks. Do not require a paid OpenAI API key or Gemini API key for this setup.

Official references:
- Antigravity plans and quota: https://antigravity.google/docs/plans
- Antigravity authentication: https://antigravity.google/docs/install
- Antigravity CLI headless mode: https://antigravity.google/docs/cli/headless/
- Antigravity workspace rules: https://antigravity.google/docs/rules/
- Antigravity sidecars: https://antigravity.google/docs/sidecars
- Antigravity scheduled tasks: https://antigravity.google/docs/commands/schedule/

## Important operating model

This first version is a Gemini-powered autonomous workflow, not a live ChatGPT-to-Gemini agent mesh. The current ChatGPT conversation cannot remain active as a background worker after the chat ends. To have an always-on independent OpenAI reviewer, an OpenAI API integration would be required and would incur separate API charges. To preserve the $0 additional API-cost goal, Antigravity may delegate a separate read-only reviewer subagent within its own service, while GitHub Actions provides deterministic build verification.

Google AI Pro provides a higher Antigravity baseline quota, not unlimited usage. Quota refreshes every five hours until the weekly limit is reached. Usage depends on the work performed. Set AI Credit Overages to **Never** to prevent paid overage usage.

The personal Google account OAuth session is stored locally. Antigravity CLI headless mode uses cached local credentials; an unauthenticated CI runner cannot silently use the personal subscription. Therefore:
- Run Gemini coding agents on the user's own computer through Antigravity App/CLI.
- Do not put personal OAuth tokens in GitHub Secrets.
- Do not run the subscription-authenticated agent on GitHub-hosted runners.
- Use GitHub Actions for install/build checks only.
- Keep the computer awake and Antigravity App running for local sidecars to execute while the user sleeps. This is not a cloud-hosted 24/7 service; if the computer is off/asleep or the app is closed, local sidecars cannot run.
- A truly cloud-hosted agent requires an officially supported cloud/API billing path or a separate always-on machine. Do not claim the Google AI Pro subscription alone gives a free always-on cloud runtime.

## Initial setup

1. Install Antigravity App and its CLI from https://antigravity.google/.
2. Sign in using the same personal Google account that owns Google AI Pro.
3. Open the Henglish repository as a workspace.
4. Confirm the repository rules in `AGENTS.md` and `.agents/rules/` are loaded.
5. Open Antigravity Settings / Plans / Usage and set **AI Credit Overages = Never**.
6. Confirm the model quota display before enabling recurring work.
7. Keep the PC powered, connected to the internet, and prevent Windows from entering sleep while scheduled work is expected.

## Recommended first-run prompt

Use this in Antigravity with the Henglish repository open:

> Read AGENTS.md, ARCHITECTURE.md, and docs/AI_DEVTEAM.md. Do not edit files yet. Perform a read-only audit of the repository and report the top five verified engineering risks with file paths and evidence. Check the current branch and working tree. Do not inspect, print, or request secrets. Do not connect to or modify production Supabase. Recommend one small, safe first task and wait for approval.

After reviewing the audit, assign one task at a time. The agent must work on a task branch and open a PR, never merge or deploy Production.

## Scheduled work using Antigravity sidecars

Antigravity App sidecars are local background processes managed by the app. To enable a recurring audit:
1. Copy the folder `antigravity/sidecars/henglish-nightly` into `~/.gemini/config/sidecars/henglish-nightly` (on Windows, use the equivalent user profile path, typically `%USERPROFILE%\.gemini\config\sidecars\henglish-nightly`).
2. In Antigravity App, obtain the current project ID for the Henglish workspace.
3. Edit `%USERPROFILE%\.gemini\config\config.json` (merge with existing JSON; do not overwrite other settings) to enable the sidecar and set its projectId:

```json
{
  "sidecars": {
    "henglish-nightly": {
      "enabled": true,
      "projectId": "YOUR_ANTIGRAVITY_PROJECT_ID"
    }
  }
}
```

4. Restart Antigravity App and verify the sidecar appears in its task/sidecar status UI and logs.
5. The included schedule runs once nightly at 01:30 local machine time. Adjust the cron expression only after confirming quota and reviewing the prompt.

The sidecar starts a fresh Antigravity conversation for each run. Each run should perform a bounded audit or one small queued task, produce a report, and stop. Do not use it to launch an unlimited self-replicating agent loop.

## Permissions

Prefer Antigravity's request-review mode and narrowly scoped allow rules. Do not use `--dangerously-skip-permissions` for unattended production code changes. Shell commands, network access, database access, and deployment actions must remain restricted. The agent may create a task branch and draft a PR only when the local GitHub credentials and repository permissions are already configured.

## GitHub Actions

The repository workflow at `.github/workflows/quality.yml` runs a locked dependency install and production build on pushes and pull requests. It does not call an AI API, deploy, access Supabase, or modify production data.

## First milestone

- Antigravity can read the repo rules.
- The user has confirmed AI Credit Overages = Never.
- A read-only audit report is generated.
- A single low-risk task is completed on a feature branch.
- Build checks pass.
- A PR is created for human review.
