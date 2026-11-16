# Certificate issuer deployment

Framework: existing Hono Worker. No paid services. No destructive migrations.

1. Export the remote D1 database **before** migration and verify the export is nonempty. Keep the backup privately, do not publish it or commit it.
2. Apply migrations/0004_certificates.sql to the existing `henglish` D1 binding after that backup succeeds.
3. Generate at least 32 cryptographically random bytes locally into a mode-0600 temporary file. Never print the value or put it into chat, source, logs or arguments.
4. Pipe that file into `wrangler secret put CERTIFICATE_SIGNING_SECRET` for the `henglish-api` Worker. Preserve the secret across deploys: changing it invalidates existing verification signatures. Delete the temporary file. No secret is needed in Pages or the browser.
5. Deploy the Worker with its existing D1 binding, then deploy the site. There are no Google OAuth changes. Never use browser progress JSON as checkpoint/issue authority.
6. Smoke check: unauthenticated `/api/certificates/status` must return 401; a forged ID at `/api/verify/<id>` returns 404; the signed-out site certificate preview stays disabled and unnamed. Check `/verify/<id>` resolves through the Pages Function to the static Next `/verify/` shell.

Private routes: GET status, POST start, POST submit under /api/certificates. Public route: GET /api/verify/:id. No certificate IDs are created by the client. Issuance only follows server-graded checkpoint records and a passing, timed final attempt. Names come from the authenticated users table.

Local regression: from backend/, run the test-certificates.ts script with a TypeScript runner (it uses Wrangler's local D1 proxy, never the remote DB). It tests forged progress, missing auth, private answers, time floor, single consumption, rate limit, issue/verify, signature tamper and revocation.

Limits: this is internal course completion, not a proctored identity exam or an external CEFR qualification. Questions originate in reviewed platform curriculum and may be familiar from lessons. The server controls selection, option order, grading, required checkpoints, time floor/expiry and 3 attempts per target per rolling 24 hours, but cannot prevent a human sharing answers or using outside help. Existing client-only completions are retained as learning history but must be confirmed with server checkpoint assessments before certificate issuance. Public verification discloses name, course, score and issue date to anyone holding the signed link; the UI says this before starting the final assessment.
