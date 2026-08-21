/**
 * Image utilities: validation, decoding, encoding, memory management.
 *
 * All operations happen client-side. No image data ever leaves the browser.
 */

// ---------------------------------------------------------------------------
// File type & size validation
// ---------------------------------------------------------------------------

/**
 * Image MIME types the browser can decode natively and that we'll accept.
 * We do NOT rely on file extension — we sniff the file header bytes.
 */
export const ACCEPTED_INPUT_TYPES: readonly string[] = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
] as const;

/** File extension fallback for the input file picker accept attribute. */
export const ACCEPT_ATTR =
  "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif,.png,.jpg,.jpeg,.webp,.gif,.bmp,.avif";

/**
 * Browser-prefixed "magic bytes" for the formats we accept.
 * Used to validate the actual file content, not just the extension.
 */
const MAGIC_BYTES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
  { mime: "image/bmp", bytes: [0x42, 0x4d] }, // BM
  // AVIF has many boxes — accept "ftyp" at offset 4.
  { mime: "image/avif", bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
];

export interface ValidationResult {
  ok: boolean;
  /** Detected MIME type from magic bytes; null if unknown. */
  detectedMime: string | null;
  /** Declared MIME type from the file's `type` field. */
  declaredMime: string;
  /** Reason in English if validation failed. */
  reason?: string;
}

/**
 * Validate an uploaded file by sniffing its header bytes.
 * A renamed invalid file must not pass — we look at the actual content.
 */
export async function validateImageFile(
  file: File,
): Promise<ValidationResult> {
  const declaredMime = file.type || "application/octet-stream";

  if (file.size === 0) {
    return {
      ok: false,
      detectedMime: null,
      declaredMime,
      reason: "This file is empty.",
    };
  }

  // Read first 16 bytes for header detection.
  const header = new Uint8Array(
    file.size >= 16 ? await file.slice(0, 16).arrayBuffer() : await file.arrayBuffer(),
  );

  let detectedMime: string | null = null;
  for (const rule of MAGIC_BYTES) {
    const offset = rule.offset ?? 0;
    if (header.length < offset + rule.bytes.length) continue;
    let match = true;
    for (let i = 0; i < rule.bytes.length; i++) {
      if (header[offset + i] !== rule.bytes[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      detectedMime = rule.mime;
      break;
    }
  }

  if (!detectedMime) {
    return {
      ok: false,
      detectedMime: null,
      declaredMime,
      reason:
        "This image couldn't be processed. Unsupported format.",
    };
  }

  return { ok: true, detectedMime, declaredMime };
}

// ---------------------------------------------------------------------------
// Image dimension inspection
// ---------------------------------------------------------------------------

export interface ImageMeta {
  width: number;
  height: number;
  /** File size in bytes. */
  size: number;
  /** Estimated memory needed for full-res RGBA in bytes (w * h * 4). */
  estimatedMemoryBytes: number;
  /** True if pixels are likely to contain an alpha channel (PNG/WebP/GIF). */
  possiblyTransparent: boolean;
  /** Original file name. */
  name: string;
  /** Detected MIME type. */
  mime: string;
}

/**
 * Decode the image header (just enough to get dimensions) without keeping
 * the full decoded bitmap in memory. Uses `createImageBitmap` which is the
 * most memory-efficient path in modern browsers.
 */
export async function inspectImageFile(file: File): Promise<ImageMeta> {
  // `createImageBitmap` will throw on a corrupted file — exactly what we want.
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new ImageDecodeError(
      "This image couldn't be read. The file may be corrupted.",
    );
  }

  try {
    const w = bitmap.width;
    const h = bitmap.height;
    if (!w || !h) {
      throw new ImageDecodeError("This image has no valid dimensions.");
    }

    return {
      width: w,
      height: h,
      size: file.size,
      estimatedMemoryBytes: w * h * 4,
      possiblyTransparent:
        file.type === "image/png" ||
        file.type === "image/webp" ||
        file.type === "image/gif" ||
        file.type === "image/avif",
      name: file.name || "image",
      mime: file.type || "image/png",
    };
  } finally {
    // Always release the bitmap — never hold it after inspection.
    bitmap.close?.();
  }
}

/**
 * Heuristic warning thresholds for very large images.
 * Returns null if no warning is necessary.
 *
 * We do NOT reject the image — we just tell the user it might be heavy.
 */
export interface LargeImageWarning {
  level: "notice" | "warning" | "severe";
  message: string;
}

export function assessLargeImage(meta: ImageMeta): LargeImageWarning | null {
  const PIXELS = meta.width * meta.height;
  const MEM_MB = meta.estimatedMemoryBytes / (1024 * 1024);

  // Over ~80 MP, or >~320 MB of raw pixel data → severe. The browser will
  // very likely throw an OOM error. Recommend fast mode.
  if (PIXELS > 80_000_000 || MEM_MB > 320) {
    return {
      level: "severe",
      message:
        "Very large image. Use Fast mode to spare your device's memory. On weaker devices processing may fail.",
    };
  }

  // Over ~24 MP, or >~96 MB raw → warn but still allow.
  if (PIXELS > 24_000_000 || MEM_MB > 96) {
    return {
      level: "warning",
      message:
        "Large image. Processing may take longer and use more memory.",
    };
  }

  // Over ~12 MP, just a small notice.
  if (PIXELS > 12_000_000) {
    return {
      level: "notice",
      message: "Large image detected — this may take a moment.",
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Image decoding & encoding helpers
// ---------------------------------------------------------------------------

/**
 * Decode a Blob into an ImageBitmap, releasing intermediate resources.
 */
export async function blobToImageBitmap(blob: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(blob);
  } catch {
    throw new ImageDecodeError(
      "The image could not be decoded. The format may be corrupted.",
    );
  }
}

/**
 * Convert an ImageBitmap (or any CanvasImageSource) to ImageData.
 */
export function imageBitmapToImageData(
  bitmap: ImageBitmap,
): ImageData {
  const canvas = createCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ImageDecodeError("Canvas is not supported by your browser.");
  }
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

/**
 * Encode ImageData as a PNG or WebP Blob via canvas.toBlob.
 * PNG ignores `quality` (it's lossless); WebP uses it (0..1).
 */
export function encodeImageData(
  source: CanvasImageSource,
  width: number,
  height: number,
  format: "image/png" | "image/webp",
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new ImageEncodeError("Canvas is not supported by your browser."));
      return;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new ImageEncodeError("Export failed."));
          return;
        }
        resolve(blob);
      },
      format,
      format === "image/webp" ? quality : undefined,
    );
    // Schedule canvas cleanup. canvases are GC'd when they go out of scope,
    // but we explicitly clear to help memory pressure on large exports.
    setTimeout(() => {
      ctx.clearRect(0, 0, width, height);
    }, 0);
  });
}

/**
 * Compose a transparent foreground onto a background (color, gradient, or
 * image). The result is opaque RGB(A) — useful for "transparent + bg image"
 * exports.
 */
export function composeOnBackground(
  fg: CanvasImageSource,
  fgW: number,
  fgH: number,
  bgCanvas: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap,
  bgW: number,
  bgH: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = createCanvas(fgW, fgH);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new ImageEncodeError("Canvas is not supported by your browser."));
      return;
    }
    // Draw background (cover fit), then foreground on top.
    drawImageCover(ctx, bgCanvas, 0, 0, fgW, fgH, bgW, bgH);
    ctx.drawImage(fg, 0, 0, fgW, fgH);
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new ImageEncodeError("Composition failed.")),
      "image/png",
    );
  });
}

/**
 * Draw an image to fill a target rectangle using "cover" semantics.
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  sw: number,
  sh: number,
) {
  if (!sw || !sh) return;
  const scale = Math.max(dw / sw, dh / sh);
  const w = sw * scale;
  const h = sh * scale;
  const x = dx + (dw - w) / 2;
  const y = dy + (dh - h) / 2;
  ctx.drawImage(img, x, y, w, h);
}

/**
 * Create a canvas element.
 */
export function createCanvas(width: number, height: number): HTMLCanvasElement {
  if (width <= 0 || height <= 0) {
    throw new ImageDecodeError(
      "Invalid image dimensions when creating canvas.",
    );
  }
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

// ---------------------------------------------------------------------------
// URL & filename helpers
// ---------------------------------------------------------------------------

/**
 * Build the auto-branded download filename.
 * `image.png` → `image-made-with-arche-remove.png`
 */
export function brandFilename(originalName: string, ext: "png" | "webp"): string {
  const stem = (originalName || "image").replace(/\.[^.]+$/, "");
  return `${stem}-made-with-arche-remove.${ext}`;
}

/**
 * Trigger a browser download for a Blob.
 */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  // Defer revocation so the click event has time to register in Safari.
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 1500);
}

// ---------------------------------------------------------------------------
// Custom error types
// ---------------------------------------------------------------------------

export class ImageDecodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageDecodeError";
  }
}

export class ImageEncodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageEncodeError";
  }
}

/**
 * Friendly message for unknown errors during processing.
 */
export function friendlyError(err: unknown): string {
  if (err instanceof ImageDecodeError || err instanceof ImageEncodeError) {
    return err.message;
  }
  if (err instanceof Error) {
    const m = err.message.toLowerCase();
    if (m.includes("memory") || m.includes("out of memory")) {
      return "Not enough device memory for this image. Try Fast mode or a smaller image.";
    }
    if (m.includes("network") || m.includes("fetch")) {
      return "The model could not be loaded. Please check your internet connection and try again.";
    }
    if (m.includes("webgpu") || m.includes("webgl")) {
      return "Hardware acceleration could not be initialized. Trying again — it will automatically fall back to another mode.";
    }
  }
  return "An unexpected error occurred during processing. Your image was not uploaded — please try again.";
}
