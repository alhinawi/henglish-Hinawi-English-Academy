# Accounts, leaderboard and owner dashboard

## Existing infrastructure only

Uses the existing `henglish-api` Worker, D1 `henglish`, and existing users/sessions/progress tables. No new resources, migrations, paid services, account deletions or changes to stored learner points.

Deploy both the existing Worker code in `backend/` and the site build. Site-only deployment intentionally shows a load error if the old Worker does not have `/api/leaderboard`, rather than fabricating a successful response. The owner needs one new Google sign-in after the Worker update.

## Owner gate

Only `3asfuur@gmail.com` is the owner. Admin requires a session minted by the Google callback after `email_verified === true`, plus the matching Google-linked account. Password registration or login with the reserved owner email is rejected with a Google-only sign-in message. All authenticated owner endpoints require the verified Google-session marker, so old or previously password-minted sessions cannot edit the owner profile or progress. A Google session's `g.` marker is part of the complete random token whose SHA256 is checked against the sessions table; prepending a marker to another token cannot authenticate. Other learners retain their existing sessions. Pre-update owner sessions receive428 on protected endpoints and must sign in with Google again. No schema changes are needed. `/api/me` returns a server-computed admin boolean for navigation only; the API remains the authorization boundary.

The live dashboard shows actual counts, masked recent-user emails and service configuration. Legacy teacher/content tools are kept in a collapsed, explicitly local preview, so their demo students and course statistics are not presented as live account data.

## Score and display rules

Scores are calculated from the existing synced learning progress:100 per unique completed lesson plus up to50 for each quiz, based on its current saved score/total. Arbitrary local XP, signup and study-streak fields do not create leaderboard points. A new account with no completed activities has0. This is a synced-progress leaderboard, not an anti-cheat grading system; exercise completion is still reported by the client.

The verified owner's display score has a120 floor and remains pinned first. It does not write to actual exercise scores. Starter names/images mirror the existing Menschen implementation, with Maryam Adel first among starters, plus scattered anonymous avatars. If no verified Henglish owner exists yet, the display-only starter owner uses the owner's existing publicly displayed Menschen avatar. Each real account reserves a slot, including zero-point newcomers at the bottom. Turn off `STARTER_ENTRIES_ENABLED` in `src/data/leaderboard/display.ts` at launch to remove starter rows without deleting any user data. Starter rows are identified as such in the interface.

Only first name plus last initial is public for regular learners. Their account email, Google ID, progress blob and uploaded photo are not returned publicly. The signed-in viewer receives their own real-account rank, including outside the top10. Owner full name/photo and display pin match the requested existing implementation.

## Profile

Existing upload, Google picture, neutral avatar and name editing remain. Six preset avatars reuse the Menschen artwork and rasterize locally to a small WebP, saved through the existing profile endpoint. Choosing no picture correctly previews the neutral avatar instead of the old photo.

## Tests

- `node backend/tests/leaderboard.cjs`
- `cd backend && npm ci && npm run typecheck`
- `npm run lint:arabic && npx tsc -b && npm run build`

Local HTTP tests with an isolated local D1 database exercised anonymous401, nonowner403, old/password owner428, forged Google prefix401, fresh verified-owner200 and public response privacy. Browser checks at390px and1280px exercised rank display, newcomer0, the four admin gate states, profile-preset save and backend-outage behavior. No test accounts were created on production.
