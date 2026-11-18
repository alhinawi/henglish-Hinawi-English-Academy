# Henglish learning helper

This is a separate, enabled Worker for the existing learning chat. It does not replace the academy API or modify existing D1 tables. The only new persistent resource is one isolated SQLite-backed Durable Object namespace. The D1 binding is used only to read an existing session and identify a signed-in learner.

## Deployment

1. Check the target account still has Workers Free. Do not upgrade, add billing, or deploy on a paid account under the free-only authorization.
2. From `backend`, run `npm ci`, then `npx tsc --noEmit -p helper/tsconfig.json`.
3. Deploy `npx wrangler deploy --config helper/wrangler.jsonc` to the same account as the existing API. Do not run a D1 migration.
4. Confirm Wrangler's returned URL. The current frontend targets `https://henglish-helper.hnz.workers.dev/api/helper/chat`; if the actual hostname differs, change that client endpoint before rebuilding the frontend. An anticipated hostname alone is not proof of deployment.
5. Send one short synthetic grammar question with the actual production Origin. Confirm CORS, a real answer and the new Durable Object. Then test the frontend after its normal static export deployment. Stop after a small bounded smoke test, do not burn the site's daily budget.

The account was verified as Workers Free on 2026-11-18. This is a deployment assumption, not automatic future billing detection. The code has no billing or account-management credentials and cannot upgrade a plan. Recheck before a plan or provider change. The owner has not approved paid use. On the Free plan the platform rejects exhaustion rather than charging. `HELPER_ENABLED=false` is the immediate kill switch. The Cloudflare path has no artificial expiry.

## Limits and cost boundaries

- 30 attempted questions per site per UTC day, 4 per minute.
- 6 per learner per day, 2 per minute; separate IP guard of 10 per day and 3 per minute. Guests use their IP as identity. Shared networks may hit the IP cap sooner.
- 1,200-character current question, up to four 1,000-character recent messages. Final trusted prompt plus history is limited to 4,500 UTF-8 bytes.
- 384 maximum completion tokens, thinking disabled, short-answer instruction.
- Every attempt reserves 80 estimated neurons before inference, maximum 2,400 estimated neurons per site/day. This is a conservative reservation guard, not a measurement or a separate account allowance. Failed/cancelled requests stay reserved.
- Cloudflare's free 10,000 neurons/day allocation is account-wide, not per website. Other projects may exhaust it first. On 3036 or a provider quota response this helper parks until the next UTC day and shows an honest quota message.
- Durable Object counters are transactional and survive restarts. Only the current day's salted identity hashes and counts are stored, not raw IPs or prompts. Observability is disabled.

## Providers

Workers AI `@cf/google/gemma-4-26b-a4b-it` is the enabled path. Three private synthetic Arabic tests returned genuine answers before this implementation: subject-verb agreement and its negative form were correct, tense contrast was broadly correct but overstated the past-simple implication, and an unrelated medical question was refused. Egyptian register varied. These tests are a small smoke test, not a claim of teaching accuracy; the UI says answers can be wrong. There is no claim of model residency, and some returned model labels used an external suffix.

The optional Groq path is separately **disabled**. There is no Groq secret committed. Do not enable it or make an inference until the exact key-owning organization is verified Free. Enabling requires `GROQ_ENABLED=true`, a server-only `GROQ_API_KEY`, and a current `GROQ_FREE_VERIFIED_UNTIL` no more than seven days ahead. Its proposed model has not been Arabic-tested here and is not approved as a production primary. If later enabled after evaluation, there is at most one Groq attempt then one already-budgeted Workers AI fallback on a failure/429, with no loops. Billing-related provider errors park Groq for the day. The existing Qaryati project is untouched.

## Privacy and transport

The browser sends only question, an allowlisted practice mode, CEFR level, bounded recent text and an optional existing session bearer. Profile, progress, email, name, arbitrary prompts and credentials are not sent to the model. User-written text may itself contain personal data, so the UI warns against it. Questions are sent to the inference provider; no promise is made that text never leaves the service. No tools, browsing, remote actions or access to learner records are exposed to inference.

The service makes one non-streaming request and displays the actual final answer once. Existing cancellation, session ownership and stale-response guards remain. Legacy streaming parser tests remain for the other server transport. Errors and quotas are not substituted with canned teaching answers.

## Verification

- `node scripts/check-learning-helper.cjs`
- `npm run test:regressions`
- `npx tsc --noEmit` and the helper typecheck above
- `python scripts/check_i18n.py` and `npm run lint:arabic`
- `npm run build:next`, then `python scripts/check-helper-production.py`

The production-export browser fixture uses mocked inference, explicitly for UI/privacy/cancellation testing. It is not live provider or deployment evidence.

## Current official sources

- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/platform/limits/
- https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/
- https://developers.cloudflare.com/workers-ai/platform/data-usage/
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://developers.cloudflare.com/durable-objects/platform/limits/
- https://console.groq.com/docs/models
- https://console.groq.com/docs/rate-limits
- https://console.groq.com/docs/deprecations
