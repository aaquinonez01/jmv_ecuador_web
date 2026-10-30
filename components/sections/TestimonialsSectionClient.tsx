"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Pause, Play } from "lucide-react";
import type { TestimonialItem } from "@/types/activity-management";
import { StarsRing } from "@/components/brand";
import { cn } from "@/lib/utils";
import ReadMore from "../media/ReadMore";
import SectionHeading from "../ui/SectionHeading";
import { buttonVariants } from "../ui/button-variants";

const AUTOPLAY_MS = 9000;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Recorte centrado en la cara (Cloudinary g_face): la persona se ve completa aunque
// la foto subida sea horizontal o tenga mucho fondo.
function portrait(url: string, w: number, ratio = "4:5") {
  if (!url.includes("res.cloudinary.com")) return url;
  const [base, rest] = url.split("/upload/");
  if (!rest) return url;
  return `${base}/upload/c_fill,g_face,ar_${ratio},w_${w},f_auto,q_auto/${rest}`;
}

function Portrait({ item, priority }: { item: TestimonialItem; priority?: boolean }) {
  if (!item.imageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-jmv-blue to-jmv-ink">
        <span className="font-display text-6xl font-semibold text-white/90" aria-hidden>
          {initials(item.name)}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={portrait(item.imageUrl, 640)}
      srcSet={`${portrait(item.imageUrl, 400)} 400w, ${portrait(item.imageUrl, 640)} 640w, ${portrait(item.imageUrl, 900)} 900w`}
      sizes="(min-width: 1024px) 380px, (min-width: 640px) 320px, 72vw"
      alt=""
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

// Carrusel accesible (patrón WAI-ARIA): autoplay pausable con botón visible, se
// detiene con foco o puntero encima, no arranca con "reducir movimiento" y en el
// celular se puede deslizar con el dedo.
export default function TestimonialsSectionClient({
  testimonials,
  showInvite = true,
}: {
  testimonials: TestimonialItem[];
  /** Bloque final "¿Quieres ser parte de estas historias?" (en el inicio no hace falta) */
  showInvite?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [[currentIndex, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverOrFocus, setHoverOrFocus] = useState(false);

  const total = testimonials.length;
  const canAutoplay = total > 1 && !reduceMotion;
  const isPlaying = canAutoplay && !userPaused && !hoverOrFocus;

  useEffect(() => {
    setSlide([0, 0]);
  }, [total]);

  const goTo = useCallback(
    (index: number, dir?: number) =>
      setSlide(([prev]) => [(index + total) % total, dir ?? (index > prev ? 1 : -1)]),
    [total],
  );

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => goTo(currentIndex + 1, 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentIndex, goTo]);

  // Precarga la foto siguiente para que el cambio sea instantáneo
  useEffect(() => {
    const next = testimonials[(currentIndex + 1) % total];
    if (next?.imageUrl) {
      const img = new Image();
      img.src = portrait(next.imageUrl, 640);
    }
  }, [currentIndex, testimonials, total]);

  if (!total) return null;

  const item = testimonials[currentIndex];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 60 || Math.abs(info.offset.x) < Math.abs(info.offset.y)) return;
    goTo(currentIndex + (info.offset.x < 0 ? 1 : -1), info.offset.x < 0 ? 1 : -1);
  };

  const offset = reduceMotion ? 0 : 48;

  return (
    <section
      aria-labelledby="testimonios-titulo"
      className="relative overflow-hidden bg-gradient-to-b from-page via-section-blue to-page py-16 sm:py-24"
    >
      {/* Motivo de la Medalla, muy sutil, detrás del contenido */}
      <StarsRing className="pointer-events-none absolute -right-40 top-10 hidden h-[34rem] w-[34rem] text-accent-gold opacity-[0.07] lg:block" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="testimonios-titulo"
          eyebrow="Testimonios"
          title="Voces que transforman"
          description="Jóvenes y asesores que han encontrado en JMV un espacio para crecer en la fe, servir y hacer amigos para toda la vida."
        />

        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Testimonios de JMV"
          className="relative mt-10"
          onMouseEnter={() => setHoverOrFocus(true)}
          onMouseLeave={() => setHoverOrFocus(false)}
          onFocus={() => setHoverOrFocus(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHoverOrFocus(false);
          }}
        >
          <div aria-live={isPlaying ? "off" : "polite"} aria-atomic="true" className="relative">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.figure
                key={item.id}
                role="group"
                aria-roledescription="testimonio"
                aria-label={`${currentIndex + 1} de ${total}: ${item.name}`}
                custom={direction}
                initial={{ opacity: 0, x: direction * offset }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -offset }}
                transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag={total > 1 ? "x" : false}
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={onDragEnd}
                className="grid touch-pan-y items-center gap-8 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16"
              >
                {/* Retrato grande con marco dorado y un leve giro */}
                <div className="relative mx-auto w-[72%] max-w-[320px] md:w-full md:max-w-none">
                  <div
                    aria-hidden
                    className="absolute inset-0 translate-x-3 translate-y-3 rotate-3 rounded-[2rem] bg-gradient-to-br from-jmv-gold to-jmv-red opacity-80"
                  />
                  <motion.div
                    initial={reduceMotion ? false : { scale: 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface-2 shadow-card-lg ring-1 ring-black/5"
                  >
                    <Portrait item={item} priority={currentIndex === 0} />
                  </motion.div>
                  <span
                    aria-hidden
                    className="absolute -left-4 -top-6 font-display text-8xl leading-none text-accent-gold drop-shadow-sm sm:text-9xl"
                  >
                    “
                  </span>
                </div>

                <div className="text-center md:text-left">
                  <ReadMore lines={6} buttonClassName="mx-auto md:mx-0">
                    <blockquote className="font-display text-xl leading-relaxed text-fg sm:text-2xl lg:text-[1.9rem] lg:leading-snug">
                      <p className="whitespace-pre-line">{item.quote.replace(/\r?\n/g, " ")}</p>
                    </blockquote>
                  </ReadMore>

                  <figcaption className="mt-6 sm:mt-8">
                    <span aria-hidden className="mx-auto mb-4 block h-1 w-12 rounded-full bg-accent-gold md:mx-0" />
                    <p className="text-xl font-bold text-fg">{item.name}</p>
                    {item.role && <p className="mt-0.5 font-medium text-accent-gold">{item.role}</p>}
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-fg-subtle">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {item.location || "JMV Ecuador"}
                    </p>
                  </figcaption>
                </div>
              </motion.figure>
            </AnimatePresence>
          </div>

          {total > 1 && (
            <div className="mt-10 flex flex-col items-center gap-5 md:mt-12">
              {/* Navegación por caras: cada avatar lleva a su testimonio */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => goTo(currentIndex - 1, -1)}
                  aria-label="Testimonio anterior"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-card transition-colors hover:bg-surface-2 dark:border-transparent dark:bg-white/10 dark:hover:bg-white/20"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>

                <ul className="flex items-center gap-2 sm:gap-3">
                  {testimonials.map((t, index) => {
                    const active = index === currentIndex;
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => goTo(index)}
                          aria-label={`Ver testimonio ${index + 1} de ${total}: ${t.name}`}
                          aria-current={active ? "true" : undefined}
                          className={cn(
                            "relative block overflow-hidden rounded-full transition-all duration-300",
                            active
                              ? "h-14 w-14 ring-[3px] ring-accent-gold ring-offset-2 ring-offset-page"
                              : "h-11 w-11 opacity-75 hover:opacity-100",
                          )}
                        >
                          {t.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={portrait(t.imageUrl, 112, "1:1")}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-jmv-blue text-sm font-bold text-white" aria-hidden>
                              {initials(t.name)}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <button
                  type="button"
                  onClick={() => goTo(currentIndex + 1, 1)}
                  aria-label="Testimonio siguiente"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-card transition-colors hover:bg-surface-2 dark:border-transparent dark:bg-white/10 dark:hover:bg-white/20"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>

              {canAutoplay && (
                <div className="flex items-center gap-3">
                  {/* Barra de progreso hasta el siguiente testimonio */}
                  <div aria-hidden className="h-1 w-32 overflow-hidden rounded-full bg-fg/10 dark:bg-white/15">
                    <motion.div
                      key={`${currentIndex}-${isPlaying}`}
                      className="h-full rounded-full bg-accent-gold"
                      initial={{ width: "0%" }}
                      animate={{ width: isPlaying ? "100%" : "0%" }}
                      transition={{ duration: isPlaying ? AUTOPLAY_MS / 1000 : 0, ease: "linear" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setUserPaused((p) => !p)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg dark:hover:bg-white/10"
                  >
                    {userPaused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
                    {userPaused ? "Reanudar" : "Pausar"}
                    <span className="sr-only"> el carrusel de testimonios</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {showInvite && (
          <div className="mt-16 text-center">
            <h3 className="mb-3 text-2xl font-bold text-fg">¿Quieres ser parte de estas historias?</h3>
            <p className="mx-auto mb-6 max-w-2xl text-fg-muted">
              Escríbenos y te ayudamos a encontrar un grupo de JMV cerca de ti.
            </p>
            <Link href="/unete" className={buttonVariants({ variant: "gold" })}>
              Encuentra tu grupo
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
