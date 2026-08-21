/**
 * Browser capability detection for client-side AI processing.
 *
 * arche.remove prefers WebGPU → WebGL → WASM → CPU fallback automatically.
 * The @imgly/background-removal library handles the actual backend selection
 * based on `device: 'gpu' | 'cpu'` config — this module just exposes
 * what's available so the UI can tell the user what's happening, and so
 * we can fail gracefully when no viable backend exists.
 */

export type AccelerationBackend = "webgpu" | "webgl" | "wasm" | "none";

export interface BrowserCapabilities {
  /** True if `navigator.gpu` exists (WebGPU API present). */
  webgpu: boolean;
  /** True if WebGL2 (and therefore WebGL) is available. */
  webgl: boolean;
  /** True if WebAssembly is available (always true in any modern browser). */
  wasm: boolean;
  /** True if SharedArrayBuffer is usable (needed for optimal ORT performance). */
  sharedArrayBuffer: boolean;
  /** True if the user prefers reduced motion. */
  prefersReducedMotion: boolean;
  /** True if running on a touch-capable device (mobile/tablet). */
  touch: boolean;
  /** Coarse device memory in GB (Chrome/Edge only via `navigator.deviceMemory`). */
  deviceMemoryGB?: number;
  /** Coarse hardware concurrency (cores). */
  hardwareConcurrency: number;
  /** Best available acceleration backend. */
  best: AccelerationBackend;
}

/**
 * Detect browser capabilities. Safe to call in a browser; returns a "none"
 * profile when called from the server (which should never happen because
 * this module is only imported from client components, but guard anyway).
 */
export function detectCapabilities(): BrowserCapabilities {
  if (typeof window === "undefined") {
    return {
      webgpu: false,
      webgl: false,
      wasm: false,
      sharedArrayBuffer: false,
      prefersReducedMotion: false,
      touch: false,
      deviceMemoryGB: undefined,
      hardwareConcurrency: 0,
      best: "none",
    };
  }

  const webgpu = typeof navigator !== "undefined" && "gpu" in navigator;

  // WebGL detection — try creating a WebGL2 context, then WebGL1.
  let webgl = false;
  try {
    const testCanvas = document.createElement("canvas");
    const gl2 =
      testCanvas.getContext("webgl2") ||
      (testCanvas.getContext("webgl") as WebGLRenderingContext | null);
    webgl = !!gl2;
    // Clean up — explicitly release the context.
    const ext = gl2?.getExtension("WEBGL_lose_context");
    ext?.loseContext?.();
  } catch {
    webgl = false;
  }

  const wasm =
    typeof WebAssembly !== "undefined" &&
    typeof WebAssembly.instantiate === "function";

  const sharedArrayBuffer =
    typeof (globalThis as { SharedArrayBuffer?: unknown }).SharedArrayBuffer !==
    "undefined";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const touch =
    "ontouchstart" in window ||
    (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 0);

  const nav = navigator as Navigator & { deviceMemory?: number };
  const deviceMemoryGB = nav.deviceMemory;

  const hardwareConcurrency = navigator.hardwareConcurrency || 0;

  // Priority: WebGPU > WebGL > WASM > none.
  let best: AccelerationBackend = "none";
  if (webgpu) best = "webgpu";
  else if (webgl) best = "webgl";
  else if (wasm) best = "wasm";

  return {
    webgpu,
    webgl,
    wasm,
    sharedArrayBuffer,
    prefersReducedMotion,
    touch,
    deviceMemoryGB,
    hardwareConcurrency,
    best,
  };
}

/**
 * Human-friendly description of the active backend.
 */
export function describeBackend(caps: BrowserCapabilities): string {
  switch (caps.best) {
    case "webgpu":
      return "WebGPU enabled · maximum acceleration";
    case "webgl":
      return "WebGL enabled · good acceleration";
    case "wasm":
      return "WASM enabled · running on CPU";
    default:
      return "";
  }
}

/**
 * True if the browser is too limited to run the model at all.
 * Currently this means: no WebAssembly at all.
 */
export function isUnsupported(caps: BrowserCapabilities): boolean {
  return !caps.wasm;
}
