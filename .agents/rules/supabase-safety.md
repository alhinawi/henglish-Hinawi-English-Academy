---
trigger: model_decision
description: Apply when inspecting or changing Supabase, PostgreSQL, authentication, RLS, RPC functions, migrations, or persistent user data.
---

# Supabase and Database Safety

- Treat the live Supabase database as production, even when the app is currently in development.
- Inspect all relevant migrations and current application queries before proposing schema changes.
- Do not infer that a migration ran just because its SQL file exists in Git.
- Do not infer that data was imported just because an import script exists.
- Distinguish clearly between schema files, applied migrations, live tables, and verified row counts.
- Never use a service-role key in frontend code, browser storage, screenshots, logs, or committed files.
- Never disable RLS to make a feature work.
- Verify ownership using the authenticated Supabase identity on the server or in database policies.
- Review every SECURITY DEFINER function for a fixed safe search_path, caller authorization, and least privilege.
- Prefer additive migrations and explicit rollback notes.
- Never run destructive SQL or modify production records without explicit approval.
- For live verification, use read-only checks unless the user explicitly authorizes a write test and a safe test identity/table is available.
- Do not expose real student emails, names, tokens, or progress records in reports.
