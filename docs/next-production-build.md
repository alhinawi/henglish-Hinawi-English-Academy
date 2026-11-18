# Next.js production build

Henglish uses Next.js 15 with static export on free Cloudflare Pages. The existing React learning app, hash routes, content, account integrations and controls remain in place through the client entry point. There is no server-rendering requirement or paid Next hosting service.

- `npm run dev`: Next.js development server. It compiles the existing Tailwind entry first.
- `npm run build`: TypeScript project check, Tailwind generation and Next.js static export to `out/`.
- `npm run build:next`: compatible explicit Next.js build command for existing deploy jobs.
- `npm run preview`: serve `out/` locally at `http://127.0.0.1:5173`. Requires a successful build. The Node-only preview supports audio byte ranges and does not implement application APIs.
- CI runs `pnpm build`, which now produces the same Next.js artifact as deployment rather than validating the older Vite output.

Deploy the `out` directory to the existing Cloudflare Pages project. Keep its existing Pages Functions and environment settings: static export does not turn Next.js server routes into a running server. Client calls still need the existing supported API services. Existing `VITE_*` public configuration names remain bridged to `NEXT_PUBLIC_*` so accounts do not stop working during this change.

The former Vite configuration/source files are retained for history and compatibility, not used by the default development/build/preview commands. No learning content or features are removed. This change does not modify TeacherDashboard, account data, provider credentials or Cloudflare resources.
