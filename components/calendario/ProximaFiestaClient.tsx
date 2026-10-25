"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StarsRing from "@/components/brand/StarsRing";
import { buttonVariants } from "@/components/ui/button-variants";
import { CATEGORY_META, MONTHS, calendarHref, dayLabel } from "@/lib/calendario";
import { pickProximaFiesta, type FiestaCandidate, type ProximaFiestaInfo } from "./proxima-fiesta";

function eyebrow(days: number) {
  if (days === 0) return "Hoy celebramos";
  if (days === 1) return "Mañana celebramos";
  return `Se acerca · faltan ${days} días`;
}

// El HTML llega del servidor (ISR) y puede ser de ayer: tras montar se recalcula
// con la fecha del dispositivo para no mostrar una cuenta vieja.
export default function ProximaFiestaClient({
  initial,
  candidates,
}: {
  initial: ProximaFiestaInfo | null;
  candidates: FiestaCandidate[];
}) {
  const [fiesta, setFiesta] = useState(initial);

  useEffect(() => {
    const current = pickProximaFiesta(candidates);
    setFiesta((prev) =>
      prev?.slug === current?.slug && prev?.days === current?.days ? prev : current
    );
  }, [candidates]);

  if (!fiesta) return null;

  const meta = CATEGORY_META[fiesta.category];
  const isToday = fiesta.days === 0;

  return (
    <section
      aria-labelledby="proxima-fiesta"
      className="relative overflow-hidden border-y border-line bg-gradient-to-r from-page via-section-blue to-page text-fg dark:via-[#132f57]"
    >
      <StarsRing
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 hidden h-44 w-44 -translate-y-1/2 text-accent-gold/15 motion-safe:animate-[spin_120s_linear_infinite] sm:block"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:pl-24 md:pl-28">
          <div
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-line-card bg-surface-card shadow-card"
            aria-hidden
          >
            <span className="font-display text-2xl font-semibold leading-none">{fiesta.day}</span>
            {/* Claro: el color de la categoría se oscurece (40 % con --fg) para llegar a AA */}
            <span
              className="mt-1 text-[11px] font-semibold uppercase tracking-wider [--cat-mix:40%] dark:[--cat-mix:100%]"
              style={{ color: `color-mix(in oklab, ${meta.color} var(--cat-mix), var(--fg))` }}
            >
              {MONTHS[fiesta.month - 1].slice(0, 3)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-accent-gold" aria-live="polite">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${isToday ? "motion-safe:animate-pulse" : ""}`}
                style={{ background: meta.color }}
                aria-hidden
              />
              {eyebrow(fiesta.days)}
            </p>
            <h2 id="proxima-fiesta" className="mt-0.5 font-display text-xl font-semibold leading-snug sm:text-2xl">
              <Link
                href={calendarHref(fiesta.slug)}
                className="rounded-sm hover:underline hover:decoration-accent-gold hover:underline-offset-4"
              >
                {fiesta.title}
              </Link>
            </h2>
            <p className="mt-0.5 text-sm text-fg-muted">
              {dayLabel(fiesta.month, fiesta.day)} · {meta.label}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={calendarHref(fiesta.slug)}
            className={buttonVariants({ variant: "gold", size: "sm", className: "rounded-full" })}
          >
            {isToday ? "Vívelo hoy" : "Ver la fecha"}
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
            <span className="sr-only">: {fiesta.title}</span>
          </Link>
          <Link
            href="/calendario"
            className={buttonVariants({ variant: "outlineAuto", size: "sm", className: "rounded-full" })}
          >
            Ver el Año Vicenciano
          </Link>
        </div>
      </div>
    </section>
  );
}
