/**
 * arche.remove — client-side background removal wrapper.
 *
 * Wraps `@imgly/background-removal` with:
 *  - Real progress reporting (no fake percentages)
 *  - Model preload + caching (don't redownload for every image)
 *  - Two processing modes: "quality" (isnet_fp16) vs "fast" (isnet_quint8)
 *  - Graceful device selection (GPU if available, else CPU)
 *  - Centralised, typed error reporting
 *
 * Privacy guarantee: this module never touches any network endpoint that
 * is not the model asset CDN. The user's image bytes are passed to the
 * in-browser library directly as a Blob — never uploaded anywhere.
 */

import type { Config } from "@imgly/background-removal";

// We import the library lazily to keep the first paint fast and to allow
// proper code-splitting. This also ensures we only ever load the (heavy)
// onnxruntime-web bundle in the browser, not during SSR prerender.
type RemoveBgFn = (
  image: Blob | Uint8Array | ImageData | URL | string,
  config?: Config,
) => Promise<Blob>;
type PreloadFn = (config?: Config) => Promise<void>;

let _removeBgPromise: Promise<RemoveBgFn> | null = null;
let _preloadPromise: Promise<PreloadFn> | null = null;

/**
 * Lazily import the background-removal library.
 * Memoized — subsequent calls resolve immediately.
 */
export function loadBackgroundRemovalLib(): Promise<RemoveBgFn> {
  if (!_removeBgPromise) {
    _removeBgPromise = import("@imgly/background-removal").then(
      (mod) => mod.removeBackground as RemoveBgFn,
    );
  }
  return _removeBgPromise;
}

/**
 * Lazily import the preload function.
 */
export function loadPreloadFn(): Promise<PreloadFn> {
  if (!_preloadPromise) {
    _preloadPromise = import("@imgly/background-removal").then(
      (mod) => mod.preload as PreloadFn,
    );
  }
  return _preloadPromise;
}

// ---------------------------------------------------------------------------
// Processing modes
// ---------------------------------------------------------------------------

export type ProcessingMode = "quality" | "fast";

export interface ProcessingModeInfo {
  id: ProcessingMode;
  /** Title shown in the UI. */
  title: string;
  /** Subtitle describing the trade-off. */
  subtitle: string;
  /** Internal model name used by @imgly. */
  model: "isnet" | "isnet_fp16" | "isnet_quint8";
}

export const PROCESSING_MODES: Record<ProcessingMode, ProcessingModeInfo> = {
  quality: {
    id: "quality",
    title: "Original Quality",
    subtitle: "Maximum quality · original resolution · slower",
    // isnet_fp16 is the library default — best balance of size/quality.
    model: "isnet_fp16",
  },
  fast: {
    id: "fast",
    title: "Fast",
    subtitle: "Faster · less device memory · ideal for large images",
    // isnet_quint8 is the quantized (~40MB) model — good quality, lower memory.
    model: "isnet_quint8",
  },
};

// ---------------------------------------------------------------------------
// Progress tracking
// ---------------------------------------------------------------------------

/**
 * Real progress data — comes straight from @imgly's progress callback.
 * `(key, current, total)` where key is e.g. "fetch:asset.onnx" — we map
 * to friendly stage labels.
 */
export interface ProgressUpdate {
  /** Raw stage key from the library. */
  key: string;
  /** Current bytes or units. */
  current: number;
  /** Total bytes or units. */
  total: number;
  /** 0..1 fraction. May be NaN if total is 0 (e.g. start events). */
  fraction: number;
  /** Friendly label. */
  label: string;
  /** Whether this progress is "downloading model assets" vs "processing image". */
  stage: "download" | "compute";
}

/**
 * Map a raw @imgly progress key to a friendly label and stage classification.
 *
 * Empirically the keys look like:
 *   "fetch:..."     → model assets being fetched
 *   "compute:..."   → inference running
 *   "init:..."       → initialising runtime
 *
 * If the format changes, this still degrades gracefully.
 */
export function interpretProgressKey(rawKey: string): {
  label: string;
  stage: "download" | "compute";
} {
  const k = rawKey.toLowerCase();
  if (k.startsWith("fetch")) {
    return {
      label: "Loading AI model…",
      stage: "download" as const,
    };
  }
  if (k.startsWith("compute") || k.startsWith("inference")) {
    return {
      label: "Analyzing background…",
      stage: "compute" as const,
    };
  }
  if (k.startsWith("init")) {
    return {
      label: "Preparing AI…",
      stage: "download" as const,
    };
  }
  if (k.startsWith("decode")) {
    return {
      label: "Decoding image…",
      stage: "compute" as const,
    };
  }
  if (k.startsWith("encode")) {
    return {
      label: "Preparing export…",
      stage: "compute" as const,
    };
  }
  return {
    label: "Processing…",
    stage: "compute" as const,
  };
}

// ---------------------------------------------------------------------------
// Configuration builder
// ---------------------------------------------------------------------------

/**
 * Build the @imgly Config for a given processing mode.
 *
 * - `device: 'gpu'` lets the library use WebGPU/WebGL where available;
 *    it falls back to CPU internally if not.
 * - We pass a real `progress` callback — never fabricate values.
 * - Output is left as PNG (we re-encode to user's choice at export time
 *    because the library's WebP encoder does not preserve alpha on all
 *    browsers consistently; our canvas re-encode is guaranteed).
 */
export function buildConfig(
  mode: ProcessingMode,
  onProgress?: (u: ProgressUpdate) => void,
): Config {
  return {
    // Don't set publicPath — the library uses its free staticimgly.com CDN.
    device: "gpu",
    model: PROCESSING_MODES[mode].model,
    output: {
      format: "image/png",
      quality: 0.92,
    },
    // proxyToWorker keeps the main thread responsive during inference.
    proxyToWorker: true,
    progress: (key: string, current: number, total: number) => {
      if (!onProgress) return;
      const interp = interpretProgressKey(key);
      const fraction = total > 0 ? Math.min(1, current / total) : NaN;
      onProgress({
        key,
        current,
        total,
        fraction,
        label: interp.label,
        stage: interp.stage,
      });
    },
    // No debug logging in production.
    debug: false,
  };
}

// ---------------------------------------------------------------------------
// Preload + remove
// ---------------------------------------------------------------------------

/**
 * Preload the AI model for a given mode. Safe to call multiple times —
 * the browser will serve the assets from cache on subsequent calls.
 */
export async function preloadModel(mode: ProcessingMode): Promise<void> {
  const preload = await loadPreloadFn();
  await preload(buildConfig(mode));
}

/**
 * Remove the background from an image Blob, fully client-side.
 *
 * @throws {BackgroundRemovalError} on any failure.
 */
export async function removeBackground(
  image: Blob,
  mode: ProcessingMode,
  onProgress?: (u: ProgressUpdate) => void,
): Promise<Blob> {
  const remove = await loadBackgroundRemovalLib();
  try {
    return await remove(image, buildConfig(mode, onProgress));
  } catch (err) {
    throw new BackgroundRemovalError(
      err instanceof Error ? err.message : String(err),
    );
  }
}

/**
 * Custom error type for background-removal failures.
 */
export class BackgroundRemovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackgroundRemovalError";
  }
}
