"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { Dialog } from "radix-ui";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { cn } from "@/lib/utils";
import PostImage from "./PostImage";

interface ImageGalleryProps {
  images: string[];
  /** Foto con la que se abre */
  startIndex: number;
  isOpen: boolean;
  onClose: () => void;
  /** Título de la publicación, para los textos alternativos */
  postTitle: string;
}

const iconButton =
  "inline-flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/20 disabled:opacity-40";

// Galería a pantalla completa sobre Radix Dialog: flechas, deslizar en móvil,
// zoom y descarga (fetch → blob, para que funcione con imágenes de Cloudinary).
export default function ImageGallery({
  images,
  startIndex,
  isOpen,
  onClose,
  postTitle,
}: ImageGalleryProps) {
  const [active, setActive] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;

  useEffect(() => {
    if (isOpen) {
      setActive(startIndex);
      setZoom(1);
    }
  }, [isOpen, startIndex]);

  const go = (delta: number) => {
    if (total < 2) return;
    setActive((i) => (i + delta + total) % total);
    setZoom(1);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 3));
    else if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = zoom === 1 ? e.touches[0]?.clientX ?? null : null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const handleDownload = async () => {
    const url = getOptimizedUrl(images[active]);
    setDownloading(true);
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `jmv-ecuador-foto-${active + 1}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      // Si el servidor de la imagen no permite descargarla, se abre en otra pestaña
      window.open(images[active], "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  if (!total) return null;
  const src = images[active] ?? images[0];

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/95" />
        <Dialog.Content
          className="fixed inset-0 z-[60] flex flex-col text-white"
          onKeyDown={onKeyDown}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Fotos de «{postTitle}»</Dialog.Title>

          <div className="flex items-center justify-between gap-2 p-2 sm:p-4">
            <p className="px-2 text-base font-semibold" aria-live="polite">
              Foto {active + 1} de {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
                disabled={zoom <= 1}
                className={iconButton}
                aria-label="Alejar"
              >
                <ZoomOut className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 0.5, 3))}
                disabled={zoom >= 3}
                className={iconButton}
                aria-label="Acercar"
              >
                <ZoomIn className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className={iconButton}
                aria-label="Descargar foto"
              >
                {downloading ? (
                  <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <Dialog.Close className={iconButton} aria-label="Cerrar fotos">
                <X className="h-6 w-6" aria-hidden="true" />
              </Dialog.Close>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto px-2"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <PostImage
              key={src}
              src={src}
              alt={`Foto ${active + 1} de ${total} de la publicación «${postTitle}»`}
              loading="eager"
              maxWidth={1280}
              sizes="100vw"
              draggable={false}
              className="max-h-full max-w-full object-contain motion-safe:transition-transform motion-safe:duration-200"
              style={{ transform: `scale(${zoom})` }}
            />

            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className={cn(iconButton, "absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 sm:left-4")}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="h-7 w-7" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className={cn(iconButton, "absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 sm:right-4")}
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="h-7 w-7" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>

          {total > 1 ? (
            <ul className="flex gap-2 overflow-x-auto p-3 sm:justify-center" aria-label="Miniaturas">
              {images.map((image, index) => (
                <li key={`${image}-${index}`} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(index);
                      setZoom(1);
                    }}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-current={index === active ? "true" : undefined}
                    className={cn(
                      "relative block h-14 w-14 overflow-hidden rounded-lg border-2",
                      index === active ? "border-jmv-gold-text" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <PostImage
                      src={image}
                      alt=""
                      maxWidth={320}
                      sizes="56px"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
