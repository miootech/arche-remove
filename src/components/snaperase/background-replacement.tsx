"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { triggerDownload } from "@/lib/image-utils";
import {
  Palette,
  Image as ImageIcon,
  Download,
  Loader2,
  Eraser,
  Sparkles,
} from "lucide-react";

type BgType = "transparent" | "color" | "gradient" | "image";

interface BackgroundReplacementProps {
  /** The transparent foreground result (after bg removal). */
  foregroundBlob: Blob;
  /** Original dimensions. */
  width: number;
  height: number;
  /** Original file stem for naming. */
  originalStem: string;
  /** Disabled while processing. */
  disabled?: boolean;
}

interface GradientPreset {
  name: string;
  /** CSS for the swatch button. */
  css: string;
  /** Canvas-drawable hex pair (matches the CSS). */
  from: string;
  to: string;
}

const GRADIENT_PRESETS: GradientPreset[] = [
  { name: "Warm", css: "linear-gradient(135deg, #e6b87a 0%, #f5e6cf 100%)", from: "#e6b87a", to: "#f5e6cf" },
  { name: "Dark", css: "linear-gradient(135deg, #232328 0%, #111113 100%)", from: "#232328", to: "#111113" },
  { name: "Studio", css: "linear-gradient(135deg, #f5f5f7 0%, #d4d4d8 100%)", from: "#f5f5f7", to: "#d4d4d8" },
  { name: "Peach", css: "linear-gradient(135deg, #ffd1b3 0%, #ff8e72 100%)", from: "#ffd1b3", to: "#ff8e72" },
  { name: "Sage", css: "linear-gradient(135deg, #a3c4a8 0%, #5f8a6a 100%)", from: "#a3c4a8", to: "#5f8a6a" },
];

const SOLID_PRESETS = [
  { name: "White", value: "#f5f5f7" },
  { name: "Black", value: "#111113" },
  { name: "Amber", value: "#e6b87a" },
  { name: "Sage", value: "#7eb88c" },
  { name: "Coral", value: "#ff8e72" },
];

export function BackgroundReplacement({
  foregroundBlob,
  width,
  height,
  originalStem,
  disabled,
}: BackgroundReplacementProps) {
  const [type, setType] = useState<BgType>("transparent");
  const [solidColor, setSolidColor] = useState<string>("#e6b87a");
  const [gradientIdx, setGradientIdx] = useState<number>(0);
  const [bgImageBitmap, setBgImageBitmap] = useState<ImageBitmap | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preview canvas — shows the composed result with the chosen background.
  const previewRef = useRef<HTMLCanvasElement>(null);
  const fgBitmapRef = useRef<ImageBitmap | null>(null);
  const [, setRenderTick] = useState(0); // force preview redraw trigger

  // Load foreground once into a bitmap. On cleanup, close it.
  useEffect(() => {
    let cancelled = false;
    let bitmap: ImageBitmap | null = null;
    createImageBitmap(foregroundBlob).then((b) => {
      if (cancelled) {
        b.close?.();
        return;
      }
      bitmap = b;
      fgBitmapRef.current = b;
      setRenderTick((n) => n + 1);
    });
    return () => {
      cancelled = true;
      bitmap?.close?.();
      fgBitmapRef.current = null;
    };
  }, [foregroundBlob]);

  // Background image upload.
  const onBgImage = useCallback(async (file: File) => {
    try {
      const bitmap = await createImageBitmap(file);
      setBgImageBitmap((prev) => {
        prev?.close?.();
        return bitmap;
      });
    } catch {
      setError("The background image could not be loaded.");
    }
  }, []);

  // Cleanup bg image on unmount.
  useEffect(() => {
    return () => {
      bgImageBitmap?.close?.();
    };
  }, []);

  // Draw preview whenever any input changes.
  useEffect(() => {
    const canvas = previewRef.current;
    const fg = fgBitmapRef.current;
    if (!canvas || !fg) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    if (type === "transparent") {
      // Don't paint a background — checkerboard CSS shows through.
    } else if (type === "color") {
      ctx.fillStyle = solidColor;
      ctx.fillRect(0, 0, width, height);
    } else if (type === "gradient") {
      const preset = GRADIENT_PRESETS[gradientIdx] ?? GRADIENT_PRESETS[0];
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, preset.from);
      grad.addColorStop(1, preset.to);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (type === "image" && bgImageBitmap) {
      // Cover-fit draw.
      const sw = bgImageBitmap.width;
      const sh = bgImageBitmap.height;
      const scale = Math.max(width / sw, height / sh);
      const w = sw * scale;
      const h = sh * scale;
      const x = (width - w) / 2;
      const y = (height - h) / 2;
      ctx.drawImage(bgImageBitmap, x, y, w, h);
    }
    // Draw foreground on top.
    ctx.drawImage(fg, 0, 0, width, height);
  }, [type, solidColor, gradientIdx, bgImageBitmap, width, height]);

  // Export composed result as PNG.
  const handleDownload = useCallback(async () => {
    setExporting(true);
    setError(null);
    try {
      const canvas = previewRef.current;
      if (!canvas) throw new Error("Preview unavailable");
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
      if (!blob) throw new Error("Export failed");
      triggerDownload(blob, `${originalStem}-made-with-arche-remove.png`);
    } catch {
      setError("Export failed.");
    } finally {
      setExporting(false);
    }
  }, [originalStem]);

  return (
    <div
      className={cn(
        "rounded-2xl p-5 sm:p-6",
        "bg-surface/80 ring-1 ring-inset ring-border",
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Replace background
        </h3>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <TypePill
          active={type === "transparent"}
          onClick={() => setType("transparent")}
          icon={<Eraser className="h-3.5 w-3.5" />}
          label="Transparent"
        />
        <TypePill
          active={type === "color"}
          onClick={() => setType("color")}
          icon={<Palette className="h-3.5 w-3.5" />}
          label="Color"
        />
        <TypePill
          active={type === "gradient"}
          onClick={() => setType("gradient")}
          icon={<Sparkles className="h-3.5 w-3.5" />}
          label="Gradient"
        />
        <TypePill
          active={type === "image"}
          onClick={() => setType("image")}
          icon={<ImageIcon className="h-3.5 w-3.5" />}
          label="Image"
        />
      </div>

      {/* Controls per type */}
      {type === "color" && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {SOLID_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setSolidColor(p.value)}
                aria-pressed={solidColor === p.value}
                aria-label={`Background color ${p.name}`}
                className={cn(
                  "h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-surface transition-transform",
                  solidColor === p.value
                    ? "ring-foreground scale-105"
                    : "ring-border hover:ring-muted-foreground",
                )}
                style={{ backgroundColor: p.value }}
              />
            ))}
            {/* Custom color picker */}
            <label
              className={cn(
                "relative h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-surface cursor-pointer overflow-hidden",
                "ring-border hover:ring-muted-foreground",
              )}
              aria-label="Pick a custom color"
            >
              <span
                className="absolute inset-0"
                style={{
                  background:
                    "conic-gradient(from 0deg, #ff8e72, #e6b87a, #7eb88c, #5f8a6a, #a3c4a8, #ff8e72)",
                }}
              />
              <input
                type="color"
                value={solidColor}
                onChange={(e) => setSolidColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
          <div className="text-[11px] text-muted-foreground/70 font-mono">
            {solidColor}
          </div>
        </div>
      )}

      {type === "gradient" && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {GRADIENT_PRESETS.map((g, i) => (
            <button
              key={g.name}
              type="button"
              onClick={() => setGradientIdx(i)}
              aria-pressed={gradientIdx === i}
              aria-label={`Gradient ${g.name}`}
              title={g.name}
              className={cn(
                "h-12 rounded-lg ring-2 ring-offset-2 ring-offset-surface transition-transform",
                gradientIdx === i
                  ? "ring-foreground scale-105"
                  : "ring-border hover:ring-muted-foreground",
              )}
              style={{ background: g.css }}
            />
          ))}
        </div>
      )}

      {type === "image" && (
        <div className="mt-4 space-y-3">
          <label
            className={cn(
              "block w-full rounded-xl border border-dashed border-border",
              "p-4 text-center text-xs text-muted-foreground cursor-pointer",
              "hover:border-muted-foreground hover:text-foreground transition-colors",
            )}
          >
            <ImageIcon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            {bgImageBitmap ? "Choose a different image" : "Choose a background image"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onBgImage(f);
                e.target.value = "";
              }}
            />
          </label>
          {!bgImageBitmap && (
            <p className="text-[11px] text-muted-foreground/70">
              Pick your own image as a new background.
            </p>
          )}
        </div>
      )}

      {/* Live preview */}
      <div className="mt-5">
        <div className="text-[11px] text-muted-foreground/70 mb-2">Preview</div>
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl ring-1 ring-inset ring-border",
            type === "transparent" && "checkerboard-soft",
          )}
          style={{
            aspectRatio: `${width} / ${height}`,
            maxHeight: "50vh",
          }}
        >
          <canvas
            ref={previewRef}
            className="absolute inset-0 w-full h-full object-contain"
            aria-label="Composed preview"
          />
        </div>
      </div>

      {/* Download */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={exporting || disabled}
        className={cn(
          "mt-5 w-full inline-flex items-center justify-center gap-2",
          "h-11 rounded-xl text-sm font-medium",
          "bg-foreground text-background",
          "hover:bg-foreground/90 transition-colors",
          "focus-amber",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {exporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Exporting…
          </>
        ) : (
          <>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download as PNG
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

interface TypePillProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TypePill({ active, onClick, icon, label }: TypePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex flex-col items-center justify-center gap-1.5",
        "h-16 rounded-xl text-xs font-medium transition-all outline-none focus-amber",
        active
          ? "bg-surface-elevated text-foreground ring-1 ring-inset ring-amber-accent/40"
          : "bg-background text-muted-foreground ring-1 ring-inset ring-border hover:text-foreground",
      )}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
