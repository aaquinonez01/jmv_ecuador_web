"use client";

import { useEffect, useMemo, useState } from "react";
import { getSky, type FiestaSky } from "@/lib/fiestas/api";
import { cn } from "@/lib/utils";

/** Estrellas que se dibujan por comunidad; el resto se resume en "+N" */
const MAX_DOTS = 36;

function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
/** Cielo de ejemplo para que los administradores vean cómo quedará (sus pruebas no cuentan) */
const DEMO: FiestaSky = {
  total: 48,
  comunidades: 6,
  open: false,
  stars: [
    { comunidad: "Comunidad de ejemplo 1", n: 17 },
    { comunidad: "Comunidad de ejemplo 2", n: 12 },
    { comunidad: "Comunidad de ejemplo 3", n: 8 },
    { comunidad: "Comunidad de ejemplo 4", n: 6 },
    { comunidad: "Comunidad de ejemplo 5", n: 4 },
    { comunidad: "Comunidad de ejemplo 6", n: 1 },
  ],
};

const hash = (t: string) => [...t].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Una constelación: las estrellas de una comunidad, repartidas en espiral */
function Constellation({ name, n, mine }: { name: string; n: number; mine: boolean }) {
  const dots = useMemo(() => {
    const rnd = seeded(hash(name));
    const count = Math.min(n, MAX_DOTS);
    return Array.from({ length: count }, (_, i) => {
      // espiral de Fibonacci: llena el círculo de forma pareja
      const r = Math.sqrt((i + 0.5) / Math.max(count, 6)) * 40;
      const a = i * 2.39996 + rnd() * 0.5;
      return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r, size: 2.2 + rnd() * 2.2, delay: rnd() * 3 };
    });
  }, [name, n]);

  return (
    <li
      className="rounded-3xl p-3 text-center"
      style={
        mine
          ? { border: "1px solid #f5b83d", background: "rgba(245,184,61,0.15)", boxShadow: "0 0 40px -8px rgba(245,184,61,0.6)" }
          : { border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }
      }
    >
      <svg viewBox="0 0 100 100" className="mx-auto h-24 w-24 overflow-visible" aria-hidden="true">
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.size}
            fill={mine ? "#ffe7a3" : i % 4 === 0 ? "#f5c867" : "#ffffff"}
            className="feast-twinkle"
            style={{ animationDelay: `${d.delay}s` }}
          />
        ))}
      </svg>
      <p className="mt-1 text-sm font-semibold leading-tight" style={{ color: "#fff" }}>
        {name}
      </p>
      <p className="text-xs" style={{ color: mine ? "#ffe7a3" : "rgba(255,255,255,0.6)" }}>
        {n} {n === 1 ? "joven" : "jóvenes"}
        {mine ? " · tu comunidad" : ""}
      </p>
    </li>
  );
}

// El cielo de la fiesta: una estrella por cada joven que recibió la Medalla, agrupadas por comunidad.
export default function FeastSky({
  slug,
  initial,
  myComunidad,
  hideEmpty = false,
  title,
  demo = false,
  className,
}: {
  slug: string;
  /** Datos ya cargados (por ejemplo, la respuesta al recibir la Medalla) */
  initial?: FiestaSky | null;
  /** Nombre de la comunidad de quien mira, para resaltarla */
  myComunidad?: string | null;
  /** No mostrar nada mientras nadie haya recibido la Medalla */
  hideEmpty?: boolean;
  /** Título sobre el contador (en la portada) */
  title?: string;
  /** Administradores: si el cielo está vacío, muestra uno de ejemplo */
  demo?: boolean;
  className?: string;
}) {
  const [real, setSky] = useState<FiestaSky | null>(initial ?? null);
  const isDemo = demo && real !== null && real.total === 0;
  const sky = isDemo ? DEMO : real;

  useEffect(() => {
    if (initial) setSky(initial);
  }, [initial]);

  // Se actualiza solo: el cielo se va llenando mientras lo miras
  useEffect(() => {
    let alive = true;
    const load = () =>
      getSky(slug)
        .then((s) => alive && setSky(s))
        .catch(() => undefined);
    load();
    const t = setInterval(load, 20_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [slug]);

  if (!sky) return hideEmpty ? null : <div className={cn("h-40 animate-pulse rounded-3xl bg-white/10", className)} />;
  if (sky.total === 0 && hideEmpty) return null;

  const named = sky.stars.filter((s) => s.comunidad);
  const others = sky.stars.filter((s) => !s.comunidad).reduce((a, s) => a + s.n, 0);

  return (
    <div className={className}>
      <style>{`
        @keyframes feast-twinkle { 0%, 100% { opacity: 1 } 50% { opacity: 0.35 } }
        .feast-twinkle { animation: feast-twinkle 3.2s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .feast-twinkle { animation: none } }
      `}</style>
      {isDemo && (
        <p className="mb-4 rounded-2xl px-4 py-3 text-center text-sm" style={{ background: "rgba(245,184,61,0.14)", border: "1px solid rgba(245,184,61,0.5)", color: "#ffe7a3" }}>
          Vista previa para administradores: así se verá el cielo. Las comunidades y los números son de ejemplo; tu prueba
          no se cuenta.
        </p>
      )}
      {title && (
        <h2 className="font-display mb-4 text-center text-3xl font-semibold sm:text-4xl" style={{ color: "#fff" }}>
          {title}
        </h2>
      )}
      <p className="text-center" aria-live="polite">
        <span className="font-display block text-6xl font-semibold sm:text-7xl" style={{ color: "#f5c867" }}>
          {sky.total}
        </span>
        <span className="mt-1 block text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
          {sky.total === 1 ? "joven ya lleva la Medalla en su corazón" : "jóvenes ya llevan la Medalla en su corazón"}
          {sky.comunidades > 0 && (
            <>
              {" "}
              · {sky.comunidades} {sky.comunidades === 1 ? "comunidad" : "comunidades"}
            </>
          )}
        </span>
      </p>
      {sky.total === 0 ? (
        <p className="mt-6 text-center" style={{ color: "rgba(255,255,255,0.7)" }}>El cielo espera su primera estrella. Sé tú quien la encienda.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {named.map((s) => (
            <Constellation key={s.comunidad} name={s.comunidad!} n={s.n} mine={isDemo ? s === sky.stars[0] : Boolean(myComunidad) && s.comunidad === myComunidad} />
          ))}
          {others > 0 && <Constellation name="JMV Ecuador" n={others} mine={false} />}
        </ul>
      )}
    </div>
  );
}
