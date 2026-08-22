# Cloudflare Pages via GitHub — Auto-Deploy Guide

This is the **recommended deployment method** for arche.* apps.
You push to GitHub → Cloudflare auto-builds → site is live in ~30 seconds.

No pre-built ZIPs, no manual uploads — every git push triggers a fresh
build on Cloudflare.

---

## Step 1 — Push the source to GitHub

```bash
# Inside the extracted arche-links/ or arche-remove/ folder:
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create a new repo on GitHub first (https://github.com/new)
# Don't add a README or .gitignore there — we have our own.
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

---

## Step 2 — Connect Cloudflare Pages to your GitHub repo

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Pick your GitHub account → select the repo you just pushed
3. **Begin setup**

---

## Step 3 — Configure the build (CRITICAL — this is what was failing before)

| Field | Value |
|---|---|
| **Project name** | anything, e.g. `arche-links` (becomes your `*.pages.dev` subdomain) |
| **Production branch** | `main` |
| **Framework preset** | **None** ← NOT "Next.js"! The Next.js preset assumes SSR; our app uses `output: 'export'` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Environment variables (advanced)** | **`NODE_VERSION` = `20`** ← required for Next.js 16 |

Click **Save and Deploy**. The first build takes ~2-3 minutes (install + build).

> If you prefer Bun instead of npm:
> - Build command: `bun run build`
> - Add env var `BUN_VERSION` = `1.1` (or whatever's current)
> - Still set `NODE_VERSION` = `20`

---

## Step 4 — Wait for the first build to finish

Cloudflare runs:
```
npm install      # installs deps from package.json
npm run build    # runs `next build` → produces static export in out/
```

If everything works, you'll see "Success" and your site is live at:
```
https://<project-name>.pages.dev/
```

For arche.links:
- `https://arche-links.pages.dev/` → editor
- `https://arche-links.pages.dev/#v1.…` → viewer (profile encoded in URL)

For arche.remove:
- `https://arche-remove.pages.dev/` → background remover

---

## Step 5 — Future updates (the magic part)

After the first deploy, every push to `main` automatically triggers a new build:

```bash
# Edit source files in VS Code
# e.g. change variants/links/layout.tsx to update the tab title

git add .
git commit -m "Update tab title"
git push

# → Cloudflare auto-builds in ~30 seconds → live immediately
```

You can also create preview deployments by pushing to a non-main branch:
```bash
git checkout -b feature/new-theme
# make changes...
git push -u origin feature/new-theme
# → Cloudflare creates a preview URL like:
#   https://abc123-feature-new-theme.arche-links.pages.dev/
```

---

## Why the previous setup didn't deploy

The original source ZIPs built correctly with `bun run build` locally, but on Cloudflare:

1. **Wrong Framework Preset**: Picking "Next.js" tells Cloudflare to use
   Next.js's default SSR build (which expects `.next/` output, not `out/`).
   **Fix**: Pick "None" preset and set output dir to `out`.

2. **Node version too old**: Cloudflare defaults to Node 16, but Next.js 16
   requires Node 18+ (we recommend Node 20). **Fix**: Set `NODE_VERSION=20`
   env var OR keep the `.nvmrc` file with `20` in it (which is already in
   this repo).

3. **Missing `_redirects`**: For arche.links, hash URLs (`/#v1.…`) work
   client-side, but unknown paths would 404 without a SPA fallback.
   **Fix**: The `public/_redirects` file (already in this repo) is
   automatically copied to `out/_redirects` by `next build`. Cloudflare
   Pages reads it and serves `index.html` with a 200 for any unknown path.

4. **Missing `_headers`**: Cache-control headers for static assets.
   **Fix**: The `public/_headers` file (already in this repo) sets sensible
   cache rules: `_next/static/*` cached for 1 year (immutable, content-hashed),
   HTML files re-validated on every request (so deploys go live instantly).

---

## Troubleshooting Cloudflare builds

**Build fails with "Module not found"**: Check Cloudflare's build logs.
Most likely the Node version is too old. Verify `NODE_VERSION=20` is set
in Environment Variables.

**Build succeeds but site shows 404**: Cloudflare picked the wrong output
directory. It should be `out`, NOT `.next` or `build`.

**Build succeeds but site is blank**: Open browser DevTools console.
Likely causes:
- Missing `_redirects` → already fixed in this repo
- JS chunks fail to load (CORS / CSP) → check the console

**Build succeeds but theme toggle broken**: That's the dev-mode origin
check, not a production issue. Production builds have no origin check.

**Want to use Bun instead of npm**: Set `BUN_VERSION=1.1` env var.
Build command: `bun install && bun run build` (or just `bun run build`
if Cloudflare auto-installs — they don't, so include `bun install`).

---

## Local test before pushing

Before pushing to GitHub, test the build locally:

```bash
npm install        # or: bun install
npm run build     # or: bun run build
npx serve out     # or: python3 -m http.server --directory out 8080
# Open the URL serve prints — this is EXACTLY what Cloudflare will deploy
```

If the local build produces a working `out/` folder, the Cloudflare build
will too (with the same Node version + npm version).

---

Made with ♥ by [Arche](https://arche-projects.pages.dev)
