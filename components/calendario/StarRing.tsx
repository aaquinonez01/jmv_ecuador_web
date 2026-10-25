"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEntry } from "@/types/calendar";
import { CATEGORY_META, MONTHS, dayLabel } from "@/lib/calendario";
import { cn } from "@/lib/utils";
import { starPoints } from "@/components/brand/svg-props";
import { MONTHS_SHORT, MONTH_DAYS, categoryStyle, entryAccessibleName } from "./shared";
import { useMonthRadio } from "./useMonthRadio";

// El anillo de las 12 estrellas del reverso de la Medalla: una estrella por mes.
// Geometría en un lienzo de 1000×1000; 0° arriba y sentido horario.
const C = 500;
const STAR_R = 0.43; // radio de las estrellas (fracción del ancho)
const LABEL_R = 487;
const TRACK_R = 350;
const LANE = 34;

// Redondeado: Math.sin del servidor y del navegador difieren en los últimos decimales
// y eso rompería la hidratación.
const round = (n: number) => Math.round(n * 100) / 100;
const polar = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: round(C + r * Math.sin(a)), y: round(C - r * Math.cos(a)) };
};

function arcPath(from: number, to: number, r: number) {
  const a = polar(from, r);
  const b = polar(to, r);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

const monthAngle = (m: number) => (m - 1) * 30;
const dayAngle = (m: number, d: number) => monthAngle(m) - 15 + (30 * (d - 0.5)) / MONTH_DAYS[m - 1];

const TICKS = Array.from({ length: 12 }, (_, i) =>
  Array.from({ length: MONTH_DAYS[i] }, (_, d) => {
    const deg = dayAngle(i + 1, d + 1);
    const long = (d + 1) % 5 === 0;
    const a = polar(deg, TRACK_R + 26);
    const b = polar(deg, TRACK_R + (long ? 42 : 34));
    return { m: i + 1, a, b, long };
  }),
).flat();

interface Dot {
  entry: CalendarEntry;
  deg: number;
  r: number;
}

/** Puntos por fecha; si dos caen muy juntos se apilan hacia dentro */
function layoutDots(entries: CalendarEntry[], scale = 1): Dot[] {
  const sorted = [...entries].sort((a, b) => a.month - b.month || a.day - b.day);
  let prev = -99;
  let lane = 0;
  return sorted.map((entry) => {
    const deg = dayAngle(entry.month, entry.day);
    lane = deg - prev < 4.5 * scale ? Math.min(lane + 1, 2) : 0;
    prev = deg;
    return { entry, deg, r: TRACK_R - lane * LANE * scale };
  });
}

export interface StarRingProps {
  entries: CalendarEntry[];
  month: number;
  onMonthChange: (month: number) => void;
  selectedKey: string | null;
  onSelect: (key: string) => void;
  /**
   * Móvil: el centro solo muestra el mes (la lista va debajo, en un carrusel),
   * los puntos son más grandes y el anillo se gira deslizando el dedo.
   */
  compact?: boolean;
}

// Grados que gira el anillo por cada píxel que se desliza el dedo
const DEG_PER_PX = 0.32;

export default function StarRing({ entries, month, onMonthChange, selectedKey, onSelect, compact = false }: StarRingProps) {
  const reduce = useReducedMotion();
  const dotScale = compact ? 1.7 : 1;
  const panned = useRef(false);
  const [active, setActive] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const { radioProps } = useMonthRadio(month, (m) => {
    onMonthChange(m);
    const n = entries.filter((e) => e.month === m).length;
    setAnnounce(`${MONTHS[m - 1]}: ${n === 0 ? "sin fechas" : n === 1 ? "1 fecha" : `${n} fechas`}`);
  });

  // Giro acumulado por el camino más corto, para que diciembre → enero no dé la vuelta entera
  const target = useRef(-monthAngle(month));
  const rot = useMotionValue(target.current);
  const counter = useTransform(rot, (r) => -r);
  useEffect(() => {
    const goal = -monthAngle(month);
    let delta = (goal - target.current) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    target.current += delta;
    if (reduce) {
      rot.jump(target.current);
      return;
    }
    const controls = animate(rot, target.current, { type: "spring", stiffness: 60, damping: 16, mass: 1 });
    return () => controls.stop();
  }, [month, reduce, rot]);

  const dots = useMemo(() => layoutDots(entries, dotScale), [entries, dotScale]);
  const counts = useMemo(() => {
    const c = Array(12).fill(0) as number[];
    entries.forEach((e) => c[e.month - 1]++);
    return c;
  }, [entries]);
  const monthEntries = useMemo(
    () => entries.filter((e) => e.month === month).sort((a, b) => a.day - b.day),
    [entries, month],
  );

  const activeDot = dots.find((d) => d.entry.key === active);
  const tooltipPos = activeDot ? polar(activeDot.deg + target.current, activeDot.r) : null;

  const go = (m: number) => {
    const next = ((m - 1 + 12) % 12) + 1;
    radioProps(next).onClick();
  };

  // Giro con el dedo (solo en compact): el anillo sigue al dedo y al soltar se
  // acomoda en el mes más cercano. touch-action pan-y deja el scroll vertical.
  const onPanStart = () => {
    panned.current = true;
    rot.stop();
  };
  const onPan = (_: PointerEvent, info: PanInfo) => {
    rot.set(target.current + info.offset.x * DEG_PER_PX);
  };
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    const projected = info.offset.x + (reduce ? 0 : info.velocity.x * 0.12);
    const steps = Math.round((projected * DEG_PER_PX) / 30);
    if (steps === 0) {
      if (reduce) rot.jump(target.current);
      else animate(rot, target.current, { type: "spring", stiffness: 120, damping: 18 });
    } else {
      go(month - steps);
    }
    // El click que llega al soltar no debe elegir una estrella
    window.setTimeout(() => (panned.current = false), 0);
  };

  return (
    <motion.div
      className={cn(
        "relative mx-auto aspect-square w-full select-none",
        compact ? "w-[90%] max-w-[440px] touch-pan-y" : "max-w-[600px]",
      )}
      onPanStart={compact ? onPanStart : undefined}
      onPan={compact ? onPan : undefined}
      onPanEnd={compact ? onPanEnd : undefined}
      onClickCapture={(e) => {
        if (panned.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {/* Resplandor de fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(29,78,138,0.55)_0%,rgba(15,23,42,0)_70%)]"
      />

      <motion.div className="absolute inset-0" style={{ rotate: rot }}>
        <svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="cal-arc-gold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F5B83D" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FFD36E" />
              <stop offset="100%" stopColor="#F5B83D" stopOpacity="0.2" />
            </linearGradient>
            <filter id="cal-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <circle cx={C} cy={C} r={STAR_R * 1000} fill="none" stroke="#F5B83D" strokeOpacity="0.14" strokeWidth="1.5" />
          <circle cx={C} cy={C} r={TRACK_R - 70} fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="1" />

          {TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.a.x}
              y1={t.a.y}
              x2={t.b.x}
              y2={t.b.y}
              stroke={t.m === month ? "#FFD36E" : "#fff"}
              strokeOpacity={t.m === month ? (t.long ? 0.9 : 0.55) : t.long ? 0.22 : 0.1}
              strokeWidth={t.long ? 2 : 1.2}
            />
          ))}

          {Array.from({ length: 12 }, (_, i) => {
            const m = i + 1;
            const selected = m === month;
            const d = arcPath(monthAngle(m) - 13.5, monthAngle(m) + 13.5, TRACK_R);
            return (
              <g key={m}>
                {selected && <path d={d} stroke="#F5B83D" strokeWidth="18" strokeOpacity="0.35" fill="none" filter="url(#cal-glow)" />}
                <path
                  d={d}
                  fill="none"
                  strokeLinecap="round"
                  stroke={selected ? "#F5B83D" : "#fff"}
                  strokeOpacity={selected ? 1 : 0.14}
                  strokeWidth={selected ? 5 : 3}
                  className="transition-[stroke-opacity] duration-300"
                />
              </g>
            );
          })}

          {dots.map(({ entry, deg, r }) => {
            const p = polar(deg, r);
            const color = CATEGORY_META[entry.category].color;
            const isActive = entry.key === active || entry.key === selectedKey;
            const dim = entry.month !== month;
            return (
              <g
                key={entry.key}
                className="cursor-pointer"
                opacity={dim ? 0.55 : 1}
                onPointerEnter={() => setActive(entry.key)}
                onPointerLeave={() => setActive((k) => (k === entry.key ? null : k))}
                onClick={() => {
                  if (entry.month !== month) onMonthChange(entry.month);
                  onSelect(entry.key);
                }}
              >
                {/* Área de toque generosa; el botón accesible equivalente está en el centro del anillo */}
                <circle cx={p.x} cy={p.y} r={22 * dotScale} fill="transparent" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={(isActive ? 28 : 19) * dotScale}
                  fill={color}
                  opacity={isActive ? 0.4 : 0.2}
                  className="transition-all duration-300"
                />
                <circle cx={p.x} cy={p.y} r={(isActive ? 13 : 9.5) * dotScale} fill={color} className="transition-all duration-300" />
                {entry.key === selectedKey && (
                  <circle cx={p.x} cy={p.y} r={17 * dotScale} fill="none" stroke="#fff" strokeWidth={2.5 * dotScale} />
                )}
              </g>
            );
          })}
        </svg>

        <div role="radiogroup" aria-label="Meses del año" className="absolute inset-0">
          {Array.from({ length: 12 }, (_, i) => {
            const m = i + 1;
            const selected = m === month;
            const p = polar(monthAngle(m), STAR_R * 1000);
            const n = counts[i];
            return (
              <motion.button
                key={m}
                type="button"
                {...radioProps(m)}
                aria-label={`${MONTHS[i]}, ${n === 0 ? "sin fechas" : n === 1 ? "1 fecha" : `${n} fechas`}`}
                className="group absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full focus-visible:outline-offset-0"
                style={{ left: `${p.x / 10}%`, top: `${p.y / 10}%`, rotate: counter }}
              >
                <motion.svg
                  viewBox="0 0 40 40"
                  aria-hidden="true"
                  className={cn(
                    "h-8 w-8 transition-[filter,color] duration-300",
                    selected
                      ? "text-jmv-gold-text drop-shadow-[0_0_10px_rgba(245,184,61,0.9)]"
                      : n > 0
                        ? "text-white/80 group-hover:text-white"
                        : "text-white/30 group-hover:text-white/60",
                  )}
                  animate={{ scale: selected ? 1.55 : 1 }}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
                >
                  <polygon points={starPoints(20, 21, 17)} fill="currentColor" />
                </motion.svg>
              </motion.button>
            );
          })}
        </div>

        {/* Abreviaturas de los meses hacia fuera del anillo, siempre derechas */}
        {MONTHS_SHORT.map((label, i) => {
          const p = polar(monthAngle(i + 1), LABEL_R);
          return (
            <motion.span
              key={label}
              aria-hidden="true"
              style={{ left: `${p.x / 10}%`, top: `${p.y / 10}%`, rotate: counter }}
              className={cn(
                "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                i + 1 === month ? "text-jmv-gold-text" : "text-slate-300",
              )}
            >
              {label}
            </motion.span>
          );
        })}
      </motion.div>

      {/* Centro: el mes y sus fechas (no gira) */}
      <div className="absolute left-1/2 top-1/2 flex h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_30%,#183865_0%,#0d1a33_75%)] px-[7%] text-center shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={month}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex w-full flex-col items-center"
          >
            <h3
              className={cn(
                "font-display font-semibold text-white",
                compact ? "text-[clamp(1.5rem,7.5vw,2.25rem)] leading-tight" : "text-3xl lg:text-4xl",
              )}
            >
              {MONTHS[month - 1]}
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">
              {monthEntries.length === 0
                ? "Sin fechas"
                : monthEntries.length === 1
                  ? "1 fecha"
                  : `${monthEntries.length} fechas`}
            </p>
            {compact ? (
              <>
                {/* Días del mes como pequeñas medallas; la lista completa va en el carrusel de abajo */}
                {monthEntries.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap justify-center gap-1.5" aria-hidden="true">
                    {monthEntries.slice(0, 5).map((e) => (
                      <span
                        key={e.key}
                        style={categoryStyle(e.category)}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full bg-(--cat-soft) font-display text-xs font-semibold text-(--cat) ring-1 ring-(--cat)/40 transition-transform",
                          e.key === selectedKey && "scale-110 ring-2 ring-white",
                        )}
                      >
                        {e.day}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2.5 text-[11px] leading-snug text-slate-300">Desliza para girar</p>
              </>
            ) : monthEntries.length > 0 ? (
              <ul
                className={cn(
                  "mt-3 max-h-[9rem] w-full space-y-1 overflow-y-auto overscroll-contain lg:max-h-[10.25rem]",
                  // Con más de 3 fechas la lista se desliza: el borde inferior se desvanece para que se note
                  monthEntries.length > 3 &&
                    "pb-6 [mask-image:linear-gradient(to_bottom,black_72%,transparent)] [scrollbar-width:thin]",
                )}
              >
                {monthEntries.map((e) => {
                  const selected = e.key === selectedKey;
                  return (
                    <li key={e.key} style={categoryStyle(e.category)}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        aria-label={entryAccessibleName(e)}
                        onClick={() => onSelect(e.key)}
                        onFocus={() => setActive(e.key)}
                        onBlur={() => setActive((k) => (k === e.key ? null : k))}
                        onPointerEnter={() => setActive(e.key)}
                        onPointerLeave={() => setActive((k) => (k === e.key ? null : k))}
                        className={cn(
                          "flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-sm transition-colors",
                          selected ? "bg-white/12 text-white" : "text-slate-200 hover:bg-white/5",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--cat-soft) font-display text-sm font-semibold text-(--cat) ring-1 ring-(--cat)/40"
                        >
                          {e.day}
                        </span>
                        <span className="line-clamp-2 leading-snug">{e.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-300">Aún no hay fechas este mes. Gira el anillo para explorar otro.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tooltip del punto activo (fuera del giro, siempre derecho) */}
      <AnimatePresence>
        {activeDot && tooltipPos && (
          <motion.div
            key={activeDot.entry.key}
            aria-hidden="true"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ left: `${tooltipPos.x / 10}%`, top: `${tooltipPos.y / 10}%`, ...categoryStyle(activeDot.entry.category) }}
            className="pointer-events-none absolute z-20 w-max max-w-56 -translate-x-1/2 -translate-y-[calc(100%+18px)] rounded-xl border border-(--cat)/40 bg-[#0b1530]/95 px-3 py-2 text-center text-xs shadow-xl"
          >
            <span className="block font-semibold text-(--cat)">{dayLabel(activeDot.entry.month, activeDot.entry.day)}</span>
            <span className="block text-white">{activeDot.entry.title}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => go(month - 1)}
        aria-label={`Mes anterior: ${MONTHS[(month + 10) % 12]}`}
        className="absolute bottom-1 left-1 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => go(month + 1)}
        aria-label={`Mes siguiente: ${MONTHS[month % 12]}`}
        className="absolute bottom-1 right-1 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </motion.div>
  );
}
