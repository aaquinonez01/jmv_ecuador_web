"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEntry } from "@/types/calendar";
import { MONTHS } from "@/lib/calendario";
import { cn } from "@/lib/utils";
import { starPoints } from "@/components/brand/svg-props";
import DateCard from "./DateCard";
import { MONTHS_SHORT, categoryStyle } from "./shared";
import { useMonthRadio } from "./useMonthRadio";

const plural = (n: number) => (n === 0 ? "sin fechas" : n === 1 ? "1 fecha" : `${n} fechas`);

// Móvil: carrusel de meses con scroll-snap y línea de tiempo del mes elegido.
// Se puede deslizar la línea de tiempo a los lados para cambiar de mes.
export default function MobileMonths({
  entries,
  month,
  onMonthChange,
  now,
  nextMonth,
}: {
  entries: CalendarEntry[];
  month: number;
  onMonthChange: (month: number) => void;
  now: Date;
  nextMonth?: number | null;
}) {
  const reduce = useReducedMotion();
  const [direction, setDirection] = useState(0);
  const [announce, setAnnounce] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);

  const counts = useMemo(() => {
    const c = Array(12).fill(0) as number[];
    entries.forEach((e) => c[e.month - 1]++);
    return c;
  }, [entries]);
  const monthEntries = useMemo(
    () => entries.filter((e) => e.month === month).sort((a, b) => a.day - b.day || a.title.localeCompare(b.title)),
    [entries, month],
  );

  const change = (m: number) => {
    const next = ((m - 1 + 12) % 12) + 1;
    const diff = next - month;
    setDirection(diff === 0 ? 0 : (diff > 0 && diff < 6) || diff < -6 ? 1 : -1);
    onMonthChange(next);
    setAnnounce(`${MONTHS[next - 1]}: ${plural(counts[next - 1])}`);
  };
  const { radioProps } = useMonthRadio(month, change);

  // Mantiene visible el chip del mes elegido
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>(`[data-month="${month}"]`);
    const box = scroller.current;
    if (!el || !box) return;
    box.scrollTo({
      left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [month, reduce]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // Evita que soltar el dedo sobre una tarjeta la abra
    dragged.current = Math.abs(info.offset.x) > 8;
    if (Math.abs(info.offset.x) < 70 || Math.abs(info.offset.x) < Math.abs(info.offset.y)) return;
    change(info.offset.x < 0 ? month + 1 : month - 1);
  };

  return (
    <div>
      <div
        ref={scroller}
        role="radiogroup"
        aria-label="Meses del año"
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-4 px-4 pb-2 pt-1"
      >
        {MONTHS.map((name, i) => {
          const m = i + 1;
          const selected = m === month;
          return (
            <button
              key={m}
              type="button"
              data-month={m}
              {...radioProps(m)}
              aria-label={`${name}, ${plural(counts[i])}`}
              className={cn(
                "flex min-h-[4.75rem] w-[4.5rem] shrink-0 snap-center flex-col items-center justify-center gap-1 rounded-2xl border transition-colors",
                selected
                  ? "border-jmv-gold-text/70 bg-jmv-gold-text/15 text-white"
                  : "border-white/10 bg-white/[0.04] text-slate-200",
              )}
            >
              <svg
                viewBox="0 0 40 40"
                aria-hidden="true"
                className={cn(
                  "h-6 w-6",
                  selected ? "text-jmv-gold-text drop-shadow-[0_0_8px_rgba(245,184,61,0.8)]" : counts[i] ? "text-white/80" : "text-white/25",
                )}
              >
                <polygon points={starPoints(20, 21, 17)} fill="currentColor" />
              </svg>
              <span aria-hidden="true" className="text-xs font-semibold uppercase tracking-[0.12em]">
                {MONTHS_SHORT[i]}
              </span>
              <span aria-hidden="true" className={cn("text-[11px]", selected ? "text-jmv-gold-text" : "text-slate-300")}>
                {counts[i] || "–"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => change(month - 1)}
          aria-label={`Mes anterior: ${MONTHS[(month + 10) % 12]}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <div className="text-center">
          <h3 className="font-display text-3xl font-semibold text-white">{MONTHS[month - 1]}</h3>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">
            {plural(monthEntries.length)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => change(month + 1)}
          aria-label={`Mes siguiente: ${MONTHS[month % 12]}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>

      <div className="relative mt-6 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={month}
            custom={direction}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            onClickCapture={(e) => {
              if (dragged.current) {
                e.preventDefault();
                e.stopPropagation();
                dragged.current = false;
              }
            }}
            className="touch-pan-y"
          >
            {monthEntries.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 px-6 py-10 text-center">
                <p className="text-base text-slate-200">Aún no tenemos fechas en {MONTHS[month - 1].toLowerCase()}.</p>
                <p className="mt-1 text-sm text-slate-300">Desliza o usa las flechas para ver otro mes.</p>
                {nextMonth && (
                  <button
                    type="button"
                    onClick={() => change(nextMonth)}
                    className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white/10 px-5 text-sm font-semibold text-white"
                  >
                    Ir a {MONTHS[nextMonth - 1].toLowerCase()}
                  </button>
                )}
              </div>
            ) : (
              <ol className="relative space-y-5 pl-7">
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 left-[0.6rem] top-3 w-px bg-gradient-to-b from-jmv-gold-text/70 via-white/20 to-transparent"
                />
                {monthEntries.map((entry, i) => (
                  <motion.li
                    key={entry.key}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.06 * i + 0.08, duration: 0.4, ease: "easeOut" }}
                    style={categoryStyle(entry.category)}
                    className="relative"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-7 top-6 flex h-5 w-5 items-center justify-center rounded-full bg-jmv-ink ring-2 ring-(--cat)"
                    >
                      <span className="h-2 w-2 rounded-full bg-(--cat) shadow-[0_0_10px_var(--cat)]" />
                    </span>
                    <DateCard entry={entry} now={now} variant={entry.imageUrl ? "full" : "compact"} headingLevel="h4" />
                  </motion.li>
                ))}
              </ol>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
