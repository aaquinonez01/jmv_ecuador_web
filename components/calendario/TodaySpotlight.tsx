"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { CalendarEntry } from "@/types/calendar";
import { dayLabel, daysUntil } from "@/lib/calendario";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import AddToCalendarMenu from "./AddToCalendarMenu";
import AnimatedNumber from "./AnimatedNumber";
import CategoryChip, { UnverifiedTag } from "./CategoryChip";
import DateVisual from "./DateVisual";
import { categoryStyle, entryAccessibleName, entryToEvent, slugifyFile } from "./shared";

/**
 * "Hoy celebramos…" o, si hoy no hay fiesta, la próxima fecha con cuenta regresiva.
 * Recibe las entradas ya ordenadas por cercanía y el "hoy" calculado en el cliente.
 */
export default function TodaySpotlight({ upcoming, now }: { upcoming: CalendarEntry[]; now: Date }) {
  const reduce = useReducedMotion();
  if (upcoming.length === 0) return null;

  const first = upcoming[0];
  const days = Math.max(0, daysUntil(first.date, now));
  const isToday = days === 0;
  const todays = isToday ? upcoming.filter((e) => daysUntil(e.date, now) === 0) : [first];
  const main = todays[0];
  const others = upcoming.filter((e) => !todays.includes(e)).slice(0, 2);
  const titleId = "spotlight-title";

  return (
    <section aria-labelledby={titleId} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={categoryStyle(main.category)}
        className={cn(
          "relative isolate overflow-hidden rounded-[2rem] border bg-[#0d1a33] shadow-2xl shadow-black/40",
          isToday ? "border-jmv-gold-text/60" : "border-(--cat)/35",
        )}
      >
        {/* Halo de la categoría; si es hoy, respira muy suave (solo motion-safe) */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-(--cat) opacity-20 blur-3xl",
            isToday && "bg-jmv-gold-text opacity-30 motion-safe:animate-pulse",
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]">
          <div className="flex min-w-0 flex-col p-6 sm:p-8 lg:p-10">
            <p
              id={titleId}
              className={cn(
                "mb-4 inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                isToday ? "bg-jmv-gold text-jmv-ink" : "bg-white/10 text-jmv-gold-text",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {isToday ? "Hoy celebramos" : "Se acerca"}
            </p>

            <div className="flex items-end gap-5">
              {isToday ? (
                <p className="flex items-end gap-3 leading-none" aria-hidden="true">
                  <span className="font-display text-6xl font-semibold text-white sm:text-7xl">¡Hoy!</span>
                  <span className="pb-2 text-lg font-semibold text-jmv-gold-text">{dayLabel(main.month, main.day)}</span>
                </p>
              ) : (
                <p className="flex items-end gap-3 leading-none">
                  <span className="sr-only">Faltan {days} días</span>
                  <span aria-hidden="true">
                    <AnimatedNumber
                      value={days}
                      className="font-display text-7xl font-semibold tabular-nums text-white sm:text-8xl"
                    />
                  </span>
                  <span aria-hidden="true" className="pb-2 text-lg font-semibold text-(--cat) sm:text-xl">
                    {days === 1 ? "día" : "días"}
                    <span className="block text-sm font-medium text-slate-300">para el {dayLabel(main.month, main.day)}</span>
                  </span>
                </p>
              )}
            </div>

            <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-white text-balance sm:text-4xl">
              <span className="sr-only">{entryAccessibleName(main)}. </span>
              <span aria-hidden="true">{main.title}</span>
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <CategoryChip category={main.category} />
              {!main.verified && <UnverifiedTag />}
            </div>
            {main.summary && <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200">{main.summary}</p>}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={main.href} className={buttonVariants({ variant: "gold", size: "md" })}>
                {main.kind === "actividad" ? "Ver actividad" : "Ver historia"}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                <span className="sr-only"> de {main.title}</span>
              </Link>
              <AddToCalendarMenu event={entryToEvent(main)} filename={`${slugifyFile(main.title)}.ics`} />
            </div>

            {(todays.length > 1 || others.length > 0) && (
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {todays.length > 1 ? "También hoy" : "Luego vienen"}
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(todays.length > 1 ? todays.slice(1, 3) : others).map((e) => (
                    <li key={e.key} style={categoryStyle(e.category)} className="min-w-0">
                      <Link
                        href={e.href}
                        className="flex min-h-11 items-center gap-3 rounded-xl px-2 py-1.5 text-sm text-white transition-colors hover:bg-white/5"
                      >
                        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-(--cat) shadow-[0_0_10px_var(--cat)]" />
                        <span className="shrink-0 whitespace-nowrap font-semibold tabular-nums text-(--cat)">{dayLabel(e.month, e.day)}</span>
                        <span className="min-w-0 truncate">{e.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DateVisual
            imageUrl={main.imageUrl}
            category={main.category}
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="order-first aspect-[2/1] sm:aspect-[16/9] md:order-none md:aspect-auto md:min-h-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
