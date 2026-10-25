// Portada automática: renderiza la página 1 del PDF en el navegador.
// pdf.js se importa solo aquí (y en el lector), nunca en el listado público.

export interface PdfCoverResult {
  cover: Blob;
  pageCount: number;
}

type PdfJs = typeof import("pdfjs-dist");
let pdfjsPromise: Promise<PdfJs> | null = null;

function loadPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

export async function renderPdfCover(
  source: File | ArrayBuffer,
  targetHeight = 800
): Promise<PdfCoverResult> {
  const pdfjs = await loadPdfJs();
  const data = source instanceof ArrayBuffer ? new Uint8Array(source) : new Uint8Array(await source.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data, isEvalSupported: false }).promise;
  try {
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: targetHeight / base.height });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas no disponible");
    // Fondo blanco: los PDF sin fondo saldrían negros en JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const cover = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob"))), "image/jpeg", 0.86)
    );
    return { cover, pageCount: pdf.numPages };
  } finally {
    void pdf.destroy();
  }
}

/** Comprueba la firma %PDF- (los primeros bytes), no solo la extensión */
export async function looksLikePdf(file: File) {
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  const text = String.fromCharCode(...head);
  return text.includes("%PDF-");
}
