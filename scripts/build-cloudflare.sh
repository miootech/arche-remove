#!/usr/bin/env bash
# Build a single arche.* variant for Cloudflare Pages direct upload.
#
# Usage:
#   bash scripts/build-cloudflare.sh remove    # builds arche.remove
#   bash scripts/build-cloudflare.sh links     # builds arche.links
#
# Output:
#   /home/z/my-project/download/arche-<variant>-cloudflare.zip
#   (a ready-to-drag ZIP of the static `out/` folder contents)
#
# After running for both variants, the project is restored to the
# arche.links variant (current default).

set -euo pipefail

SRC="/home/z/my-project"
VARIANT="${1:?usage: build-cloudflare.sh <remove|links>}"

if [[ "$VARIANT" != "remove" && "$VARIANT" != "links" ]]; then
  echo "ERROR: variant must be 'remove' or 'links'"
  exit 1
fi

OUT_ZIP="$SRC/download/arche-$VARIANT-cloudflare.zip"
VARIANT_DIR="$SRC/variants/$VARIANT"

if [[ ! -d "$VARIANT_DIR" ]]; then
  echo "ERROR: variant directory not found: $VARIANT_DIR"
  exit 1
fi

echo ""
echo "=========================================="
echo "  Building arche.$VARIANT for Cloudflare"
echo "=========================================="

# Stop dev server to avoid file locks.
pkill -f "next dev" 2>/dev/null || true
sleep 1

# Swap the variant files into src/app and public.
echo "→ Installing variant files (page.tsx, layout.tsx, favicon, og-image)"
cp "$VARIANT_DIR/page.tsx"     "$SRC/src/app/page.tsx"
cp "$VARIANT_DIR/layout.tsx"   "$SRC/src/app/layout.tsx"
cp "$VARIANT_DIR/favicon.png"  "$SRC/public/favicon.png"
cp "$VARIANT_DIR/og-image.png" "$SRC/public/og-image.png"

# Clean any previous build output.
echo "→ Cleaning previous build output"
rm -rf "$SRC/out" "$SRC/.next"

# Build.
echo "→ Building (next build → static export in out/)"
cd "$SRC"
bun run build 2>&1 | tail -8

if [[ ! -d "$SRC/out" ]]; then
  echo "ERROR: build did not produce an out/ folder"
  exit 1
fi

# Add a Cloudflare Pages _redirects file. With Next.js static export +
# trailingSlash:true, every route gets its own folder with index.html —
# no redirects strictly needed for arche.remove. For arche.links, all
# traffic goes to / and the hash is client-side only, so no _redirects
# needed either. But adding one for robustness: any unknown path falls
# back to /index.html with a 200 (so the SPA can show 404 internally).
echo "→ Adding _redirects for SPA fallback"
cat > "$SRC/out/_redirects" <<REDIRECTS
# arche.${VARIANT} — Cloudflare Pages SPA fallback
# Hash URLs (e.g. /#v1.…) are client-side only, no redirect needed.
# Unknown paths fall back to the SPA root with a 200 (so the app
# can render its own 404 state).
/*    /index.html   200
REDIRECTS

# Add a _headers file for sensible defaults.
cat > "$SRC/out/_headers" <<'HEADERS'
# Cache static assets aggressively (immutable content-hashed filenames).
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

# HTML files should always be re-validated.
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# OG image and favicon — short cache.
/og-image.png
  Cache-Control: public, max-age=86400
/favicon.png
  Cache-Control: public, max-age=86400
HEADERS

# Stage the out/ folder contents (NOT wrapped in a parent folder — the
# user wants to drag-and-drop the FILES, not a folder, into Cloudflare
# Pages Direct Upload).
STAGING="/tmp/arche-$VARIANT-cloudflare-staging"
rm -rf "$STAGING"
mkdir -p "$STAGING"
cp -r "$SRC/out/." "$STAGING/"

# Build the ZIP. The ZIP's top-level entries should be the FILES, not a
# wrapper folder, so Cloudflare Pages receives index.html at the root.
echo "→ Packaging ZIP (drag-and-drop into Cloudflare Pages)"
cd "$STAGING"
rm -f "$OUT_ZIP"
zip -r "$OUT_ZIP" . -x '*.DS_Store' '*/.DS_Store' > /dev/null
cd -

# Clean up staging.
rm -rf "$STAGING"

echo ""
echo "=========================================="
echo "  ✓ arche.$VARIANT ready"
echo "=========================================="
ls -lh "$OUT_ZIP"
echo ""
echo "Contents (top-level only):"
unzip -l "$OUT_ZIP" | awk 'NR>3 {print $4}' | grep -v '^$' | grep -v '/' | sort
echo ""
echo "Total entries:"
unzip -l "$OUT_ZIP" | tail -1
