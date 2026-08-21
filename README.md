# arche.links

> **All your links. One page. Free forever.**

A polished, 100% client-side Linktree alternative with **every premium
feature free**. No sign-up, no credits, no daily limits, no watermark.

Build your link page in the editor, then either:

1. **Share via URL** — the profile is encoded into the URL hash
   (`yoursite.com/#v1.…`) and rendered live when anyone opens it. No
   backend, no database.
2. **Download as standalone HTML** — a tiny, self-contained file
   (embedded CSS + JS + profile data + social SVGs). Host it anywhere or
   open it locally. **No size limit**.

Works on Cloudflare Pages, Netlify static, Vercel static, GitHub Pages —
any static host. Zero backend required.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Build for production](#build-for-production)
3. [Deploy on Cloudflare Pages](#deploy-on-cloudflare-pages)
4. [How hosting works](#how-hosting-works)
5. [Features (all free)](#features-all-free)
6. [Customize the favicon and logo](#customize-the-favicon-and-logo)
7. [Customize the brand name](#customize-the-brand-name)
8. [Customize colors and themes](#customize-colors-and-themes)
9. [Project structure](#project-structure)
10. [Privacy](#privacy)
11. [Troubleshooting](#troubleshooting)

---

## Quick start

Requirements: Node.js 18+ (or Bun 1.1+).

```bash
bun install            # or: npm install
bun run dev            # or: npm run dev
# open http://localhost:3000
```

You'll see the editor with three default links and the Warm theme.
Click through the tabs to customize everything, then open the Export
tab to share or download.

---

## Build for production

```bash
bun run build          # or: npm run build
```

Output goes to **`out/`** — a fully static folder you can host anywhere.

```bash
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
4. Deploy.

That's it — no workers, no functions, no env secrets.

---

## How hosting works

arche.links has two modes, switched automatically by the URL:

| URL | What you see |
|---|---|
| `yoursite.com/` | **Editor** — build your profile, live preview on the right |
| `yoursite.com/#v1.…` | **Viewer** — renders the encoded profile read-only |

When you click **"Open"** in the Export tab or share the URL, the page
auto-detects the `#v1.…` hash and switches to viewer mode. Visitors can
copy the URL, download the HTML, or go back to the editor (which clears
the hash).

The hash is the encoded profile:
```
JSON.stringify(profile)  →  encodeURIComponent  →  btoa  →  "v1." + base64
```

The hash has a soft warning at 4500 chars and a hard limit at 7000
chars (browsers cap URLs at ~8 KB). If you exceed the limit, the editor
will tell you and recommend downloading the HTML instead — which has
**no size limit**.

---

## Features (all free)

Linktree would charge for these. arche.links ships them all free:

- ✅ Unlimited links (Linktree free = 5 links; Pro = unlimited)
- ✅ All themes & custom colors (Linktree Pro)
- ✅ All layout styles (Linktree Pro)
- ✅ Social icons row (Linktree Pro)
- ✅ Avatar upload
- ✅ Verified badge
- ✅ Featured / highlighted links
- ✅ Custom fonts via system stack
- ✅ Dark + light mode auto-switching in the export
- ✅ Background patterns / gradients via custom hex
- ✅ HTML export (no Linktree equivalent — you can't export there at all)
- ✅ URL-hash hosting (no Linktree equivalent — they need their servers)
- ✅ No account, no sign-up, no watermark

---

## Customize the favicon and logo

### 1. Browser tab favicon

**File:** `public/favicon.png`

Replace this SVG with your own (32×32 viewBox recommended). The current
one shows three link "nodes" (a solid amber center plus two outlined
satellites) connected by lines — read it as "you + the links orbiting
you".

For a PNG favicon, drop `favicon.png` (32×32 or larger) into `public/`
and update the `icons` entry in `src/app/layout.tsx`:

```ts
icons: {
  icon: [{ url: "/favicon.png", type: "image/png" }],
  apple: [{ url: "/favicon.png" }],
}
```

### 2. The in-app logo / brand mark

**File:** `src/components/linktree/profile-editor.tsx` — search for the
function `BrandMark()`.

The mark shown next to "arche.links" in the editor header is an inline
SVG inside that function. Edit the SVG markup to change the visual
identity. No asset file needed.

### 3. Social preview image (Open Graph / Twitter card)

**File:** `public/og-image.png` (1200×630 PNG)

This is the image that shows when someone shares your URL on Twitter,
Facebook, Slack, iMessage, etc. Replace this file with your own
1200×630 PNG. The reference Python script to regenerate the current
design lives at **`scripts/make-og-image.py`** — edit the strings and
colors in that file, then run:

```bash
python scripts/make-og-image.py
```

### 4. The wordmark

If you want a custom wordmark image instead of the text "arche.links"
next to the brand mark, edit
`src/components/linktree/profile-editor.tsx` — find the
`<span>arche.links</span>` in the header and replace with your own
`<img src="/your-wordmark.svg" alt="arche.links" className="h-4" />`.

---

## Customize the brand name

The brand name "arche.links" is referenced in these places:

| Where | File | What to change |
|---|---|---|
| Page title (browser tab) | `src/app/layout.tsx` | `metadata.title` |
| Meta description | `src/app/layout.tsx` | `metadata.description` |
| Open Graph / Twitter | `src/app/layout.tsx` | `metadata.openGraph.*` and `metadata.twitter.*` |
| JSON-LD structured data | `src/app/layout.tsx` | the `jsonLd` constant |
| Keywords | `src/app/layout.tsx` | `metadata.keywords` |
| Header text | `src/components/linktree/profile-editor.tsx` | `<span>arche.links</span>` |
| Footer (currently "Arche") | `src/components/snaperase/footer.tsx` | the `<a>` text |
| Exported HTML footer brand | `src/lib/export-html.ts` | the `made with arche.links` string |
| Exported HTML title suffix | `src/lib/export-html.ts` | `— arche.links` in the `<title>` |
| Downloaded filename suffix | `src/lib/export-html.ts` | `-arche-links.html` |
| OG image | `scripts/make-og-image.py` | the strings, then re-run the script |

The canonical site URL is set in `src/app/layout.tsx` as `SITE_URL`.
Update it to your real deployment URL.

---

## Customize colors and themes

All design tokens live in **`src/app/globals.css`** under `:root`
(light theme) and `.dark` (dark theme). Edit the hex values there —
both themes use the same variable names so every component updates
automatically.

For profile-specific themes (what users see in their exported
profile), edit **`src/lib/themes.ts`** — each preset has a `light`
and `dark` variant. Add new presets or modify existing ones.

For ColorHunt-style palette presets (4-color sets that apply to all
slots at once), edit **`src/lib/palettes.ts`** — add new palettes or
reorder existing ones.

---

## Project structure

```
arche.links/
├── public/
│   ├── favicon.png              ← browser tab icon (replaceable)
│   ├── og-image.png             ← social share preview (1200×630)
│   └── robots.txt
├── scripts/
│   └── make-og-image.py         ← regenerates public/og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← SEO metadata, JSON-LD, ThemeProvider
│   │   ├── page.tsx             ← hash-routing entry (editor ↔ viewer)
│   │   └── globals.css          ← light + dark theme tokens
│   ├── components/
│   │   ├── theme-provider.tsx
│   │   ├── snaperase/
│   │   │   ├── theme-toggle.tsx ← Sun/Moon toggle (reused from arche.remove)
│   │   │   └── footer.tsx       ← "Made with ♥ by Arche"
│   │   └── linktree/
│   │       ├── profile-editor.tsx   ← main editor (4 tabs)
│   │       ├── profile-viewer.tsx   ← read-only view from hash
│   │       ├── profile-preview.tsx ← live iframe preview
│   │       └── tabs/
│   │           ├── content-tab.tsx    ← name, bio, avatar, links, socials
│   │           ├── design-tab.tsx     ← theme presets + ColorHunt + custom hex
│   │           ├── layout-tab.tsx     ← layout presets + spacing sliders
│   │           └── export-tab.tsx     ← share URL + download HTML
│   ├── hooks/
│   │   └── use-profile.ts       ← state management + hash sync
│   └── lib/
│       ├── profile.ts           ← Profile type + defaults
│       ├── profile-codec.ts    ← encode/decode profile ↔ URL hash
│       ├── themes.ts            ← 8 theme presets (light + dark paired)
│       ├── layouts.ts           ← 5 layout presets
│       ├── palettes.ts          ← 16 ColorHunt-style 4-color sets
│       ├── export-html.ts       ← standalone HTML generator
│       ├── image-utils.ts       ← canvas, ImageBitmap, validation, download
│       └── utils.ts              ← cn() Tailwind helper
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

## Privacy

- The user's profile data lives either in:
  - The URL hash fragment (shared via your Cloudflare Pages URL)
  - A downloaded standalone HTML file (self-contained, no dependencies)
  - The browser's localStorage (auto-saved during editing)
- No backend, no databases, no API keys.
- No analytics. No tracking pixels. No third-party requests.
- The exported HTML is fully self-contained — opening it locally
  doesn't make any network requests.

---

## Troubleshooting

**Theme toggle doesn't work in `bun run dev`.** If you access the dev
server from a LAN IP (e.g. `192.168.2.121:3000` for mobile testing),
Next.js 16 returns `403 Forbidden` on JS chunks. Fix is already in
`next.config.ts` → `allowedDevOrigins`. Add your LAN IP there, or just
use `bun run build && npx serve out` (static export has no origin
check).

**Hash URL doesn't switch to viewer mode.** Make sure the hash starts
with `v1.` — older versions used a different prefix. Clear
localStorage and try again.

**Exported HTML file is huge.** Avatars are resized to 256×256 JPEG
(quality 0.85) before being embedded — that keeps them under ~10 KB
each. The HTML itself with 10 links + 5 socials + avatar is typically
under 15 KB total.

**Want a fixed theme (not auto-switch).** In the Export tab, pick
"Light" or "Dark" instead of "Auto (visitor)" before clicking
"Download HTML". The exported file will use that theme only.

---

Made with ♥ by [Arche](https://arche-website.pages.dev/).
