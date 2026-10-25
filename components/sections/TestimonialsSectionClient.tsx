"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from "lucide-react";
import type { TestimonialItem } from "@/types/activity-management";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { cn } from "@/lib/utils";
import SectionHeading from "../ui/SectionHeading";
import { buttonVariants } from "../ui/button-variants";

const AUTOPLAY_MS = 8000;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Carrusel accesible (patrón WAI-ARIA): autoplay pausable con botón visible,
// se detiene con foco o puntero encima y no arranca con "reducir movimiento".
export default function TestimonialsSectionClient({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverOrFocus, setHoverOrFocus] = useState(false);

  const total = testimonials.length;
  const canAutoplay = total > 1 && !reduceMotion;
  const isPlaying = canAutoplay && !userPaused && !hoverOrFocus;

  useEffect(() => {
    setCurrentIndex(0);
  }, [total]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(interval);
  }, [isPlaying, total]);

  const goTo = useCallback((index: number) => setCurrentIndex((index + total) % total), [total]);

  if (!total) {
    return null;
  }

  const activeItem = testimonials[currentIndex];

  return (
    <section
      aria-labelledby="testimonios-titulo"
      className="relative overflow-hidden bg-gradient-to-b from-page via-section-blue to-page py-16 sm:py-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="testimonios-titulo"
          eyebrow="Testimonios"
          title="Voces que transforman"
          description="Jóvenes que han encontrado en JMV un espacio para crecer en la fe, servir y hacer amigos para toda la vida."
        />

        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Testimonios de jóvenes de JMV"
          className="relative mx-auto max-w-4xl"
          onMouseEnter={() => setHoverOrFocus(true)}
          onMouseLeave={() => setHoverOrFocus(false)}
          onFocus={() => setHoverOrFocus(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHoverOrFocus(false);
          }}
        >
          {total > 1 && (
            <div className="mb-4 flex justify-end">
              {canAutoplay && (
                <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium text-fg hover:bg-surface-2 dark:hover:bg-white/10"
                >
                  {userPaused ? (
                    <Play className="h-4 w-4" aria-hidden />
                  ) : (
                    <Pause className="h-4 w-4" aria-hidden />
                  )}
                  {userPaused ? "Reanudar" : "Pausar"}
                  <span className="sr-only"> el carrusel de testimonios</span>
                </button>
              )}
            </div>
          )}

          <div aria-live={isPlaying ? "off" : "polite"} aria-atomic="true">
            <figure
              key={activeItem.id}
              role="group"
              aria-roledescription="testimonio"
              aria-label={`${currentIndex + 1} de ${total}`}
              className="rounded-3xl border border-line bg-surface p-6 text-center shadow-card-lg dark:border-white/15 dark:bg-white/5 dark:shadow-2xl sm:p-10 md:p-12"
            >
              <Quote className="mx-auto mb-6 h-10 w-10 text-accent-gold" aria-hidden />
              <blockquote className="font-display text-xl leading-relaxed text-fg sm:text-2xl md:text-3xl">
                <p>“{activeItem.quote}”</p>
              </blockquote>

              <figcaption className="mt-8 flex items-center justify-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-jmv-blue text-lg font-bold text-white">
                  {activeItem.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getOptimizedUrl(activeItem.imageUrl, { w: 160 })}
                      loading="lazy"
                      decoding="async"
                      width={56}
                      height={56}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span aria-hidden>{initials(activeItem.name)}</span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-fg">{activeItem.name}</p>
                  {activeItem.role && <p className="text-sm text-fg-muted">{activeItem.role}</p>}
                  <p className="text-sm text-fg-subtle">{activeItem.location || "JMV Ecuador"}</p>
                </div>
              </figcaption>
            </figure>
          </div>

          {total > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => goTo(currentIndex - 1)}
                aria-label="Testimonio anterior"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-card hover:bg-surface-2 dark:border-transparent dark:bg-white/10 dark:hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>

              <div className="flex items-center">
                {testimonials.map((item, index) => {
                  const active = index === currentIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`Ver testimonio ${index + 1} de ${total}: ${item.name}`}
                      aria-current={active ? "true" : undefined}
                      className="group inline-flex h-11 w-8 items-center justify-center"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "block h-3 rounded-full transition-[width,background-color] duration-300",
                          active ? "w-6 bg-accent-gold" : "w-3 bg-fg/30 group-hover:bg-fg/60 dark:bg-white/40 dark:group-hover:bg-white/70",
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goTo(currentIndex + 1)}
                aria-label="Testimonio siguiente"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-card hover:bg-surface-2 dark:border-transparent dark:bg-white/10 dark:hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </div>
          )}
        </div>

        <div className="mt-14 text-center">
          <h3 className="mb-3 text-2xl font-bold text-fg">
            ¿Quieres ser parte de estas historias?
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-fg-muted">
            Escríbenos y te ayudamos a encontrar un grupo de JMV cerca de ti.
          </p>
          <Link href="/unete" className={buttonVariants({ variant: "gold" })}>
            Encuentra tu grupo
          </Link>
        </div>
      </div>
    </section>
  );
}
