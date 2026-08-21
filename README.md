# arche.remove

> **Remove backgrounds. Keep everything else.**

A polished, production-ready, fully client-side image background remover.
No backend, no API, no serverless functions, no image upload to external
servers. All AI processing happens locally in the user's browser via
`@imgly/background-removal` (onnxruntime-web).

- 100% in-browser AI (WebGPU → WebGL → WASM fallback, automatic)
- No sign-up, no credits, no daily limits, no watermark
- Transparent PNG and WebP export at original resolution
- Before/after comparison slider (mouse, touch, keyboard)
- Two modes: Original Quality (isnet_fp16) and Fast (isnet_quint8)
- Background replacement: transparent / solid color / gradient / image
- Warm minimalist design with clean Light and Dark themes
- Mobile-first, responsive, accessible (ARIA, keyboard, reduced-motion)
- Static export — deploy on Cloudflare Pages, Netlify, Vercel static, GitHub Pages, etc.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Build for production](#build-for-production)
3. [Deploy on Cloudflare Pages](#deploy-on-cloudflare-pages)
4. [Customize the favicon and logo](#customize-the-favicon-and-logo)
5. [Customize the brand name](#customize-the-brand-name)
6. [Customize colors and themes](#customize-colors-and-themes)
7. [Project structure](#project-structure)
8. [How it works (architecture)](#how-it-works-architecture)
9. [Privacy](#privacy)
10. [Troubleshooting](#troubleshooting)

---

## Quick start

Requirements: Node.js 18+ (or Bun 1.1+), modern browser for development.

```bash
# install dependencies
bun install            # or: npm install

# run dev server
bun run dev            # or: npm run dev
# open http://localhost:3000
```

The first time you upload an image, the AI model (~40–80 MB) is downloaded
once from `staticimgly.com` (the library's free CDN, AGPL-licensed) and then
cached by the browser. Subsequent runs are much faster.

---

## Build for production

```bash
bun run build          # or: npm run build
```

Output goes to **`out/`** — a fully static folder you can host anywhere.

```bash
# Preview the production build locally:
npx serve out
```

---

## Deploy on Cloudflare Pages

1. Push this repo to GitHub/GitLab.
2. In Cloudflare Pages → "Create a project" → connect the repo.
3. Build settings:
   - **Framework preset:** Next.js (Static)
   - **Build command:** `bun run build` (or `npm run build`)
   - **Build output directory:** `out`
   - **Environment variables:** none required
4. Deploy. That's it — no workers, no functions, no env secrets.

> The model assets are loaded from `staticimgly.com` at runtime — you do
> NOT need to host them yourself. If you want to self-host them, see
> "Customize the model asset source" below.

---

## Customize the favicon and logo

This is the part most people ask about, so it gets its own section.

### 1. Browser tab favicon

**File:** `public/favicon.svg`

This single SVG file is the browser tab icon. Replace it with your own SVG
(32×32 viewBox recommended). The current one is a dark rounded square with
an amber dot, a white ring, and a diagonal line — read it as "solid subject,
hollow background, the cut between them".

If you prefer a PNG favicon, drop a `favicon.png` (32×32 or larger) into
`public/` and update the `icons` entry in `src/app/layout.tsx`:

```ts
icons: {
  icon: [{ url: "/favicon.png", type: "image/png" }],
  apple: [{ url: "/favicon.png" }],
}
```

### 2. The in-app logo / brand mark

**File:** `src/app/page.tsx` — search for the function `BrandMark()`.

The brand mark shown next to "arche.remove" in the page header is an inline
SVG inside that function. Edit the SVG markup there to change the visual
identity. No asset file needed — it's pure SVG.

Example minimal swap:

```tsx
function BrandMark() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-surface-elevated ring-1 ring-inset ring-border">
      {/* your SVG or <img> here */}
      <img src="/logo.svg" alt="" className="h-5 w-5" />
    </div>
  );
}
```

### 3. Social preview image (Open Graph / Twitter card)

**File:** `public/og-image.png` (1200×630 PNG)

This is the image that shows when someone shares your URL on Twitter,
Facebook, Slack, iMessage, etc. Replace this file with your own 1200×630
PNG. The reference Python script to regenerate the current design lives at
**`scripts/make-og-image.py`** — edit the strings and colors in that file,
then run:

```bash
python scripts/make-og-image.py
```

### 4. The wordmark / word logo

If you want a custom wordmark image instead of the text "arche.remove" next
to the brand mark, edit `src/app/page.tsx` — find the `<div
className="flex flex-col leading-tight">` block in the header and replace
the `<span>` text with your `<img src="/your-wordmark.svg" alt="arche.remove"
className="h-4" />`.

---

## Customize the brand name

The brand name "arche.remove" is referenced in these places:

| Where | File | What to change |
|---|---|---|
| Page title (browser tab) | `src/app/layout.tsx` | `metadata.title` |
| Meta description | `src/app/layout.tsx` | `metadata.description` |
| Open Graph / Twitter | `src/app/layout.tsx` | `metadata.openGraph.*` and `metadata.twitter.*` |
| JSON-LD structured data | `src/app/layout.tsx` | the `jsonLd` constant |
| Keywords | `src/app/layout.tsx` | `metadata.keywords` |
| Header text | `src/app/page.tsx` | `<span>arche.remove</span>` in the header |
| Footer (currently "Arche") | `src/components/snaperase/footer.tsx` | the `<a>` text |
| Downloaded filename suffix | `src/lib/image-utils.ts` | `brandFilename()` — currently `-made-with-arche-remove` |
| OG image | `scripts/make-og-image.py` | the strings, then re-run the script |

The canonical site URL is set in `src/app/layout.tsx` as `SITE_URL`. Update
it to your real deployment URL.

---

## Customize colors and themes

All design tokens live in **`src/app/globals.css`** under `:root` (light
theme) and `.dark` (dark theme). Edit the hex values there — both themes use
the same variable names so every component updates automatically.

```css
:root {
  --background: #fafaf7;       /* light page background */
  --foreground: #1a1a1f;       /* light mode text */
  --amber-accent: #b8754a;     /* light mode accent */
  /* ... etc */
}

.dark {
  --background: #111113;       /* dark page background */
  --foreground: #f5f5f7;       /* dark mode text */
  --amber-accent: #e6b87a;     /* dark mode accent */
  /* ... etc */
}
```

The default theme is **light**. To flip the default to dark, edit
`src/app/layout.tsx`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"     // ← change here
  enableSystem={false}
  disableTransitionOnChange
>
```

To follow the user's OS preference instead, set `enableSystem={true}` and
`defaultTheme="system"`.

---

## Customize the model asset source

By default the AI model is fetched from `https://staticimgly.com/...` (the
library's free CDN). If you want to self-host the model assets (e.g. for
air-gapped or fully-brand-controlled deployments):

1. Download the asset bundle matching your installed version from
   `https://staticimgly.com/@imgly/background-removal-data/<VERSION>/package.tgz`
   (replace `<VERSION>` with the version in `package.json`, e.g. `1.7.0`).
2. Extract it and move the contents of `dist/` into your `public/ai-assets/`
   folder so they're served at `/ai-assets/`.
3. In `src/lib/ai/background-removal.ts`, inside `buildConfig()`, add:

```ts
return {
  publicPath: "/ai-assets/",
  device: "gpu",
  // ...rest stays the same
};
```

---

## Project structure

```
arche.remove/
├── public/
│   ├── favicon.svg              ← browser tab icon (replaceable)
│   ├── og-image.png             ← social share preview (1200×630)
│   └── robots.txt
├── scripts/
│   └── make-og-image.py         ← regenerates public/og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← SEO metadata, JSON-LD, ThemeProvider
│   │   ├── page.tsx             ← main page + BrandMark()
│   │   └── globals.css          ← light + dark theme tokens
│   ├── components/
│   │   ├── theme-provider.tsx
│   │   └── snaperase/
│   │       ├── upload-zone.tsx
│   │       ├── processing-overlay.tsx
│   │       ├── before-after-slider.tsx
│   │       ├── export-controls.tsx
│   │       ├── background-replacement.tsx
│   │       ├── mode-selector.tsx
│   │       ├── theme-toggle.tsx
│   │       └── footer.tsx
│   ├── hooks/
│   │   └── use-background-removal.ts
│   └── lib/
│       ├── ai/
│       │   └── background-removal.ts
│       ├── browser-capabilities.ts
│       └── image-utils.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── tailwind.config.ts
├── eslint.config.mjs
├── components.json
└── README.md
```

---

## How it works (architecture)

```
User Image (Blob)
      │
      ▼
Browser (no network upload of image pixels)
      │
      ▼
@imgly/background-removal  ── loads AI model from staticimgly.com CDN (cached)
      │                       (one-time download, browser-cached afterwards)
      ▼
onnxruntime-web  ── picks WebGPU → WebGL → WASM → CPU automatically
      │
      ▼
Segmentation mask (ISNet neural network)
      │
      ▼
Transparent PNG Blob
      │
      ▼
User Download (PNG or WebP at original resolution)
```

The image's pixels are never sent to any server. The only network request
is the model asset download from `staticimgly.com` (the AGPL-licensed free
CDN that the `@imgly/background-removal` library uses by default).

---

## Privacy

- The user's image is processed entirely in the browser.
- No image upload endpoint exists.
- No API key is exposed.
- No image data is sent to analytics (no analytics is wired up at all).
- No server processing is required at runtime.

---

## Troubleshooting

**First run takes a while.** The model (~40–80 MB) downloads once and is
then cached by the browser. Subsequent runs skip the download.

**Theme toggle or other buttons don't respond in `bun run dev`.** If you
access the dev server from anything other than `localhost:3000` (e.g. a
LAN IP like `192.168.2.121:3000` for testing on mobile), Next.js 16
returns `403 Forbidden` on JS chunks and HMR websockets — the browser
loads the static HTML but never hydrates React, so the theme toggle
appears dead.

Fix (already in `next.config.ts` → `allowedDevOrigins`): add your LAN IP
to that list, or just run `bun run build && npx serve out` to use the
production static export instead (no origin check on a static server).

**"WebAssembly multi-threading is not supported"** in the console — this
is a benign warning from onnxruntime-web. It just means the inference
falls back to single-threaded WASM, which still works fine. To enable
multi-threading you'd need to set COOP/COEP headers on your host
(`Cross-Origin-Opener-Policy: same-origin` +
`Cross-Origin-Embedder-Policy: require-corp`). Not required for the app
to function.

**Very large images may fail on weak devices.** The app warns before
processing and recommends Fast mode. If processing still fails, the error
is shown in a friendly message and the user can retry or pick a smaller
image.

**Build error mentioning `/api` route.** You probably re-introduced an API
route. With `output: "export"`, no API routes are allowed — that's the
whole point (no backend). Remove the offending route.

---

Made with ♥ by [Arche](https://arche-projects.pages.dev).
