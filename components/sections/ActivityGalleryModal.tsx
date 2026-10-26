"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Dialog } from "radix-ui";
import { useReducedMotion } from "framer-motion";
import { Calendar, Camera, ChevronLeft, ChevronRight, Heart, MapPin, Maximize2, X } from "lucide-react";
import type { ActivityItem } from "@/types/activity-management";
import { getOptimizedUrl, viewerUrl } from "@/lib/helpers/cloudinary";
import { formatDate } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button-variants";
import type { AlbumSlide } from "./ActivitiesAlbumsClient";

interface Props {
  activity: ActivityItem | null;
  slides: AlbumSlide[];
  /** Mientras el lightbox está abierto el modal no reacciona al teclado */
  lightboxOpen: boolean;
  /** Nodo donde se monta el lightbox (dentro del diálogo, para que el foco no quede atrapado fuera) */
  onPortalReady: (node: HTMLElement | null) => void;
  onClose: () => void;
  onOpenLightbox: (index: number) => void;
}

const iconButton =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25";

export default function ActivityGalleryModal({
  activity,
  slides,
  lightboxOpen,
  onPortalReady,
  onClose,
  onOpenLightbox,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const goToProximas = useRef(false);
  const reduceMotion = useReducedMotion();

  const total = slides.length;

  useEffect(() => {
    setCurrent(0);
    setShowFullDescription(false);
  }, [activity?.id]);

  useEffect(() => {
    const node = thumbnailsRef.current?.querySelector<HTMLButtonElement>(`[data-index="${current}"]`);
    node?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [current, reduceMotion]);

  const dateLabel = useMemo(() => {
    if (!activity?.startDate) return null;
    const start = formatDate(activity.startDate);
    const end = activity.endDate ? formatDate(activity.endDate) : null;
    return end && end !== start ? `${start} al ${end}` : start;
  }, [activity]);

  const description = activity?.description?.trim() || "";
  const shouldTruncate = description.length > 280;
  const visibleDescription =
    shouldTruncate && !showFullDescription ? `${description.slice(0, 280).trimEnd()}…` : description;

  const next = () => total > 1 && setCurrent((c) => (c + 1) % total);
  const prev = () => total > 1 && setCurrent((c) => (c - 1 + total) % total);

  // Flechas para pasar fotos; no actúan si el lightbox está abierto ni dentro de controles de texto
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (lightboxOpen || total < 2) return;
    if ((e.target as HTMLElement).closest("input, textarea, select")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const currentSlide = slides[current];

  return (
    <Dialog.Root open={Boolean(activity)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0" />
        <Dialog.Content
          ref={onPortalReady}
          aria-describedby={undefined}
          onKeyDown={handleKeyDown}
          onEscapeKeyDown={(e) => {
            if (lightboxOpen) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (lightboxOpen) e.preventDefault();
          }}
          onCloseAutoFocus={(e) => {
            if (!goToProximas.current) return;
            goToProximas.current = false;
            e.preventDefault();
            const section = document.getElementById("proximas");
            if (!section) {
              window.location.href = "/actividades#proximas";
              return;
            }
            history.replaceState(null, "", "#proximas");
            section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
            const heading = document.getElementById("proximas-titulo");
            heading?.setAttribute("tabindex", "-1");
            heading?.focus({ preventScroll: true });
          }}
          // Contenedor a pantalla completa sin transform: el lightbox (position: fixed) se monta
          // aquí dentro y ocupa toda la ventana.
          // Tema: visor de fotos oscuro en ambos modos (isla data-tone="dark"), como el lightbox:
          // un fondo negro deja ver mejor las fotos y el foco queda dorado sobre él.
          data-tone="dark"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !lightboxOpen) onClose();
          }}
        >
          {activity && (
            <div className="relative flex h-[95dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl ring-1 ring-white/10 sm:h-[92dvh] sm:rounded-2xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4">
              {/* Barra superior */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 p-3 sm:p-4">
                <div className="min-w-0 flex-1 pr-2">
                  <Dialog.Title className="text-base font-bold text-white sm:text-xl">
                    {activity.title}
                  </Dialog.Title>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-200 sm:text-sm">
                    {dateLabel && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-jmv-gold-text" aria-hidden />
                        {dateLabel}
                      </span>
                    )}
                    {activity.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-jmv-gold-text" aria-hidden />
                        {activity.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  {total > 0 && (
                    <button
                      type="button"
                      onClick={() => onOpenLightbox(current)}
                      className={iconButton}
                      aria-label="Ver foto en pantalla completa"
                    >
                      <Maximize2 className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                  <Dialog.Close className={iconButton} aria-label="Cerrar álbum">
                    <X className="h-5 w-5" aria-hidden />
                  </Dialog.Close>
                </div>
              </div>

              {/* Foto principal */}
              <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black">
                {currentSlide ? (
                  <button
                    type="button"
                    onClick={() => onOpenLightbox(current)}
                    className="h-full w-full cursor-zoom-in"
                    aria-label={`Ampliar foto ${current + 1} de ${total}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={currentSlide.src}
                      src={viewerUrl(currentSlide.src)}
                      alt={currentSlide.alt}
                      decoding="async"
                      className="h-full w-full object-contain motion-safe:animate-in motion-safe:fade-in-0"
                    />
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-300">
                    <Camera className="h-14 w-14" aria-hidden />
                    <p className="text-sm">Este álbum todavía no tiene fotos</p>
                  </div>
                )}

                {total > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      className={`${iconButton} absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 sm:left-4`}
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="h-6 w-6" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className={`${iconButton} absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 sm:right-4`}
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight className="h-6 w-6" aria-hidden />
                    </button>
                    <p
                      aria-live="polite"
                      className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white sm:right-4 sm:bottom-4 sm:text-sm"
                    >
                      <span className="sr-only">Foto </span>
                      {current + 1} / {total}
                    </p>
                  </>
                )}
              </div>

              {/* Miniaturas y descripción */}
              <div className="max-h-[40%] shrink-0 overflow-y-auto border-t border-white/10 bg-slate-950/80">
                {total > 1 && (
                  <div
                    ref={thumbnailsRef}
                    role="group"
                    aria-label="Miniaturas del álbum"
                    className="scrollbar-hide flex gap-2 overflow-x-auto px-3 py-2 sm:px-4 sm:py-3"
                  >
                    {slides.map((slide, index) => (
                      <button
                        key={`${slide.src}-${index}`}
                        type="button"
                        data-index={index}
                        onClick={() => setCurrent(index)}
                        aria-label={`Foto ${index + 1} de ${total}`}
                        aria-current={index === current ? "true" : undefined}
                        className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition sm:h-16 sm:w-24 ${
                          index === current
                            ? "ring-2 ring-jmv-gold-text ring-offset-2 ring-offset-slate-950"
                            : "opacity-70 ring-1 ring-white/10 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getOptimizedUrl(slide.src, { w: 200 })}
                          loading="lazy"
                          decoding="async"
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/10 px-4 py-3 sm:px-6 sm:py-4">
                  {activity.summary && (
                    <p className="text-sm font-semibold text-white sm:text-base">{activity.summary}</p>
                  )}
                  {description && (
                    <>
                      <p id="album-descripcion" className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-200">
                        {visibleDescription}
                      </p>
                      {shouldTruncate && (
                        <button
                          type="button"
                          onClick={() => setShowFullDescription((s) => !s)}
                          aria-expanded={showFullDescription}
                          aria-controls="album-descripcion"
                          className="mt-1 min-h-11 text-sm font-semibold text-jmv-gold-text underline underline-offset-4 hover:text-white"
                        >
                          {showFullDescription ? "Ver menos" : "Ver más"}
                        </button>
                      )}
                    </>
                  )}
                  <div className="mt-3">
                    <a
                      href="#proximas"
                      onClick={(e) => {
                        e.preventDefault();
                        goToProximas.current = true;
                        onClose();
                      }}
                      className={buttonVariants({ variant: "gold", size: "sm" })}
                    >
                      <Heart className="mr-2 h-4 w-4" aria-hidden />
                      Quiero vivir esto
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
