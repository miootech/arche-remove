"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  brandFilename,
  encodeImageData,
  triggerDownload,
} from "@/lib/image-utils";
import { Download, Loader2, FileImage } from "lucide-react";

export type ExportFormat = "image/png" | "image/webp";
export type ExportQuality = "high" | "balanced" | "compact";

interface ExportControlsProps {
  /** The transparent result blob from the AI. */
  resultBlob: Blob;
  /** Original image dimensions. */
  width: number;
  height: number;
  /** Original file stem (for naming the download). */
  originalStem: string;
  /** Disabled state during processing. */
  disabled?: boolean;
}

const QUALITY_PRESETS: Record<ExportQuality, { value: number; label: string }> = {
  // 0.95 for WebP is visually indistinguishable from lossless in most cases.
  high: { value: 0.95, label: "High" },
  balanced: { value: 0.85, label: "Balanced" },
  compact: { value: 0.7, label: "Compact" },
};

/**
 * Export panel: PNG / WebP selector, quality presets (only meaningful for
 * WebP — PNG is always lossless, so the quality selector is hidden when
 * PNG is selected).
 *
 * The PNG/WebP encoder runs entirely client-side via the canvas API.
 * We do NOT pretend PNG has a JPEG-style quality slider.
 */
export function ExportControls({
  resultBlob,
  width,
  height,
  originalStem,
  disabled,
}: ExportControlsProps) {
  const [format, setFormat] = useState<ExportFormat>("image/png");
  const [quality, setQuality] = useState<ExportQuality>("high");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setBusy(true);
    setError(null);
    try {
      // Decode the AI result (already a PNG blob with alpha) into a bitmap.
      const bitmap = await createImageBitmap(resultBlob);
      try {
        const qValue = QUALITY_PRESETS[quality].value;
        const ext: "png" | "webp" = format === "image/png" ? "png" : "webp";
        const filename = brandFilename(originalStem, ext);
        // We always export at the original image dimensions.
        const outBlob = await encodeImageData(
          bitmap,
          width,
          height,
          format,
          qValue,
        );
        triggerDownload(outBlob, filename);
      } finally {
        bitmap.close?.();
      }
    } catch {
      setError("Export failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-5 sm:p-6",
        "bg-surface/80 ring-1 ring-inset ring-border",
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <FileImage className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Export
        </h3>
      </div>

      {/* Format selector */}
      <div
        className="inline-flex rounded-full bg-background p-1 ring-1 ring-inset ring-border"
        role="radiogroup"
        aria-label="Export format"
      >
        <FormatButton
          active={format === "image/png"}
          onClick={() => setFormat("image/png")}
          disabled={busy || disabled}
        >
          PNG
        </FormatButton>
        <FormatButton
          active={format === "image/webp"}
          onClick={() => setFormat("image/webp")}
          disabled={busy || disabled}
        >
          WebP
        </FormatButton>
      </div>

      {/* Quality — only meaningful for WebP. PNG is always lossless. */}
      {format === "image/webp" && (
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Quality</span>
            <span className="font-mono text-muted-foreground/70">
              {QUALITY_PRESETS[quality].label}
            </span>
          </div>
          <div
            className="inline-flex rounded-full bg-background p-1 ring-1 ring-inset ring-border"
            role="radiogroup"
            aria-label="Quality"
          >
            {(Object.keys(QUALITY_PRESETS) as ExportQuality[]).map((q) => (
              <FormatButton
                key={q}
                active={quality === q}
                onClick={() => setQuality(q)}
                disabled={busy || disabled}
                size="sm"
              >
                {QUALITY_PRESETS[q].label}
              </FormatButton>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/70 mt-1">
            PNG is lossless and doesn&apos;t use a quality setting.
          </p>
        </div>
      )}

      {format === "image/png" && (
        <p className="text-[11px] text-muted-foreground/70 mt-4">
          PNG is lossless and preserves full transparency.
        </p>
      )}

      {/* Dimensions info */}
      <div className="mt-4 pt-4 border-t border-border/60 text-[11px] text-muted-foreground/70">
        <span className="font-mono">
          {width.toLocaleString("en-US")} × {height.toLocaleString("en-US")} px
        </span>
        <span className="mx-2">·</span>
        <span>Original resolution</span>
      </div>

      {/* Download button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy || disabled}
        className={cn(
          "mt-5 w-full inline-flex items-center justify-center gap-2",
          "h-11 rounded-xl text-sm font-medium",
          "bg-foreground text-background",
          "hover:bg-foreground/90 transition-colors",
          "focus-amber",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        aria-busy={busy}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Exporting…
          </>
        ) : (
          <>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormatButtonProps {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: "sm" | "md";
  children: React.ReactNode;
}

function FormatButton({
  active,
  onClick,
  disabled,
  size = "md",
  children,
}: FormatButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full font-medium transition-all outline-none focus-amber",
        size === "sm" ? "h-7 px-3 text-[11px]" : "h-9 px-4 text-xs",
        active
          ? "bg-foreground text-background shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
}
