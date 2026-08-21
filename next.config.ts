import type { NextConfig } from "next";

/**
 * arche.remove — Pure static SPA configuration.
 *
 * The entire application runs client-side. Background removal is performed
 * locally in the browser via @imgly/background-removal (onnxruntime-web).
 * No backend, no API routes, no server runtime — fully deployable on
 * Cloudflare Pages as a static export.
 */
const nextConfig: NextConfig = {
  // Produce a static HTML/JS/CSS export under `out/` for Cloudflare Pages.
  output: "export",

  // Cloudflare Pages serves a static export; trailing slashes are friendlier
  // for static hosts that don't auto-resolve extensionless URLs.
  trailingSlash: true,

  // Static export — no images optimized server-side. We ship images as-is.
  images: {
    unoptimized: true,
  },

  // The processing library is loaded only on the client. React strict mode
  // double-invokes effects in dev which can double-trigger the AI model load;
  // disabling keeps the first-run experience clean.
  reactStrictMode: false,

  // We tolerate library typings we cannot patch (onnxruntime-web etc).
  typescript: {
    ignoreBuildErrors: true,
  },

  // --- DEV-SERVER ORIGIN WHITELIST --------------------------------------
  // In Next.js 15+, the dev server rejects requests whose Origin header
  // doesn't match localhost, to prevent CSRF. This breaks preview access
  // from LAN IPs, mobile devices, and any preview proxy. We allow common
  // LAN IPs here so the toggle (and all other JS-powered UI) actually
  // hydrates when you access the dev server from anything other than
  // 127.0.0.1.
  //
  // Next.js matches the hostname portion of the Origin header. IPs must
  // be listed individually — CIDR notation and IP wildcards are NOT
  // supported by Next.js. If your LAN IP changes, add the new IP here
  // (or use the production build via `bun run build` + a static server,
  // which doesn't have this check).
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    // Common home/office LAN gateway IPs (.1 is router-assigned).
    "192.168.0.1",
    "192.168.0.2",
    "192.168.0.3",
    "192.168.0.4",
    "192.168.0.5",
    "192.168.1.1",
    "192.168.1.2",
    "192.168.1.3",
    "192.168.1.4",
    "192.168.1.5",
    "192.168.2.1",
    "192.168.2.2",
    "192.168.2.3",
    "192.168.2.4",
    "192.168.2.5",
    "192.168.2.121",
    // Sandbox preview proxy.
    "*.preview-*.space-z.ai",
    "*.space-z.ai",
  ],
};

export default nextConfig;
