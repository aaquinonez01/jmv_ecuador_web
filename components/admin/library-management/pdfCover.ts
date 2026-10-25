// Portada automática: renderiza la página 1 del PDF en el navegador.
// Reutiliza la carga perezosa de pdf.js del lector (una sola puerta al bundle y al worker).

import { renderPdfCover as renderFirstPage } from "@/components/biblioteca/reader/pdfjs";

export interface PdfCoverResult {
  cover: Blob;
  pageCount: number;
}

export async function renderPdfCover(source: File | ArrayBuffer, targetHeight = 800): Promise<PdfCoverResult> {
  // El lector trabaja por ancho: lo calculamos para una portada 2:3 del alto pedido
  const { blob, pageCount } = await renderFirstPage(source, { width: Math.round((targetHeight * 2) / 3) });
  return { cover: blob, pageCount };
}

/** Comprueba la firma %PDF- (los primeros bytes), no solo la extensión */
export async function looksLikePdf(file: File) {
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  const text = String.fromCharCode(...head);
  return text.includes("%PDF-");
}
