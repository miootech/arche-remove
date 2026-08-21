# Cloudflare Pages Deployment — arche.remove + arche.links

Both apps ship as **static ZIPs** ready for Cloudflare Pages Direct Upload.
No build step on Cloudflare, no env vars, no Node.js — just drag the ZIP
contents and go.

## The two ZIPs

| ZIP | What it deploys | Size |
|---|---|---|
| `arche-remove-cloudflare.zip` | arche.remove — image background remover | ~6.5 MB |
| `arche-links-cloudflare.zip` | arche.links — Linktree alternative | ~580 KB |

Each ZIP contains the contents of the build's `out/` folder, with
**`index.html` at the root** (no wrapper folder). When you extract it,
the files appear directly — not inside a subfolder.

Both ZIPs include the Cloudflare-specific files:
- `_redirects` — SPA fallback (`/* → /index.html 200`)
- `_headers` — cache rules for `_next/static/*`, `og-image`, `favicon`
- `404.html` — Next.js-generated 404 page

---

## Deploy arche.links (Linktree alternative)

1. Go to **Cloudflare → Pages → Create a project → Direct Upload**.
2. Project name: anything (e.g. `arche-links`).
3. Click **"Continue to upload"**.
4. Drag the **`arche-links-cloudflare.zip`** file onto the upload box
   (Cloudflare will auto-extract it). OR: extract the ZIP locally first
   and drag the contents (must include `index.html` at the top level).
5. Click **"Deploy site"**.
6. Done. Your site is live at `https://<project-name>.pages.dev/`.

**How hosting works after deploy:**
- Visit `https://<project>.pages.dev/` → editor mode (build your profile)
- Visit `https://<project>.pages.dev/#v1.…` → viewer mode (renders the
  encoded profile from the URL hash, no backend, no database)

The hash routing is 100% client-side. Cloudflare Pages only serves the
static `index.html` — the hash never reaches the server.

---

## Deploy arche.remove (Background remover)

1. Go to **Cloudflare → Pages → Create a project → Direct Upload**.
2. Project name: anything (e.g. `arche-remove`).
3. Click **"Continue to upload"**.
4. Drag the **`arche-remove-cloudflare.zip`** file onto the upload box.
5. Click **"Deploy site"**.
6. Done. Your site is live at `https://<project-name>.pages.dev/`.

**Notes for arche.remove:**
- The first time a visitor uploads an image, the AI model (~40–80 MB)
  is fetched from `staticimgly.com` (the @imgly/background-removal
  library's free CDN, AGPL-licensed) and cached by the browser.
- No image is ever uploaded to your Cloudflare site — all AI processing
  happens in the visitor's browser.
- The ZIP is ~6.5 MB because it includes the onnxruntime-web WASM
  binary bundled into the JS chunks.

---

## Alternative: deploy via Git (CI/CD)

If you prefer to push source code to Git and let Cloudflare build it:

1. Use the source ZIPs (`arche-links.zip` / `arche-remove.zip`) —
   these contain the Next.js source code, not the build output.
2. Extract and `git init && git push` to a new repo.
3. In Cloudflare Pages → "Create a project" → connect the repo.
4. Build settings:
   - **Framework preset:** Next.js (Static)
   - **Build command:** `bun run build` (or `npm run build`)
   - **Build output directory:** `out`
   - **Environment variables:** none required
5. Deploy.

The build produces the same `out/` folder that's already in the
`*-cloudflare.zip` Direct Upload ZIPs.

---

## Updating the deployments

When you make changes to the source code locally:

1. Modify the source in `src/`.
2. Re-run the build script:
   ```bash
   bash scripts/build-cloudflare.sh links   # rebuild arche.links ZIP
   bash scripts/build-cloudflare.sh remove  # rebuild arche.remove ZIP
   ```
3. In Cloudflare Pages → your project → "Create new deployment" →
   drag the new ZIP.
4. New deployment goes live instantly (atomic deploy).

---

## Troubleshooting Cloudflare Pages

**"Drag-and-drop says 'Folder structure invalid'"** — Cloudflare expects
`index.html` at the root of what you upload. Don't wrap the contents in
a subfolder. Both `*-cloudflare.zip` files have `index.html` at the
top level, so just upload the ZIP as-is.

**"Hash URL doesn't switch to viewer mode"** — Cloudflare Pages may be
returning a 404.html for `/` if the routing is off. Check that the
`_redirects` file is at the root of the deployed files. The rule
`/* /index.html 200` ensures all paths serve the SPA.

**"Theme toggle doesn't work on the deployed site"** — that's the
dev-server origin check, not a production issue. Production static
exports have no origin check, so the toggle works fine on Cloudflare.

**"arche.remove: model fails to load on the deployed site"** — check
the browser console. The model is fetched from `staticimgly.com` —
if your visitor has a strict CSP or content blocker, it may block
that request. The library handles CORS correctly, so this is usually
a visitor-side ad/tracker blocker, not a Cloudflare config issue.

---

Made with ♥ by [Arche](https://arche-website.pages.dev/).
