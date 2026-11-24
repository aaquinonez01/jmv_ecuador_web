"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

// La Virgen de la Medalla, resplandeciente: mismas formas que la figura de la
// Medalla (sobre el globo, con los rayos de sus manos), con halo, destellos y
// corona de doce estrellas animados.

/** Rayos de cada mano hacia la tierra (coordenadas de la Medalla) */
const HAND_RAYS = [0, 1, 2, 3, 4, 5].flatMap((i) => [
  { x1: 74 - i * 0.6, y1: 132 + i * 2, x2: 30 + i * 7, y2: 214 + i * 2, d: i * 0.18 },
  { x1: 126 + i * 0.6, y1: 132 + i * 2, x2: 170 - i * 7, y2: 214 + i * 2, d: i * 0.18 + 0.09 },
]);

export default function FeastVirgin({ rays = true, className }: { rays?: boolean; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const loop = (duration: number, delay = 0) => (reduce ? { duration: 0 } : { duration, delay, repeat: Infinity, ease: "easeInOut" as const });

  return (
    <svg viewBox="0 0 240 320" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`halo-${uid}`} cx="50%" cy="42%" r="60%">
          <stop offset="0" stopColor="#fffbe6" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffd36e" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#f5b83d" stopOpacity="0.16" />
          <stop offset="1" stopColor="#f5b83d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`manto-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e3edff" />
          <stop offset="1" stopColor="#a9c5f5" />
        </linearGradient>
        <linearGradient id={`oro-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe7a3" />
          <stop offset="0.5" stopColor="#f5b83d" />
          <stop offset="1" stopColor="#c8860a" />
        </linearGradient>
        <linearGradient id={`rayo-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="1" stopColor="#f5b83d" stopOpacity="0.15" />
        </linearGradient>
        <filter id={`brillo-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Destellos que giran lentamente detrás */}
      <motion.g
        style={{ transformOrigin: "120px 140px" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        opacity="0.5"
      >
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const w = i % 2 ? 0.035 : 0.06;
          const p = (ang: number, r: number) => `${(120 + Math.cos(ang) * r).toFixed(1)},${(140 + Math.sin(ang) * r).toFixed(1)}`;
          return <polygon key={i} points={`${p(a, 26)} ${p(a - w, i % 2 ? 150 : 185)} ${p(a + w, i % 2 ? 150 : 185)}`} fill="#ffd36e" opacity={i % 2 ? 0.35 : 0.6} />;
        })}
      </motion.g>

      {/* Halo que respira */}
      <motion.ellipse
        cx="120"
        cy="140"
        rx="118"
        ry="135"
        fill={`url(#halo-${uid})`}
        style={{ transformOrigin: "120px 140px" }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [0.75, 1, 0.75], scale: [0.96, 1.05, 0.96] }}
        transition={loop(4.5)}
      />

      {/* Figura: se dibuja en las coordenadas de la Medalla y se amplía */}
      <motion.g
        transform="translate(120 172) scale(1.28) translate(-100 -138)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        {rays &&
          HAND_RAYS.map((r, i) => (
            <motion.line
              key={i}
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              stroke={`url(#rayo-${uid})`}
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={reduce ? { pathLength: 1, opacity: 0.9 } : { pathLength: [0, 1, 1], opacity: [0, 1, 0.45] }}
              transition={reduce ? { duration: 0 } : { duration: 2.6, delay: 0.9 + r.d, repeat: Infinity, repeatDelay: 0.6, ease: "easeOut" }}
            />
          ))}

        {/* Globo bajo sus pies */}
        <path d="M62 214 A38 18 0 0 1 138 214 Z" fill="#1d4e8a" stroke={`url(#oro-${uid})`} strokeWidth="1.6" />
        <path d="M74 205 Q100 198 126 205 M100 196 V214" fill="none" stroke={`url(#oro-${uid})`} strokeWidth="1" opacity="0.8" />

        {/* Manto y rostro */}
        <g filter={`url(#brillo-${uid})`}>
          <path
            d="M100 63 C86 65 82 80 85 94 L70 194 C86 202 114 202 130 194 L115 94 C118 80 114 65 100 63 Z"
            fill={`url(#manto-${uid})`}
            stroke={`url(#oro-${uid})`}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="100" cy="76" r="8.5" fill="#fff3d6" stroke={`url(#oro-${uid})`} strokeWidth="1.4" />
        </g>
        <path d="M88 102 C82 112 78 122 74 132 M112 102 C118 112 122 122 126 132" fill="none" stroke={`url(#oro-${uid})`} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M92 150 C96 160 104 160 108 150" fill="none" stroke="#c8860a" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />

        {/* Corona de doce estrellas */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const cx = 100 + Math.cos(a) * 21;
          const cy = 76 + Math.sin(a) * 21;
          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r="1.9"
              fill="#fffbe6"
              initial={{ opacity: 0, scale: 0 }}
              animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [0.35, 1, 0.35], scale: [0.8, 1.25, 0.8] }}
              transition={loop(2.4, i * 0.2)}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          );
        })}
      </motion.g>
    </svg>
  );
}
