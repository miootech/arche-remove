"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { UploadZone } from "@/components/snaperase/upload-zone";
import { BeforeAfterSlider } from "@/components/snaperase/before-after-slider";
import { ProcessingOverlay } from "@/components/snaperase/processing-overlay";
import { ExportControls } from "@/components/snaperase/export-controls";
import { BackgroundReplacement } from "@/components/snaperase/background-replacement";
import { Footer } from "@/components/snaperase/footer";
import { ModeSelector } from "@/components/snaperase/mode-selector";
import { ThemeToggle } from "@/components/snaperase/theme-toggle";
import { useBackgroundRemoval } from "@/hooks/use-background-removal";
import { PROCESSING_MODES } from "@/lib/ai/background-removal";
import Image from "next/image";
import {
  BrowserCapabilities,
  describeBackend,
  detectCapabilities,
  isUnsupported,
} from "@/lib/browser-capabilities";
import { assessLargeImage, ImageMeta } from "@/lib/image-utils";
import {
  ShieldCheck,
  Infinity as InfinityIcon,
  UserX,
  Cpu,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  X,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  // ---- Browser capabilities (detected once, on mount, client-side) ----
  const [caps, setCaps] = useState<BrowserCapabilities | null>(null);
  useEffect(() => {
    // setState in effect is the correct pattern for browser-only capability
    // detection — we can't read `navigator` during prerender.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaps(detectCapabilities());
  }, []);

  // ---- Uploaded image state ----
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalMeta, setOriginalMeta] = useState<ImageMeta | null>(null);
  const [originalURL, setOriginalURL] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Cleanup URL when changed.
  useEffect(() => {
    return () => {
      if (originalURL) URL.revokeObjectURL(originalURL);
    };
  }, [originalURL]);

  // ---- AI processing hook ----
  const ai = useBackgroundRemoval();

  // ---- Accepted file handler (from UploadZone) ----
  const onAccepted = useCallback(
    async (file: File, meta: ImageMeta) => {
      // Revoke previous URL.
      setOriginalURL((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      // Reset AI state for the new image (but keep the model loaded — the
      // hook keeps the lazy-import promise memoised so re-processing a new
      // image won't redownload the model).
      ai.reset();
      setOriginalFile(file);
      setOriginalMeta(meta);

      // Create object URL for the original (for before/after slider preview).
      const url = URL.createObjectURL(file);
      setOriginalURL(url);

      // Trigger processing immediately — low friction experience.
      void ai.process(file, meta.width, meta.height);
    },
    [ai],
  );

  // ---- Error handler ----
  const onError = useCallback((message: string) => {
    setToast(message);
  }, []);

  // ---- Reset for new image ----
  const reset = useCallback(() => {
    setOriginalFile(null);
    setOriginalMeta(null);
    setOriginalURL((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    ai.reset();
  }, [ai]);

  // ---- Toast auto-dismiss ----
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  // ---- Derived state ----
  const processing = ai.phase === "processing";
  const hasResult = ai.phase === "done" && ai.result;
  const unsupported = caps ? isUnsupported(caps) : false;
  const largeImageWarning = useMemo(
    () => (originalMeta ? assessLargeImage(originalMeta) : null),
    [originalMeta],
  );

  // ---- Render ----
  return (
    <div
      className={cn(
        "min-h-[100svh] flex flex-col",
        "bg-background text-foreground theme-aware",
      )}
    >
      {/* ===================== HEADER ===================== */}
      <header className="w-full px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                arche.remove
              </span>
              <span className="text-[10px] text-muted-foreground/70">
                Local · Private · Free
              </span>
            </div>
          </div>
          {/* Right: backend badge + theme toggle */}
          <div className="flex items-center gap-2">
            {caps && !unsupported && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-surface/80 px-3 py-1.5 text-[11px] text-muted-foreground ring-1 ring-inset ring-border">
                <Cpu className="h-3 w-3 text-success" aria-hidden="true" />
                <span>{describeBackend(caps)}</span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ===================== HERO ===================== */}
      <section className="w-full px-4 sm:px-6 pt-10 sm:pt-16 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface/80 px-3 py-1.5 text-[11px] font-medium text-muted-foreground ring-1 ring-inset ring-border mb-6">
            <Sparkles className="h-3 w-3 text-amber-accent" aria-hidden="true" />
            100% in your browser · No server uploads
          </div>

          {/* Headline — tagline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance">
            Remove backgrounds.{" "}
            <span className="text-amber-accent">Keep everything else.</span>
          </h1>

          {/* Subhead */}
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            arche.remove wipes image backgrounds automatically, right in your
            browser. No sign-up, no credits, no watermark — your images
            never leave your device.
          </p>

          {/* Trust signals */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-[11px]">
            <Trust icon={<ShieldCheck className="h-3.5 w-3.5" />}>
              100% in browser
            </Trust>
            <Trust icon={<UserX className="h-3.5 w-3.5" />}>
              No sign-up
            </Trust>
            <Trust icon={<InfinityIcon className="h-3.5 w-3.5" />}>
              No limits
            </Trust>
            <Trust icon={<Sparkles className="h-3.5 w-3.5" />}>
              No watermark
            </Trust>
          </div>
        </div>
      </section>

      {/* ===================== WORK AREA ===================== */}
      <main className="w-full px-4 sm:px-6 pb-8 flex-1">
        <div className="mx-auto max-w-6xl space-y-5">
          {/* Unsupported browser banner */}
          {unsupported && <UnsupportedBanner />}

          {/* Mode selector — only show before or after processing, not during */}
          {!processing && originalFile && (
            <div className="glass-panel rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wand2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <h2 className="text-sm font-semibold tracking-tight">
                  Processing mode
                </h2>
              </div>
              <ModeSelector
                mode={ai.mode}
                onChange={ai.setMode}
                disabled={processing}
              />
            </div>
          )}

          {/* Processing overlay */}
          {processing && originalMeta && (
            <ProcessingOverlay
              downloadingModel={ai.downloadingModel}
              computing={ai.computing}
              status={ai.status}
              progressFraction={ai.progressFraction}
              modeLabel={PROCESSING_MODES[ai.mode].title}
            />
          )}

          {/* Before/After result view */}
          {hasResult && originalURL && ai.result && originalMeta && (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* Result preview */}
              <div className="space-y-3">
                <BeforeAfterSlider
                  beforeSrc={originalURL}
                  afterSrc={ai.result.url}
                  beforeAlt="Original image"
                  afterAlt="Image with background removed"
                />
                {/* Action bar */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-amber rounded-md px-2 py-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    New image
                  </button>
                  <div className="text-[11px] text-muted-foreground/70">
                    {originalMeta.width.toLocaleString("en-US")} ×{" "}
                    {originalMeta.height.toLocaleString("en-US")} px ·{" "}
                    {originalMeta.size > 1024 * 1024
                      ? `${(originalMeta.size / 1024 / 1024).toFixed(1)} MB`
                      : `${(originalMeta.size / 1024).toFixed(0)} KB`}
                  </div>
                </div>
              </div>

              {/* Right: export controls + bg replacement */}
              <div className="space-y-4">
                <ExportControls
                  resultBlob={ai.result.blob}
                  width={ai.result.width}
                  height={ai.result.height}
                  originalStem={originalMeta.name.replace(/\.[^.]+$/, "")}
                />
                <BackgroundReplacement
                  foregroundBlob={ai.result.blob}
                  width={ai.result.width}
                  height={ai.result.height}
                  originalStem={originalMeta.name.replace(/\.[^.]+$/, "")}
                />
              </div>
            </div>
          )}

          {/* Upload zone — shown when idle, error, or no result yet */}
          {!hasResult && !processing && (
            <div className="mx-auto max-w-2xl">
              <UploadZone
                onAccepted={onAccepted}
                onError={onError}
                disabled={processing}
              />
              {/* Large image warning */}
              {largeImageWarning && originalMeta && (
                <div
                  className={cn(
                    "mt-3 rounded-xl p-3 text-xs flex items-start gap-2 ring-1 ring-inset",
                    largeImageWarning.level === "severe"
                      ? "bg-destructive/10 ring-destructive/40 text-destructive"
                      : largeImageWarning.level === "warning"
                        ? "bg-amber-accent/10 ring-amber-accent/30 text-amber-accent"
                        : "bg-success/10 ring-success/30 text-success",
                  )}
                  role="note"
                >
                  <AlertTriangle
                    className="h-3.5 w-3.5 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{largeImageWarning.message}</span>
                </div>
              )}
            </div>
          )}

          {/* Error display */}
          {ai.phase === "error" && ai.error && (
            <div
              className="rounded-2xl p-4 bg-destructive/10 ring-1 ring-inset ring-destructive/40"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className="h-5 w-5 text-destructive shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">
                    Processing failed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{ai.error}</p>
                  <button
                    type="button"
                    onClick={() => {
                      ai.clearError();
                      if (originalFile && originalMeta) {
                        void ai.process(
                          originalFile,
                          originalMeta.width,
                          originalMeta.height,
                        );
                      }
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-elevated/80 transition-colors focus-amber"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===================== SEO CONTENT ===================== */}
      <section className="w-full px-4 sm:px-6 py-10 sm:py-14 border-t border-border/60">
        <div className="mx-auto max-w-3xl space-y-5">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">
            Remove backgrounds — free, local, and unlimited
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              arche.remove is a free alternative to Remove.bg and other
              commercial background removers. Unlike those services, all image
              processing happens entirely in your browser — your images never
              leave your device at any point. There is no server upload, no
              API, no credits, and no hidden costs.
            </p>
            <p>
              The AI-based segmentation uses a neural network (ISNet) that runs
              directly on your hardware via WebAssembly, WebGL, or WebGPU. On
              first use, the model is downloaded once and cached by the
              browser — every subsequent processing run skips the download and
              is therefore significantly faster.
            </p>
            <p>
              The result is exported as a transparent PNG or WebP file at the
              original resolution — without watermarks, without quality loss,
              and without requiring an account. You can optionally replace
              the background with a solid color, a gradient, or your own
              image after the cut-out is done.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {[
              {
                icon: <ShieldCheck className="h-4 w-4" />,
                title: "100% private",
                desc: "Images stay on your device",
              },
              {
                icon: <InfinityIcon className="h-4 w-4" />,
                title: "Unlimited",
                desc: "No daily or monthly limits",
              },
              {
                icon: <UserX className="h-4 w-4" />,
                title: "No account",
                desc: "No sign-up, no credits",
              },
              {
                icon: <Sparkles className="h-4 w-4" />,
                title: "No watermark",
                desc: "Clean PNG/WebP exports",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl bg-surface/80 ring-1 ring-inset ring-border p-3.5"
              >
                <div className="text-amber-accent mb-1.5">{f.icon}</div>
                <div className="text-xs font-semibold text-foreground">
                  {f.title}
                </div>
                <div className="text-[10px] text-muted-foreground/70 mt-0.5 leading-snug">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ===================== TOAST ===================== */}
      {toast && (
        <div
          role="alert"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)]"
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <div className="flex items-start gap-3 rounded-xl glass-panel p-3.5 shadow-xl">
            <AlertTriangle
              className="h-4 w-4 text-amber-accent shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-xs text-foreground flex-1">{toast}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-muted-foreground hover:text-foreground transition-colors focus-amber rounded"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function BrandMark() {
  return (
    <div
      className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-surface-elevated to-surface ring-1 ring-inset ring-border"
      aria-hidden="true"
    >
      <Image
        src="/logo.png"
        alt="Logo"
        width={22}
        height={22}
        className="w-[22px] h-[22px] object-contain"
      />
    </div>
  );
}

function Trust({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-surface/80 px-2.5 py-1.5 text-muted-foreground ring-1 ring-inset ring-border">
      <span className="text-success">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function UnsupportedBanner() {
  return (
    <div
      className="rounded-2xl p-5 bg-destructive/10 ring-1 ring-inset ring-destructive/40"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="h-5 w-5 text-destructive shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium text-destructive">
            Browser not supported
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This device doesn&apos;t support local AI processing well enough.
            Please use a modern browser like Chrome, Edge, Firefox, or Safari
            in a recent version.
          </p>
        </div>
      </div>
    </div>
  );
}