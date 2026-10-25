"use client";

import { memo, useEffect, useRef, useState } from "react";
import type { RenderTask, TextLayer } from "pdfjs-dist";
import { canvasScale, type PdfJs, type PDFDocumentProxy, type PDFPageProxy } from "./pdfjs";

type Props = {
  lib: PdfJs;
  pdf: PDFDocumentProxy;
  pageNumber: number;
  numPages: number;
  /** Ancho en px CSS */
  width: number;
  /** alto / ancho */
  aspect: number;
  /** Solo las páginas activas tienen canvas; las demás son un hueco del mismo tamaño */
  active: boolean;
  onAspect?: (pageNumber: number, aspect: number) => void;
  className?: string;
  style?: React.CSSProperties;
};

function PdfPage({ lib, pdf, pageNumber, numPages, width, aspect, active, onAspect, className, style }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [failed, setFailed] = useState(false);
  const height = Math.round(width * aspect);
  const loadedRef = useRef<PDFPageProxy | null>(null);
  const aspectRef = useRef(aspect);
  useEffect(() => {
    aspectRef.current = aspect;
  }, [aspect]);

  useEffect(() => {
    const holder = holderRef.current;
    const textDiv = textRef.current;
    if (!active || !holder || !textDiv || width <= 0) return;

    let cancelled = false;
    let renderTask: RenderTask | null = null;
    let textLayer: TextLayer | null = null;
    let page: PDFPageProxy | null = null;

    (async () => {
      try {
        page = await pdf.getPage(pageNumber);
        loadedRef.current = page;
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        const realAspect = base.height / base.width;
        if (Math.abs(realAspect - aspectRef.current) > 0.002) onAspect?.(pageNumber, realAspect);
        const viewport = page.getViewport({ scale: width / base.width });

        // Se dibuja en un canvas nuevo y se cambia al terminar: al hacer zoom no parpadea
        const canvas = document.createElement("canvas");
        const out = canvasScale(viewport.width, viewport.height);
        canvas.width = Math.floor(viewport.width * out);
        canvas.height = Math.floor(viewport.height * out);
        canvas.setAttribute("aria-hidden", "true");
        canvas.className = "absolute inset-0 h-full w-full";
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("Canvas no disponible");
        renderTask = page.render({
          canvasContext: ctx,
          viewport,
          transform: out !== 1 ? [out, 0, 0, out, 0, 0] : undefined,
        });
        await renderTask.promise;
        if (cancelled) {
          canvas.width = 0;
          canvas.height = 0;
          return;
        }
        holder.querySelectorAll("canvas").forEach((old) => {
          old.width = 0;
          old.height = 0;
          old.remove();
        });
        holder.prepend(canvas);
        setDrawn(true);
        setFailed(false);

        // Capa de texto: selección, búsqueda del navegador y lectores de pantalla
        textDiv.replaceChildren();
        textDiv.style.setProperty("--scale-factor", String(viewport.scale));
        textLayer = new lib.TextLayer({
          textContentSource: page.streamTextContent({ includeMarkedContent: true }),
          container: textDiv,
          viewport,
        });
        await textLayer.render();
        if (cancelled) return;
        const end = document.createElement("div");
        end.className = "endOfContent";
        textDiv.append(end);
      } catch (err) {
        if (cancelled || (err as Error)?.name === "RenderingCancelledException" || (err as Error)?.name === "AbortException") return;
        setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      renderTask?.cancel();
      textLayer?.cancel();
    };
  }, [lib, pdf, pageNumber, width, active, onAspect]);

  // Fuera de vista: libera la memoria del canvas y de la página
  useEffect(() => {
    if (active) return;
    const holder = holderRef.current;
    holder?.querySelectorAll("canvas").forEach((c) => {
      c.width = 0;
      c.height = 0;
      c.remove();
    });
    textRef.current?.replaceChildren();
    setDrawn(false);
    // Solo si llegó a dibujarse: pedir la página aquí la descargaría sin necesidad
    try {
      loadedRef.current?.cleanup();
    } catch {}
    loadedRef.current = null;
  }, [active]);

  useEffect(
    () => () => {
      try {
        loadedRef.current?.cleanup();
      } catch {
        // El documento ya se destruyó al salir del lector
      }
    },
    [],
  );

  return (
    <div
      role="group"
      aria-roledescription="página"
      aria-label={`Página ${pageNumber} de ${numPages}`}
      data-page={pageNumber}
      className={`jmv-reader-page relative shrink-0 overflow-hidden rounded-[3px] bg-(--r-paper) shadow-[0_1px_3px_rgb(0_0_0/0.12),0_8px_24px_-8px_rgb(0_0_0/0.25)] ${className ?? ""}`}
      style={{ width, height, ...style }}
    >
      <div ref={holderRef} className="absolute inset-0" />
      {!drawn && (
        <div aria-hidden="true" className="jmv-reader-shimmer absolute inset-0 flex items-center justify-center">
          <span className="font-display text-4xl text-(--r-muted) opacity-40">{pageNumber}</span>
        </div>
      )}
      {failed && (
        <p className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-sm text-(--r-muted)">
          No pudimos mostrar esta página.
        </p>
      )}
      <div ref={textRef} className="textLayer" />
    </div>
  );
}

export default memo(PdfPage);
