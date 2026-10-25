"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CalendarEntry } from "@/types/calendar";
import { MONTHS, dayLabel } from "@/lib/calendario";
import { cn } from "@/lib/utils";
import AddToCalendarMenu from "./AddToCalendarMenu";
import DateCard from "./DateCard";
import StarRing from "./StarRing";
import { CAT_VARS, categoryStyle, entryToEvent, slugifyFile } from "./shared";

// Móvil: el mismo anillo de las 12 estrellas (se gira con el dedo) y debajo las
// fechas del mes en un carrusel que se desliza a los lados, sincronizado con el
// punto que brilla en el anillo.
export default function MobileRing({
  entries,
  month,
  onMonthChange,
  selectedKey,
  onSelect,
  now,
  nextMonth,
}: {
  entries: CalendarEntry[];
  month: number;
  onMonthChange: (month: number) => void;
  selectedKey: string | null;
  onSelect: (key: string) => void;
  now: Date;
  nextMonth?: number | null;
}) {
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLUListElement>(null);
  // Evita que el scroll programático vuelva a elegir otra tarjeta mientras se mueve
  const programmatic = useRef(false);

  const monthEntries = useMemo(
    () => entries.filter((e) => e.month === month).sort((a, b) => a.day - b.day || a.title.localeCompare(b.title)),
    [entries, month],
  );
  const selected = monthEntries.find((e) => e.key === selectedKey) ?? monthEntries[0] ?? null;

  // Lleva al centro la tarjeta elegida (al tocar un punto del anillo o cambiar de mes)
  useEffect(() => {
    const box = scroller.current;
    const el = selected ? box?.querySelector<HTMLElement>(`[data-key="${CSS.escape(selected.key)}"]`) : null;
    if (!box || !el) return;
    const left = el.offsetLeft - (box.clientWidth - el.clientWidth) / 2;
    if (Math.abs(box.scrollLeft - left) < 4) return;
    programmatic.current = true;
    box.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
    const t = window.setTimeout(() => (programmatic.current = false), reduce ? 50 : 600);
    return () => window.clearTimeout(t);
  }, [selected, reduce]);

  // Al deslizar el carrusel, la tarjeta centrada pasa a ser la elegida
  useEffect(() => {
    const box = scroller.current;
    if (!box || monthEntries.length < 2) return;
    const io = new IntersectionObserver(
      (records) => {
        if (programmatic.current) return;
        const visible = records.filter((r) => r.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const key = (visible?.target as HTMLElement | undefined)?.dataset.key;
        if (key && key !== selectedKey) onSelect(key);
      },
      { root: box, threshold: 0.75 },
    );
    box.querySelectorAll("[data-key]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [monthEntries, selectedKey, onSelect]);

  return (
    <div>
      <StarRing
        compact
        entries={entries}
        month={month}
        onMonthChange={onMonthChange}
        selectedKey={selected?.key ?? null}
        onSelect={onSelect}
      />

      {/* Sin AnimatePresence: el carrusel nuevo tiene que existir al instante para sincronizarse */}
      <motion.div
          key={month}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-6"
        >
          {monthEntries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-fg/15 px-6 py-8 text-center">
              <p className="font-display text-2xl text-fg">{MONTHS[month - 1]} está en calma</p>
              <p className="mt-1 text-sm text-fg-muted">Gira el anillo para ver otro mes.</p>
              {nextMonth && (
                <button
                  type="button"
                  onClick={() => onMonthChange(nextMonth)}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-jmv-blue/10 px-5 text-sm font-semibold text-fg dark:bg-white/10"
                >
                  Ir a {MONTHS[nextMonth - 1].toLowerCase()}
                  <ArrowRight className="h-4 w-4 text-accent-gold" aria-hidden />
                </button>
              )}
            </div>
          ) : (
            <>
              <ul
                ref={scroller}
                aria-label={`Fechas de ${MONTHS[month - 1].toLowerCase()}`}
                className={cn(
                  "scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1",
                  monthEntries.length === 1 && "justify-center",
                )}
              >
                {monthEntries.map((entry) => (
                  <li
                    key={entry.key}
                    data-key={entry.key}
                    style={categoryStyle(entry.category)}
                    className={cn(
                      CAT_VARS,
                      "shrink-0 snap-center transition-[opacity,transform] duration-300",
                      monthEntries.length === 1 ? "w-full" : "w-[86%]",
                      selected && entry.key !== selected.key && "opacity-60 motion-safe:scale-[0.97]",
                    )}
                  >
                    <DateCard entry={entry} now={now} variant={entry.imageUrl ? "full" : "compact"} headingLevel="h3" />
                  </li>
                ))}
              </ul>

              {monthEntries.length > 1 && (
                <div className="mt-3 flex justify-center gap-1" aria-label="Elegir fecha del mes">
                  {monthEntries.map((entry) => {
                    const active = entry.key === selected?.key;
                    return (
                      <button
                        key={entry.key}
                        type="button"
                        onClick={() => onSelect(entry.key)}
                        aria-label={`${dayLabel(entry.month, entry.day)}: ${entry.title}`}
                        aria-current={active ? "true" : undefined}
                        style={categoryStyle(entry.category)}
                        className={cn(CAT_VARS, "flex h-8 min-w-8 items-center justify-center")}
                      >
                        <span
                          className={cn(
                            "block h-2 rounded-full transition-all duration-300",
                            active ? "w-6 bg-(--cat)" : "w-2 bg-fg/30",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {selected && (
                <div className="mt-4 flex justify-center">
                  <AddToCalendarMenu event={entryToEvent(selected)} filename={`${slugifyFile(selected.title)}.ics`} />
                </div>
              )}
            </>
          )}
      </motion.div>
    </div>
  );
}
