# Two Vercel Projects from One Repo (BIZEN + Microcred)

This repo contains two apps:
- BIZEN (public) under `src/app/bizen/*` using `src/lib/supabase/client-bizen.ts`
- Microcredential (Mondragón) under the rest of `src/app/*` using `src/lib/supabase/client.ts`

Follow these steps to deploy each as an independent Vercel Project, both pointing to this same GitHub repo.

## 1) Create the two Vercel projects

Create two projects in Vercel, both linked to this GitHub repository:

- Project A: `bizen`
  - Domain: `bizen.yourdomain.com` (or Vercel-provided URL)
- Project B: `microcred`
  - Domain: `microcred.yourdomain.com` (or Vercel-provided URL)

Both projects can target the `main` branch (or use separate branches if you prefer).

## 2) Configure environment variables per project

In Vercel → Project → Settings → Environment Variables:

- For Project A (BIZEN):
  - `NEXT_PUBLIC_SUPABASE_URL_BIZEN`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN`
  - `SUPABASE_SERVICE_ROLE_KEY_BIZEN`

- For Project B (Microcred):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

Note: Do NOT cross-set these. Each project should only have the variables it needs.

## 3) Set Ignored Build Step (to build only when relevant files change)

In each Vercel Project → Settings → Git → Ignored Build Step, set the following commands:

- Project A (BIZEN):

```bash
bash scripts/vercel-ignore-bizen.sh
```

- Project B (Microcred):

```bash
bash scripts/vercel-ignore-microcred.sh
```

Behavior:
- If the script exits `0`, the build is skipped.
- If the script exits non-zero, the build runs.

This ensures that:
- BIZEN builds only when files under `src/app/bizen` or shared/global config change.
- Microcred builds only when files outside `src/app/bizen` or shared/global config change.

## 4) Optional: Domains

Assign custom domains to each project:
- Project A → `bizen.yourdomain.com`
- Project B → `microcred.yourdomain.com`

## 5) Notes on shared code

- Changes in `src/shared/` or global config (like `next.config.ts`, `tsconfig.json`, Tailwind/PostCSS, or `middleware.ts`) will trigger builds for both projects. This is by design since they affect both apps.
- Keep shared code minimal to reduce unnecessary dual builds.

## 6) Local development

Use `.env.local` for Microcred and a separate `.env.bizen.local` for BIZEN. You can switch which app you’re testing via the route you open:
- Microcred: any route outside `/bizen/*`
- BIZEN: routes under `/bizen/*`

## 7) Troubleshooting

- If Vercel’s git diff is shallow and the ignore script can’t detect changes, the script falls back to building to be safe.
- If both projects build on a commit, it’s likely because you changed shared/global files.

---

That’s it. With this setup, you get independent deployments and environment isolation while keeping a single repository.
