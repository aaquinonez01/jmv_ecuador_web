"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SlotPhoto } from "@/lib/site-images";
import SiteImage from "./SiteImage";

interface HeroCarouselProps {
  /** Primera foto, ya renderizada en el servidor (con priority) */
  first: ReactNode;
  /** Resto de fotos: se montan solo cuando les toca (y la siguiente se precarga) */
  rest: readonly SlotPhoto[];
  /** Milisegundos entre fotos */
  interval: number;
  /** Nombre accesible del grupo de controles */
  label: string;
  sizes: string;
}

// Carrusel por fundido para cabeceras. Pausa: con el botón, al pasar el ratón o
// tener el foco dentro de la cabecera, mientras se toca la pantalla, si la
// cabecera no se ve o la pestaña está oculta. Con "reducir movimiento" no avanza solo.
export default function HeroCarousel({ first, rest, interval, label, sizes }: HeroCarouselProps) {
  const total = rest.length + 1;
  const [index, setIndex] = useState(0);
  // Fotos montadas: la actual y la siguiente (precarga). Las demás aún no se piden.
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  const [userPaused, setUserPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Movimiento reducido
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    setReady(true);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Precarga la siguiente cuando el navegador está libre (no compite con la primera foto)
  useEffect(() => {
    const next = (index + 1) % total;
    if (mounted.has(index) && mounted.has(next)) return;
    const add = () =>
      setMounted((prev) => {
        if (prev.has(index) && prev.has(next)) return prev;
        const copy = new Set(prev);
        copy.add(index);
        copy.add(next);
        return copy;
      });
    if (index === 0 && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(add, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    add();
  }, [index, total, mounted]);

  // Pausas automáticas: fuera de pantalla, pestaña oculta, ratón/foco o dedo encima
  useEffect(() => {
    const section = rootRef.current?.closest("section") ?? rootRef.current;
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(section);
    const onVisibility = () => setTabVisible(!document.hidden);
    const hold = () => setHeld(true);
    const release = () => setHeld(false);
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") hold();
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!section.contains(e.relatedTarget as Node | null)) release();
    };
    document.addEventListener("visibilitychange", onVisibility);
    section.addEventListener("pointerdown", onPointerDown);
    section.addEventListener("pointerup", release);
    section.addEventListener("pointercancel", release);
    section.addEventListener("mouseenter", hold);
    section.addEventListener("mouseleave", release);
    section.addEventListener("focusin", hold);
    section.addEventListener("focusout", onFocusOut);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointerdown", onPointerDown);
      section.removeEventListener("pointerup", release);
      section.removeEventListener("pointercancel", release);
      section.removeEventListener("mouseenter", hold);
      section.removeEventListener("mouseleave", release);
      section.removeEventListener("focusin", hold);
      section.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const playing = ready && !reduced && !userPaused && !held && inView && tabVisible;

  useEffect(() => {
    if (!playing) return;
    const next = (index + 1) % total;
    // No avanza hasta que la siguiente esté montada (precargada)
    if (!mounted.has(next)) return;
    const id = window.setTimeout(() => setIndex(next), interval);
    return () => window.clearTimeout(id);
  }, [playing, index, total, interval, mounted]);

  const goTo = useCallback((i: number) => {
    setMounted((prev) => {
      if (prev.has(i) && prev.has((i + 1) % total)) return prev;
      const copy = new Set(prev);
      copy.add(i);
      copy.add((i + 1) % total);
      return copy;
    });
    setIndex(i);
  }, [total]);

  const slides = [null, ...rest];

  return (
    <>
      <div ref={rootRef} className="absolute inset-0 -z-20">
        {slides.map((photo, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            {i === 0
              ? first
              : mounted.has(i) && photo && (
                  <SiteImage
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={sizes}
                    loading="lazy"
                    className="object-cover"
                    style={{ objectPosition: photo.position ?? "center" }}
                  />
                )}
          </div>
        ))}
      </div>

      <div
        role="group"
        aria-label={label}
        className="absolute bottom-1 right-1 z-10 flex items-center sm:bottom-3 sm:right-4"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Foto ${i + 1} de ${total}`}
            aria-current={i === index ? "true" : undefined}
            className="group flex h-11 w-7 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-[-4px]"
          >
            <span
              aria-hidden="true"
              className={cn(
                "block h-2 rounded-full shadow-[0_0_0_1px_rgb(15_23_42/0.35)] transition-all duration-300 motion-reduce:transition-none",
                i === index ? "w-5 bg-jmv-gold-text" : "w-2 bg-white/75 group-hover:bg-white",
              )}
            />
          </button>
        ))}
        {!reduced && (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Reanudar el paso de fotos" : "Pausar el paso de fotos"}
            className="ml-0.5 flex h-11 w-11 items-center justify-center rounded-full text-white/90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-4px]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-hero-veil/55 backdrop-blur-sm">
              {userPaused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
