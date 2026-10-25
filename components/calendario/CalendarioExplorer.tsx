"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CalendarDateItem, CalendarEntry } from "@/types/calendar";
import {
  CATEGORY_ORDER,
  MONTHS,
  datesToEntries,
  daysUntil,
  sortByUpcoming,
  todayInEcuador,
} from "@/lib/calendario";
import AddToCalendarMenu from "./AddToCalendarMenu";
import CategoryFilter from "./CategoryFilter";
import DateCard from "./DateCard";
import MobileMonths from "./MobileMonths";
import StarRing from "./StarRing";
import TodaySpotlight from "./TodaySpotlight";
import YearList from "./YearList";
import EmptyState from "./EmptyState";
import { entryToEvent, slugifyFile, type EntryCategory } from "./shared";

/** Primera entrada del mes que aún no pasó (o la primera del mes) */
function pickInMonth(entries: CalendarEntry[], month: number, now: Date) {
  const inMonth = entries.filter((e) => e.month === month).sort((a, b) => a.day - b.day);
  const t = todayInEcuador(now);
  return inMonth.find((e) => e.month !== t.month || e.day >= t.day) ?? inMonth[0] ?? null;
}

/** Mes con el que abre el anillo: el actual si tiene fechas; si no, el de la próxima */
function initialMonth(entries: CalendarEntry[], now: Date) {
  const current = todayInEcuador(now).month;
  if (entries.some((e) => e.month === current)) return current;
  const [next] = sortByUpcoming(entries.filter((e) => daysUntil(e.date, now) >= 0));
  return next?.month ?? current;
}

/**
 * Parte interactiva de /calendario: "Hoy / Se acerca", filtros, anillo (md+),
 * carrusel y línea de tiempo (móvil) y la lista de todo el año.
 * renderedAt es el "hoy" con el que se generó la página (ISR); tras montar se usa el real.
 */
export default function CalendarioExplorer({
  items,
  activities,
  renderedAt,
}: {
  items: CalendarDateItem[];
  activities: CalendarEntry[];
  renderedAt: string;
}) {
  const reduce = useReducedMotion();
  const [now, setNow] = useState(() => new Date(renderedAt));
  const [month, setMonth] = useState(() => {
    const at = new Date(renderedAt);
    return initialMonth([...datesToEntries(items, at), ...activities], at);
  });
  const [category, setCategory] = useState<EntryCategory | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    const real = new Date();
    setNow(real);
    setMonth(initialMonth([...datesToEntries(items, real), ...activities], real));
    // Solo al montar: después el mes lo elige la persona
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entries = useMemo(() => [...datesToEntries(items, now), ...activities], [items, activities, now]);
  const upcoming = useMemo(() => sortByUpcoming(entries.filter((e) => daysUntil(e.date, now) >= 0)), [entries, now]);
  const filtered = useMemo(
    () => (category ? entries.filter((e) => e.category === category) : entries),
    [entries, category],
  );

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((c) => entries.some((e) => e.category === c)),
    [entries],
  );
  const counts = useMemo(() => {
    const c: Partial<Record<EntryCategory, number>> = {};
    entries.forEach((e) => (c[e.category] = (c[e.category] ?? 0) + 1));
    return c;
  }, [entries]);

  // La fecha elegida siempre pertenece al mes y al filtro actuales
  const selected = useMemo(() => {
    const current = filtered.find((e) => e.key === selectedKey && e.month === month);
    return current ?? pickInMonth(filtered, month, now);
  }, [filtered, selectedKey, month, now]);

  // Siguiente mes con fechas (para no dejar al usuario en un mes vacío)
  const nextMonth = useMemo(() => {
    for (let i = 1; i <= 12; i++) {
      const m = ((month - 1 + i) % 12) + 1;
      if (filtered.some((e) => e.month === m)) return m === month ? null : m;
    }
    return null;
  }, [filtered, month]);

  const changeMonth = (m: number) => {
    setMonth(m);
    setSelectedKey(null);
  };

  if (entries.length === 0) return <EmptyState />;

  return (
    <>
      <div className="relative -mt-16 sm:-mt-20">
        <TodaySpotlight upcoming={upcoming} now={now} />
      </div>

      <section aria-labelledby="explora-title" className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">
            El anillo de las 12 estrellas
          </p>
          <h2 id="explora-title" className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            Explora el año
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
            Como en el reverso de la Medalla Milagrosa, cada estrella es un mes. Elige uno y descubre a quién
            celebramos.
          </p>
        </div>
        <div className="mt-6">
          <CategoryFilter categories={categories} value={category} onChange={setCategory} counts={counts} />
        </div>

        <div className="mt-10 hidden md:grid md:gap-10 lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] lg:items-center">
          <StarRing
            entries={filtered}
            month={month}
            onMonthChange={changeMonth}
            selectedKey={selected?.key ?? null}
            onSelect={setSelectedKey}
          />
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <AnimatePresence mode="wait" initial={false}>
              {selected ? (
                <motion.div
                  key={selected.key}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 32, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DateCard entry={selected} now={now} headingLevel="h3" />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <AddToCalendarMenu event={entryToEvent(selected)} filename={`${slugifyFile(selected.title)}.ics`} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`vacio-${month}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl border border-dashed border-white/15 p-8 text-center"
                >
                  <p className="font-display text-2xl text-white">{MONTHS[month - 1]} está en calma</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {category ? "No hay fechas de esta categoría este mes." : "Aún no tenemos fechas en este mes."}
                  </p>
                  {nextMonth && (
                    <button
                      type="button"
                      onClick={() => changeMonth(nextMonth)}
                      className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                    >
                      Ir a {MONTHS[nextMonth - 1].toLowerCase()}
                      <ArrowRight className="h-4 w-4 text-jmv-gold-text" aria-hidden />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 md:hidden">
          <MobileMonths entries={filtered} month={month} onMonthChange={changeMonth} now={now} nextMonth={nextMonth} />
        </div>
      </section>

      <section aria-labelledby="todo-el-anio" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">De enero a diciembre</p>
          <h2 id="todo-el-anio" className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Todo el año
          </h2>
        </div>
        <YearList entries={filtered} />
      </section>
    </>
  );
}
