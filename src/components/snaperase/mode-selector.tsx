"use client";

import { ProcessingMode, PROCESSING_MODES } from "@/lib/ai/background-removal";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  mode: ProcessingMode;
  onChange: (m: ProcessingMode) => void;
  disabled?: boolean;
}

/**
 * Two-segment selector for processing mode.
 * "Original Quality" (isnet_fp16) vs "Fast" (isnet_quint8).
 */
export function ModeSelector({ mode, onChange, disabled }: ModeSelectorProps) {
  const modes: ProcessingMode[] = ["quality", "fast"];
  return (
    <div
      role="radiogroup"
      aria-label="Processing mode"
      className={cn(
        "inline-flex w-full rounded-xl bg-background p-1 ring-1 ring-inset ring-border",
        disabled && "opacity-50 pointer-events-none",
      )}
    >
      {modes.map((m) => {
        const info = PROCESSING_MODES[m];
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-center transition-all outline-none focus-amber",
              active
                ? "bg-surface-elevated text-foreground ring-1 ring-inset ring-amber-accent/40"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <div className="text-xs font-semibold">{info.title}</div>
            <div className="text-[10px] mt-0.5 text-muted-foreground/70 leading-tight">
              {info.subtitle}
            </div>
          </button>
        );
      })}
    </div>
  );
}
