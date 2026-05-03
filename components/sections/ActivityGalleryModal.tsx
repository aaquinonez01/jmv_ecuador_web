"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  Calendar,
  MapPin,
} from "lucide-react";
import type { ActivityItem } from "@/types/activity-management";

interface Slide {
  src: string;
  alt: string;
}

interface Props {
  activity: ActivityItem | null;
  slides: Slide[];
  onClose: () => void;
  onOpenLightbox: (index: number) => void;
}

function formatDate(value?: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function ActivityGalleryModal({
  activity,
  slides,
  onClose,
  onOpenLightbox,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const total = slides.length;

  useEffect(() => {
    setCurrent(0);
    setShowFullDescription(false);
  }, [activity?.id]);

  useEffect(() => {
    if (!activity) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activity]);

  useEffect(() => {
    if (!activity) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && total > 1)
        setCurrent((c) => (c + 1) % total);
      if (e.key === "ArrowLeft" && total > 1)
        setCurrent((c) => (c - 1 + total) % total);
      if ((e.key === "f" || e.key === "F") && total > 0)
        onOpenLightbox(current);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activity, total, current, onClose, onOpenLightbox]);

  useEffect(() => {
    const node = thumbnailsRef.current?.querySelector<HTMLButtonElement>(
      `[data-index="${current}"]`,
    );
    node?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [current]);

  const dateLabel = useMemo(() => {
    if (!activity) return null;
    const start = formatDate(activity.startDate);
    const end = formatDate(activity.endDate);
    if (start && end && start !== end) return `${start} — ${end}`;
    return start;
  }, [activity]);

  const description = activity?.description?.trim() || "";
  const shouldTruncate = description.length > 280;
  const visibleDescription =
    shouldTruncate && !showFullDescription
      ? `${description.slice(0, 280).trimEnd()}…`
      : description;

  if (!activity) return null;

  const next = () => total > 1 && setCurrent((c) => (c + 1) % total);
  const prev = () =>
    total > 1 && setCurrent((c) => (c - 1 + total) % total);

  const currentSlide = slides[current];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-md sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl ring-1 ring-white/10 sm:h-[92vh] sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className="absolute top-0 right-0 left-0 z-20 flex items-start justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent p-3 sm:p-4">
            <div className="min-w-0 flex-1 pr-2">
              <h2 className="truncate text-base font-bold text-white sm:text-xl">
                {activity.title}
              </h2>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/65 sm:text-xs">
                {dateLabel && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-jmv-gold" />
                    {dateLabel}
                  </span>
                )}
                {activity.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-jmv-gold" />
                    {activity.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {total > 0 && (
                <button
                  onClick={() => onOpenLightbox(current)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white sm:h-10 sm:w-10"
                  aria-label="Pantalla completa"
                  title="Pantalla completa (F)"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white sm:h-10 sm:w-10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main image */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
            {currentSlide ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.src}
                  src={currentSlide.src}
                  alt={currentSlide.alt}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full w-full cursor-zoom-in object-contain"
                  onClick={() => onOpenLightbox(current)}
                />
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/45">
                <Camera className="h-14 w-14" />
                <p className="text-sm">Sin fotos cargadas</p>
              </div>
            )}

            {/* Arrows */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="group absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white sm:left-4 sm:p-3"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={next}
                  className="group absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white sm:right-4 sm:p-3"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            {/* Counter */}
            {total > 1 && (
              <div className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur sm:right-4 sm:bottom-4 sm:text-sm">
                {current + 1} / {total}
              </div>
            )}
          </div>

          {/* Bottom: thumbnails + description */}
          <div className="shrink-0 border-t border-white/5 bg-slate-950/80 backdrop-blur">
            {/* Thumbnails */}
            {total > 1 && (
              <div
                ref={thumbnailsRef}
                className="scrollbar-hide flex gap-1.5 overflow-x-auto px-3 py-2 sm:gap-2 sm:px-4 sm:py-3"
              >
                {slides.map((slide, index) => (
                  <button
                    key={`${slide.src}-${index}`}
                    data-index={index}
                    onClick={() => setCurrent(index)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition sm:h-16 sm:w-24 ${
                      index === current
                        ? "ring-2 ring-jmv-gold ring-offset-1 ring-offset-slate-950"
                        : "opacity-60 ring-1 ring-white/10 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {(activity.summary || description) && (
              <div className="border-t border-white/5 px-4 py-3 sm:px-6 sm:py-4">
                {activity.summary && (
                  <p className="text-sm font-semibold text-white sm:text-base">
                    {activity.summary}
                  </p>
                )}
                {description && (
                  <>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/70">
                      {visibleDescription}
                    </p>
                    {shouldTruncate && (
                      <button
                        onClick={() => setShowFullDescription((s) => !s)}
                        className="mt-1 text-xs font-semibold text-jmv-gold hover:text-amber-300"
                      >
                        {showFullDescription ? "Ver menos" : "Ver más"}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
