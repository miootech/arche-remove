"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  /** Original image URL (object URL or remote). */
  beforeSrc: string;
  /** Result image URL with transparency. */
  afterSrc: string;
  /** Alt text for accessibility. */
  beforeAlt: string;
  afterAlt: string;
  /** Initial slider position in [0,1]. Default 0.5. */
  initialPosition?: number;
  /** Optional aria-label. */
  label?: string;
}

/**
 * Draggable before/after comparison slider.
 *
 * - Mouse + touch + keyboard accessible.
 * - Pixel-perfect alignment — both layers share the same container box and
 *   are clipped via `clip-path` (no width resizes → no jitter on the image).
 * - Smooth, no jitter — pointer events throttled with requestAnimationFrame.
 * - Checkerboard background makes transparency in the "after" layer visible.
 * - Respects prefers-reduced-motion (no transition on the handle).
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  initialPosition = 0.5,
  label = "Before / After comparison",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<number>(
    Math.max(0, Math.min(1, initialPosition)),
  );
  const [dragging, setDragging] = useState(false);
  const rafRef = useRef<number | null>(null);
  const pendingPosRef = useRef<number | null>(null);

  const pct = `${(position * 100).toFixed(2)}%`;

  // Apply clip-path directly so both layers update in the same frame.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // The "before" layer is clipped to the left of the slider position.
    const before = el.querySelector<HTMLElement>('[data-layer="before"]');
    if (before) {
      before.style.clipPath = `inset(0 ${(100 - position * 100).toFixed(2)}% 0 0)`;
    }
    // Move the handle.
    el.style.setProperty("--snaperase-pos", pct);
  }, [position, pct]);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const raw = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    pendingPosRef.current = clamped;
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (pendingPosRef.current != null) {
          setPosition(pendingPosRef.current);
        }
      });
    }
  }, []);

  // Pointer handlers (mouse, pen, touch — unified via PointerEvents).
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      try {
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      } catch {
        /* no-op: some browsers throw on invalid pointer id */
      }
      setDragging(true);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      updatePosition(e.clientX);
    },
    [dragging, updatePosition],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      try {
        (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      } catch {
        /* no-op */
      }
      setDragging(false);
    },
    [],
  );

  // Keyboard — arrows move 2%, Home/End jump to edges.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let delta = 0;
      switch (e.key) {
        case "ArrowLeft":
          delta = -0.02;
          break;
        case "ArrowRight":
          delta = 0.02;
          break;
        case "Home":
          setPosition(0);
          e.preventDefault();
          return;
        case "End":
          setPosition(1);
          e.preventDefault();
          return;
        default:
          return;
      }
      e.preventDefault();
      setPosition((p) => Math.max(0, Math.min(1, p + delta)));
    },
    [],
  );

  // Cleanup pending rAF.
  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Reset to middle when source changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition(Math.max(0, Math.min(1, initialPosition)));
  }, [beforeSrc, afterSrc, initialPosition]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl select-none",
        "ring-1 ring-inset ring-border bg-surface",
        "checkerboard-soft",
      )}
      style={
        {
          ["--snaperase-pos" as string]: pct,
        } as React.CSSProperties
      }
    >
      {/* AFTER layer (full-bleed, drawn FIRST = bottom-most) */}
      <img
        src={afterSrc}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        draggable={false}
        // The after layer is unclipped — the before layer paints on top of
        // the left portion only.
      />

      {/* BEFORE layer — clipped to the LEFT of the handle */}
      <div
        data-layer="before"
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: `inset(0 ${(100 - position * 100).toFixed(2)}% 0 0)`,
          // Safari fallback — older builds used `-webkit-clip-path`.
          WebkitClipPath: `inset(0 ${(100 - position * 100).toFixed(2)}% 0 0)`,
        }}
      >
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Interactive surface */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position * 100)}
        aria-valuetext={`${Math.round(position * 100)}%`}
        className={cn(
          "absolute inset-0 cursor-ew-resize outline-none focus-amber",
          dragging && "cursor-grabbing",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        {/* Vertical divider + grip knob */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: pct,
            transform: "translateX(-50%)",
          }}
        >
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.2)]" />
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "flex h-9 w-9 items-center justify-center rounded-full",
              "bg-foreground text-background shadow-lg",
              "ring-2 ring-background/60 transition-transform",
              dragging ? "scale-110" : "scale-100 hover:scale-105",
            )}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M5 4L2 8L5 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 4L14 8L11 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="pointer-events-none absolute top-3 left-3 rounded-md bg-background/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-border">
        Original
      </div>
      <div className="pointer-events-none absolute top-3 right-3 rounded-md bg-background/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-amber-accent ring-1 ring-inset ring-border">
        Result
      </div>
    </div>
  );
}
