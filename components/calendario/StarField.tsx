import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Cielo nocturno estático (SVG generado con semilla fija: igual en servidor y cliente).
// Unas pocas estrellas parpadean muy suave, solo si el usuario no pidió reducir movimiento.

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeStars(count: number, seed: number) {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => ({
    x: +(rand() * 100).toFixed(2),
    y: +(rand() * 100).toFixed(2),
    r: +(rand() < 0.88 ? 0.5 + rand() * 0.7 : 1.3 + rand() * 0.9).toFixed(2),
    o: +(0.25 + rand() * 0.6).toFixed(2),
    twinkle: i % 7 === 0,
    delay: +(rand() * 6).toFixed(2),
  }));
}

const CSS = `
@keyframes cal-twinkle { 0%, 100% { opacity: var(--o); } 50% { opacity: 0.08; } }
@media (prefers-reduced-motion: no-preference) {
  .cal-twinkle { animation: cal-twinkle 5s ease-in-out infinite; }
}
`;

export default function StarField({
  count = 90,
  seed = 27,
  className,
}: {
  count?: number;
  seed?: number;
  className?: string;
}) {
  const stars = makeStars(count, seed);
  return (
    <>
      <style href="cal-starfield" precedence="default">
        {CSS}
      </style>
      {/* Claro: estrellas en azul JMV y algunas en dorado oscuro sobre el amanecer; oscuro: blancas */}
      <svg
        aria-hidden="true"
        focusable="false"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full text-jmv-blue opacity-75 dark:text-white dark:opacity-100",
          className,
        )}
        preserveAspectRatio="none"
      >
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="currentColor"
            opacity={s.o}
            className={cn(i % 3 === 1 && "fill-[#a8740a] dark:fill-current", s.twinkle && "cal-twinkle")}
            style={s.twinkle ? ({ "--o": s.o, animationDelay: `${s.delay}s` } as CSSProperties) : undefined}
          />
        ))}
      </svg>
    </>
  );
}
