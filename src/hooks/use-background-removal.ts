"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PROCESSING_MODES,
  ProcessingMode,
  ProgressUpdate,
  removeBackground,
} from "@/lib/ai/background-removal";
import { friendlyError } from "@/lib/image-utils";

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

export type Phase =
  | "idle"
  | "validating"
  | "ready"
  | "processing"
  | "done"
  | "error";

export interface RemoveResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export interface UseBackgroundRemovalState {
  phase: Phase;
  /** Friendly user-facing message. */
  status: string;
  /** True if currently downloading model assets. */
  downloadingModel: boolean;
  /** True if currently running inference on the image. */
  computing: boolean;
  /** Real fraction in [0,1] when available; null when indeterminate. */
  progressFraction: number | null;
  /** Current progress label. */
  progressLabel: string;
  /** Result blob + URL when done. */
  result: RemoveResult | null;
  /** Friendly error message when phase === "error". */
  error: string | null;
  /** Active processing mode. */
  mode: ProcessingMode;
  /** Switch the processing mode (only effective before processing starts). */
  setMode: (m: ProcessingMode) => void;
  /** Process a Blob. Caller is responsible for having already validated it. */
  process: (image: Blob, width: number, height: number) => Promise<void>;
  /** Reset everything for a new image. */
  reset: () => void;
  /** Clear the error state. */
  clearError: () => void;
}

const DEFAULT_STATUS: Record<Phase, string> = {
  idle: "Ready · select or drop an image",
  validating: "Validating image…",
  ready: "Ready to process",
  processing: "Processing…",
  done: "Done · background removed",
  error: "An error occurred",
};

export function useBackgroundRemoval(): UseBackgroundRemovalState {
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState<string>(DEFAULT_STATUS.idle);
  const [downloadingModel, setDownloadingModel] = useState(false);
  const [computing, setComputing] = useState(false);
  const [progressFraction, setProgressFraction] = useState<number | null>(null);
  const [progressLabel, setProgressLabel] = useState<string>("");
  const [result, setResult] = useState<RemoveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ProcessingMode>("quality");

  // Keep track of object URLs so we can revoke them on reset / re-process.
  const urlsRef = useRef<string[]>([]);
  const trackUrl = useCallback((url: string) => {
    urlsRef.current.push(url);
    return url;
  }, []);
  const revokeAll = useCallback(() => {
    for (const u of urlsRef.current) {
      URL.revokeObjectURL(u);
    }
    urlsRef.current = [];
  }, []);

  // Cleanup on unmount.
  useEffect(() => revokeAll, [revokeAll]);

  const process = useCallback(
    async (image: Blob, width: number, height: number) => {
      setPhase("processing");
      setStatus(DEFAULT_STATUS.processing);
      setError(null);
      setProgressFraction(null);
      setProgressLabel("");
      setDownloadingModel(false);
      setComputing(false);
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return null;
      });

      let sawDownload = false;
      let sawCompute = false;
      // Debounce stage transitions so we don't flicker on every progress tick.
      let lastStageSet = 0;

      try {
        const blob = await removeBackground(image, mode, (u: ProgressUpdate) => {
          // Update label and fraction in-place.
          setProgressLabel(u.label);

          if (u.stage === "download") {
            sawDownload = true;
            if (!sawCompute && Date.now() - lastStageSet > 80) {
              setDownloadingModel(true);
              setComputing(false);
              setStatus(u.label);
              lastStageSet = Date.now();
            }
          } else {
            sawCompute = true;
            if (Date.now() - lastStageSet > 80) {
              setDownloadingModel(false);
              setComputing(true);
              setStatus(u.label);
              lastStageSet = Date.now();
            }
          }

          if (Number.isFinite(u.fraction) && u.total > 0) {
            setProgressFraction(u.fraction);
          } else {
            setProgressFraction(null);
          }
        });

        const url = URL.createObjectURL(blob);
        trackUrl(url);
        setResult({ blob, url, width, height });
        setPhase("done");
        setStatus(DEFAULT_STATUS.done);
        setProgressFraction(1);
        setDownloadingModel(false);
        setComputing(false);
      } catch (err) {
        const friendly = friendlyError(err);
        setError(friendly);
        setPhase("error");
        setStatus(DEFAULT_STATUS.error);
        setDownloadingModel(false);
        setComputing(false);
        setProgressFraction(null);
      }
    },
    [mode, trackUrl],
  );

  const reset = useCallback(() => {
    revokeAll();
    setResult(null);
    setError(null);
    setPhase("idle");
    setStatus(DEFAULT_STATUS.idle);
    setProgressFraction(null);
    setProgressLabel("");
    setDownloadingModel(false);
    setComputing(false);
  }, [revokeAll]);

  const clearError = useCallback(() => {
    setError(null);
    if (phase === "error") {
      setPhase("idle");
      setStatus(DEFAULT_STATUS.idle);
    }
  }, [phase]);

  return {
    phase,
    status,
    downloadingModel,
    computing,
    progressFraction,
    progressLabel,
    result,
    error,
    mode,
    setMode: (m) => setMode(m),
    process,
    reset,
    clearError,
  };
}

export { PROCESSING_MODES } from "@/lib/ai/background-removal";
