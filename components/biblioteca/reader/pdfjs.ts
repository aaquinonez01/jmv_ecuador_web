"use client";

// Carga perezosa de pdf.js: solo la usan el lector y el formulario del admin.
// Nunca importes "pdfjs-dist" de forma estática: este módulo es la única puerta.

import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import type { LibraryDocument } from "@/types/library";

export type PdfJs = typeof import("pdfjs-dist");
export type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy };

let pdfjsPromise: Promise<PdfJs> | null = null;

/** Importa pdf.js una sola vez y deja configurado su worker */
export function loadPdfJs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist")
      .then((lib) => {
        if (!lib.GlobalWorkerOptions.workerSrc) {
          // El bundler copia el worker como archivo estático con hash (dev y build)
          lib.GlobalWorkerOptions.workerSrc = new URL(
            "pdfjs-dist/build/pdf.worker.min.mjs",
            import.meta.url,
          ).toString();
        }
        return lib;
      })
      .catch((err) => {
        pdfjsPromise = null;
        throw err;
      });
  }
  return pdfjsPromise;
}

/** Base de la API para el navegador (misma regla que config/axios.config.ts) */
export function clientApiBase() {
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

/** URL del PDF: la pública si viene, si no la ruta del archivo (que exige token para miembros) */
export function documentFileUrl(doc: Pick<LibraryDocument, "id" | "fileUrl">) {
  const api = clientApiBase();
  if (doc.fileUrl) {
    try {
      return new URL(doc.fileUrl, new URL(api).origin).toString();
    } catch {
      // fileUrl mal formada: usamos la ruta estándar
    }
  }
  return `${api}/library/documents/${encodeURIComponent(doc.id)}/file`;
}

export function withDownloadParam(url: string) {
  const u = new URL(url);
  u.searchParams.set("download", "1");
  return u.toString();
}

export function readAuthToken(): string | null {
  try {
    return window.localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

/**
 * Opciones comunes de getDocument: carga por partes (Range) y sin eval.
 * disableStream también va en true: con streaming pdf.js baja el archivo entero aunque
 * no haga falta (probado: 1,6 MB contra ~0,8 MB al abrir en la página 300 de 720).
 */
export function pdfSource(url: string, token?: string | null) {
  return {
    url,
    httpHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
    rangeChunkSize: 262_144,
    disableAutoFetch: true,
    disableStream: true,
    isEvalSupported: false,
  };
}

/** Resolución del canvas: devicePixelRatio con tope de píxeles para no agotar la memoria del móvil */
export function canvasScale(cssWidth: number, cssHeight: number) {
  const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  const coarse = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
  const maxPixels = coarse ? 4_200_000 : 9_000_000;
  let scale = Math.min(dpr, coarse ? 2.5 : 3);
  const area = cssWidth * cssHeight;
  if (area * scale * scale > maxPixels) scale = Math.sqrt(maxPixels / area);
  return Math.max(0.5, scale);
}

/**
 * Dibuja una página en un canvas nuevo con el ancho indicado (px reales).
 * El admin lo usa para generar la portada a partir de la primera página.
 */
export async function renderPageToCanvas(page: PDFPageProxy, width: number) {
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: width / base.width });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

/**
 * Portada a partir de la primera página de un PDF (File del input, ArrayBuffer o URL).
 * Devuelve un JPEG listo para subir como "cover" y el número de páginas.
 */
export async function renderPdfCover(
  source: File | Blob | ArrayBuffer | Uint8Array | string,
  { width = 900, quality = 0.86 }: { width?: number; quality?: number } = {},
): Promise<{ blob: Blob; pageCount: number; width: number; height: number }> {
  const lib = await loadPdfJs();
  const data =
    typeof source === "string"
      ? { url: source }
      : { data: source instanceof Blob ? new Uint8Array(await source.arrayBuffer()) : new Uint8Array(source) };
  const task = lib.getDocument({ ...data, isEvalSupported: false });
  try {
    const pdf = await task.promise;
    const page = await pdf.getPage(1);
    const canvas = await renderPageToCanvas(page, width);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo crear la imagen"))), "image/jpeg", quality),
    );
    const result = { blob, pageCount: pdf.numPages, width: canvas.width, height: canvas.height };
    canvas.width = 0;
    canvas.height = 0;
    return result;
  } finally {
    await task.destroy();
  }
}
