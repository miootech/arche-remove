"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ACCEPT_ATTR,
  inspectImageFile,
  ImageDecodeError,
  ImageMeta,
  validateImageFile,
} from "@/lib/image-utils";
import { Upload, ShieldCheck } from "lucide-react";

interface UploadZoneProps {
  onAccepted: (file: File, meta: ImageMeta) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

type DragState = "idle" | "over" | "rejected";

export function UploadZone({ onAccepted, onError, disabled }: UploadZoneProps) {
  const [dragState, setDragState] = useState<DragState>("idle");
  const [validating, setValidating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Reset drag state if the user drags out of the window entirely.
  useEffect(() => {
    const onWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const onWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      setDragState("idle");
      dragCounter.current = 0;
    };
    window.addEventListener("dragover", onWindowDragOver);
    window.addEventListener("drop", onWindowDrop);
    return () => {
      window.removeEventListener("dragover", onWindowDragOver);
      window.removeEventListener("drop", onWindowDrop);
    };
  }, []);

  const handleFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      setValidating(true);
      try {
        const validation = await validateImageFile(file);
        if (!validation.ok || !validation.detectedMime) {
          onError(validation.reason ?? "This image couldn't be processed.");
          return;
        }
        const meta = await inspectImageFile(file);
        // Don't reject; just pass along — caller decides how to surface warnings.
        onAccepted(file, meta);
      } catch (err) {
        if (err instanceof ImageDecodeError) {
          onError(err.message);
        } else {
          onError("This image couldn't be processed.");
        }
      } finally {
        setValidating(false);
      }
    },
    [onAccepted, onError],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setDragState("idle");
      if (disabled) return;
      const file = e.dataTransfer?.files?.[0];
      void handleFile(file);
    },
    [disabled, handleFile],
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      dragCounter.current++;
      setDragState("over");
    },
    [disabled],
  );

  const onDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setDragState("idle");
      }
    },
    [],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      // Enter or Space activates the file picker — accessibility.
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    [disabled],
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload an image to remove its background"
      aria-disabled={disabled || validating}
      aria-busy={validating}
      onDragEnter={onDragEnter}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
      onClick={() => !disabled && !validating && inputRef.current?.click()}
      className={cn(
        "relative w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border-2 border-dashed",
        "flex flex-col items-center justify-center gap-5 p-8 text-center",
        "cursor-pointer select-none transition-all duration-200 outline-none",
        "focus-amber",
        dragState === "idle" &&
          "border-border bg-surface/60 hover:border-[var(--muted-foreground)] hover:bg-surface-elevated/70",
        dragState === "over" &&
          "border-amber-accent bg-surface-elevated scale-[1.01]",
        dragState === "rejected" && "border-destructive bg-destructive/10",
        (disabled || validating) && "opacity-60 cursor-not-allowed pointer-events-none",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          void handleFile(file);
          // Allow re-uploading the same file by clearing the value.
          e.target.value = "";
        }}
      />

      {/* Icon */}
      <div
        className={cn(
          "relative flex h-16 w-16 items-center justify-center rounded-full",
          "bg-gradient-to-br from-surface-elevated to-surface",
          "ring-1 ring-inset ring-border",
          dragState === "over" && "ring-amber-accent/60",
        )}
      >
        <Upload
          className={cn(
            "h-7 w-7 text-amber-accent transition-transform duration-200",
            dragState === "over" && "scale-110",
          )}
          aria-hidden="true"
        />
      </div>

      {/* Heading + sub */}
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {validating ? "Validating image…" : "Drop your image here"}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {validating ? "Just a moment." : "or click to select an image"}
        </p>
      </div>

      {/* Privacy badge */}
      <div className="flex items-center gap-2 rounded-full bg-surface-elevated/80 px-3.5 py-1.5 text-xs text-muted-foreground ring-1 ring-inset ring-border">
        <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
        <span>Your image stays on your device</span>
      </div>

      {/* Supported formats hint */}
      <p className="text-[11px] text-muted-foreground/70">
        PNG · JPG · WebP · GIF · BMP · AVIF — auto-detected
      </p>

      {/* Drag-active glow */}
      {dragState === "over" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(circle at center, color-mix(in oklab, var(--amber-accent) 8%, transparent), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
