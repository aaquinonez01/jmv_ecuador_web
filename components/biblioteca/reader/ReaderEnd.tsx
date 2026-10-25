"use client";

import { forwardRef, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, RotateCcw, Share2 } from "lucide-react";
import { StarsRing } from "@/components/brand";
import { libraryHref } from "@/lib/biblioteca";

const ghostButton =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-white/20 px-3 py-2.5 font-semibold text-white hover:bg-white/10";

export type NextReading = { slug: string; title: string; collectionTitle: string };

type Props = {
  title: string;
  celebrate: boolean;
  next?: NextReading | null;
  onShare: () => void;
  onRestart: () => void;
};

const COLORS = ["#F5B83D", "#D98F06", "#2563eb", "#D3302F", "#ffffff", "#93c5fd"];

function Confetti() {
  // Valores fijos (no aleatorios) para que cada render dé lo mismo
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        x: `${(i * 37) % 100}%`,
        c: COLORS[i % COLORS.length],
        s: `${6 + (i % 4) * 2}px`,
        d: `${2.2 + ((i * 7) % 10) / 10}s`,
        delay: `${((i * 13) % 10) / 20}s`,
        dx: `${((i * 29) % 80) - 40}px`,
        r: `${((i * 53) % 2 ? 1 : -1) * (240 + ((i * 31) % 300))}deg`,
      })),
    [],
  );
  return (
    <div aria-hidden="true" className="jmv-reader-confetti pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden">
      {pieces.map((p, i) => (
        <i
          key={i}
          style={
            {
              "--x": p.x,
              "--c": p.c,
              "--s": p.s,
              "--d": p.d,
              "--delay": p.delay,
              "--dx": p.dx,
              "--r": p.r,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

const ReaderEnd = forwardRef<HTMLElement, Props>(function ReaderEnd({ title, celebrate, next, onShare, onRestart }, ref) {
  return (
    <section
      ref={ref}
      aria-labelledby="lector-fin"
      className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl bg-[#0b1224] px-6 pb-8 pt-10 text-center text-slate-100 shadow-2xl ring-1 ring-white/10 sm:px-10"
      style={{ ["--focus-ring" as string]: "var(--jmv-gold-text)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(29_78_138/0.7),transparent_70%)]"
      />
      {celebrate && <Confetti />}
      <div className="relative">
        <div className="relative mx-auto mb-5 flex size-24 items-center justify-center">
          <StarsRing className="absolute inset-0 text-jmv-gold-text motion-safe:animate-[spin_24s_linear_infinite]" />
          <BookOpen className="size-9 text-jmv-gold-text" aria-hidden="true" />
        </div>
        <h2 id="lector-fin" tabIndex={-1} className="outline-none font-display text-3xl font-semibold sm:text-4xl">
          ¡Terminaste! <span aria-hidden="true">🎉</span>
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-pretty text-slate-300">
          Llegaste al final de <span className="font-semibold text-white">«{title}»</span>. Lo que lees hoy también se vuelve
          servicio: compártelo con tu comunidad.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          {next && (
            <Link
              href={libraryHref(next.slug)}
              className="group flex min-h-14 items-center gap-3 rounded-2xl bg-jmv-gold px-5 py-3 text-left text-jmv-ink shadow-lg hover:bg-jmv-gold-text"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-wide opacity-80">
                  Siguiente lectura · {next.collectionTitle}
                </span>
                <span className="block truncate font-semibold">{next.title}</span>
              </span>
              <ArrowRight className="size-5 shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/biblioteca"
              className={ghostButton}
            >
              <BookOpen className="size-5" aria-hidden="true" />
              Volver a la biblioteca
            </Link>
            <button type="button" onClick={onShare} className={ghostButton}>
              <Share2 className="size-5" aria-hidden="true" />
              Compartir
            </button>
          </div>
          <button
            type="button"
            onClick={onRestart}
            className="mx-auto inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Leer de nuevo desde el inicio
          </button>
        </div>
      </div>
    </section>
  );
});

export default ReaderEnd;
