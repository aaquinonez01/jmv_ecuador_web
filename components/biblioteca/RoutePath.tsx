"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Clock, Lock, Sparkles } from "lucide-react";
import { KIND_LABELS, TYPE_SINGULAR, libraryHref, progressPercent, readingTimeLabel } from "@/lib/biblioteca";
import { cn } from "@/lib/utils";
import BookCover from "./BookCover";
import KindIcon from "./KindIcon";
import ProgressRing from "./ProgressRing";
import ReadButton from "./ReadButton";
import { pageLabel, type LibraryCardDoc } from "./shared";
import { useRouteProgress } from "./CollectionCard";
import { useLibraryProgress } from "./useLibraryProgress";

/** Anillo con el porcentaje de la ruta para la cabecera */
export function RouteProgressSummary({ docs }: { docs: LibraryCardDoc[] }) {
  const { done, total, percent } = useRouteProgress(docs);
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.05] p-4 pr-6 backdrop-blur">
      <ProgressRing percent={percent} size={72} stroke={6} className="text-jmv-gold-text">
        <span aria-hidden="true" className="font-display text-xl font-semibold text-white">
          {percent}%
        </span>
      </ProgressRing>
      <p className="text-sm text-slate-200">
        <span className="block text-base font-semibold text-white">
          {done === total && total > 0 ? "¡Ruta completada!" : done > 0 ? "Vas muy bien" : "Tu camino empieza aquí"}
        </span>
        {done} de {total} {total === 1 ? "lectura terminada" : "lecturas terminadas"}
        <span className="sr-only"> ({percent} %)</span>
      </p>
    </div>
  );
}

/**
 * Camino de la ruta: línea vertical con un nodo por lectura. El nodo se rellena
 * cuando la lectura se terminó en este teléfono; la siguiente pendiente se destaca.
 */
export default function RoutePath({ docs }: { docs: LibraryCardDoc[] }) {
  const reduce = useReducedMotion();
  const all = useLibraryProgress();
  const nextIndex = all ? docs.findIndex((d) => !all[d.slug]?.finished) : -1;
  const next = nextIndex >= 0 ? docs[nextIndex] : null;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
      <ol className="relative">
        {docs.map((doc, i) => {
          const p = all?.[doc.slug] ?? null;
          const done = !!p?.finished;
          const current = i === nextIndex;
          const percent = progressPercent(p);
          const time = readingTimeLabel(doc.readingMinutes);
          const last = i === docs.length - 1;
          return (
            <motion.li
              key={doc.id}
              initial={reduce ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-4 pb-8 sm:gap-6"
            >
              {/* Línea y nodo */}
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[1.375rem] top-12 bottom-0 w-0.5 -translate-x-1/2 sm:left-7",
                    done ? "bg-jmv-gold-text" : "bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.25)_0_6px,transparent_6px_12px)]",
                  )}
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 font-display text-lg font-semibold sm:h-14 sm:w-14 sm:text-xl",
                  done
                    ? "border-jmv-gold-text bg-jmv-gold-text text-jmv-ink"
                    : current
                      ? "border-jmv-gold-text bg-jmv-ink text-jmv-gold-text shadow-[0_0_0_6px_rgba(245,184,61,0.18)]"
                      : "border-white/25 bg-jmv-ink text-slate-300",
                )}
              >
                {done ? <Check className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={3} /> : i + 1}
              </span>

              <Link
                href={libraryHref(doc.slug)}
                className={cn(
                  "group flex min-w-0 flex-1 gap-4 rounded-3xl border p-3 transition-colors sm:p-4",
                  current
                    ? "border-jmv-gold-text/50 bg-[linear-gradient(135deg,rgba(217,143,6,0.14),rgba(255,255,255,0.03))]"
                    : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]",
                )}
              >
                <div className="w-16 shrink-0 sm:w-20">
                  <BookCover doc={doc} sizes="80px" />
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    <span className="sr-only">Lectura {i + 1}: </span>
                    {TYPE_SINGULAR[doc.type]}
                    {current && <span className="ml-2 rounded-full bg-jmv-gold px-2 py-0.5 text-[10px] text-jmv-ink">Te toca</span>}
                  </p>
                  <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-white group-hover:text-jmv-gold-text sm:text-lg">
                    {doc.title}
                  </h3>
                  {doc.author && <p className="mt-0.5 truncate text-sm text-slate-300">{doc.author}</p>}
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <KindIcon kind={doc.kind} className="h-3.5 w-3.5 text-jmv-gold-text" />
                      {KIND_LABELS[doc.kind]}
                    </span>
                    {time && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-jmv-gold-text" aria-hidden />
                        {time}
                      </span>
                    )}
                    {doc.visibility === "miembros" && (
                      <span className="inline-flex items-center gap-1 text-jmv-gold-text">
                        <Lock className="h-3.5 w-3.5" aria-hidden />
                        Solo miembros
                      </span>
                    )}
                    {done ? (
                      <span className="inline-flex items-center gap-1 text-emerald-300">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        Terminada
                      </span>
                    ) : (
                      p &&
                      p.page > 1 && (
                        <span className="text-jmv-gold-text">
                          {pageLabel(p.page, p.pageCount || doc.pageCount)} · {percent} %
                        </span>
                      )
                    )}
                  </p>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ol>

      <aside aria-labelledby="siguiente-title" className="order-first lg:sticky lg:top-28 lg:order-none lg:self-start">
        <div className="relative overflow-hidden rounded-[2rem] border border-jmv-gold-text/30 bg-[linear-gradient(160deg,#1d4e8a_0%,#0d1830_75%)] p-6">
          <h2 id="siguiente-title" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">
            <Sparkles className="h-4 w-4" aria-hidden />
            {next ? "Siguiente lectura" : all ? "¡Terminaste la ruta!" : "Siguiente lectura"}
          </h2>
          {next ? (
            <>
              <div className="mt-5 flex gap-4">
                <div className="w-24 shrink-0">
                  <BookCover doc={next} sizes="96px" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-300">
                    Lectura {nextIndex + 1} de {docs.length}
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold leading-tight text-white">{next.title}</p>
                  {next.author && <p className="mt-1 truncate text-sm text-slate-300">{next.author}</p>}
                </div>
              </div>
              <ReadButton doc={next} size="md" className="mt-6 w-full" />
              <Link
                href={libraryHref(next.slug)}
                className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-white hover:bg-white/10"
              >
                Ver la ficha
                <span className="sr-only">: {next.title}</span>
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </>
          ) : all ? (
            <p className="mt-4 text-slate-200">
              Leíste todas las lecturas de esta ruta. ¡Qué bien! Compártela con tu grupo o elige otra ruta en la biblioteca.
            </p>
          ) : (
            <div aria-hidden="true" className="mt-5 h-36 animate-pulse rounded-2xl bg-white/[0.06]" />
          )}
        </div>
      </aside>
    </div>
  );
}
