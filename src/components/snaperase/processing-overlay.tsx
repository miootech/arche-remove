"use client";

import { cn } from "@/lib/utils";
import { Cpu, Download, Sparkles, ShieldCheck } from "lucide-react";

interface ProcessingOverlayProps {
  /** True if currently downloading model assets. */
  downloadingModel: boolean;
  /** True if currently running inference on the image. */
  computing: boolean;
  /** Friendly status text. */
  status: string;
  /** Real progress fraction [0,1] when available; null when indeterminate. */
  progressFraction: number | null;
  /** Active mode label, e.g. "Original Quality" or "Fast". */
  modeLabel: string;
}

/**
 * A clean, friendly processing panel.
 *
 * Visually distinguishes two phases:
 *  1. "Preparing AI" — model assets downloading (first run).
 *  2. "Processing locally" — inference running on the user's image.
 *
 * Never fabricates fake percentages. When real progress is unavailable,
 * shows an indeterminate shimmer bar with a stage label.
 */
export function ProcessingOverlay({
  downloadingModel,
  computing,
  status,
  progressFraction,
  modeLabel,
}: ProcessingOverlayProps) {
  const isDownload = downloadingModel;
  const isCompute = computing && !downloadingModel;
  // True real progress available? (must be a finite number in [0,1])
  const hasRealProgress =
    typeof progressFraction === "number" &&
    Number.isFinite(progressFraction) &&
    progressFraction >= 0 &&
    progressFraction <= 1;

  const Icon = isDownload ? Download : isCompute ? Cpu : Sparkles;

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl p-6 sm:p-8 overflow-hidden",
        "bg-surface/80 ring-1 ring-inset ring-border",
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-start gap-5">
        {/* Animated icon */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              "bg-gradient-to-br from-surface-elevated to-surface",
              "ring-1 ring-inset ring-border",
            )}
          >
            <Icon
              className="h-5 w-5 text-amber-accent breathe"
              aria-hidden="true"
            />
          </div>
          {/* Pulsing ring */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full ring-1 ring-amber-accent/30 breathe"
          />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {isDownload ? "Preparing AI…" : "Processing…"}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">{status}</p>
          </div>

          {/* Stage badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-elevated/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-inset ring-border">
              {modeLabel}
            </span>
            {isDownload && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-accent/10 px-2.5 py-1 text-[11px] font-medium text-amber-accent ring-1 ring-inset ring-amber-accent/30">
                <Download className="h-3 w-3" aria-hidden="true" />
                One-time download
              </span>
            )}
            {isCompute && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success ring-1 ring-inset ring-success/30">
                <Cpu className="h-3 w-3" aria-hidden="true" />
                Local processing
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            {hasRealProgress ? (
              <>
                <div
                  className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated"
                  role="progressbar"
                  aria-valuenow={Math.round(progressFraction * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="absolute top-0 left-0 bottom-0 rounded-full bg-gradient-to-r from-amber-accent to-cream-accent transition-[width] duration-200 ease-out"
                    style={{
                      width: `${(progressFraction * 100).toFixed(2)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground/70">
                  <span>{Math.round(progressFraction * 100)}%</span>
                  <span>Local in your browser</span>
                </div>
              </>
            ) : (
              <>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated shimmer">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-accent/40 to-cream-accent/40"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground/70">
                  <span>{status}</span>
                  <span>Local in your browser</span>
                </div>
              </>
            )}
          </div>

          {/* Privacy reminder during processing */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
            <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            <span>Your image stays on your device — no upload, no server processing.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
