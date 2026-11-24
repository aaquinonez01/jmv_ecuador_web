"use client";

import { useId, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { starPoints } from "@/components/brand/svg-props";
import { cn } from "@/lib/utils";

// La Medalla Milagrosa que se arma día a día. Cada pieza ganada se dibuja en oro;
// las que faltan se ven como un contorno tenue para que se note qué falta.

const HEART =
  "M0 10C0 2 6-4 13-4c5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 14-16 24-24 32C16 34 0 24 0 10Z";
const FLAME = "M24 3c-4-5-2-10 0-14 2 4 4 9 0 14Z";
const INSCRIPTION = "OH MARÍA, SIN PECADO CONCEBIDA, RUEGA POR NOSOTROS QUE RECURRIMOS A TI";

const STARS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return starPoints(100 + Math.cos(a) * 74, 130 + Math.sin(a) * 104, 7);
});

const RAYS_LEFT = [0, 1, 2, 3, 4, 5].map((i) => `M${74 - i * 0.6} ${132 + i * 2}L${40 + i * 6} ${196 + i * 2}`);
const RAYS_RIGHT = [0, 1, 2, 3, 4, 5].map((i) => `M${126 + i * 0.6} ${132 + i * 2}L${160 - i * 6} ${196 + i * 2}`);

type Face = "front" | "back";

/** Desde dónde entra volando cada pieza en la celebración (unidades del dibujo; la medalla mide 200×260) */
const FLY_FROM: Record<string, { x: number; y: number; rotate: number }> = {
  rayos: { x: 0, y: -460, rotate: -30 },
  globo: { x: 0, y: 460, rotate: 25 },
  serpiente: { x: -420, y: 120, rotate: -50 },
  inscripcion: { x: 420, y: -140, rotate: 60 },
  maria: { x: 0, y: -520, rotate: 0 },
  m: { x: -420, y: -60, rotate: -45 },
  cruz: { x: 0, y: -480, rotate: 20 },
  corazones: { x: 0, y: 460, rotate: -25 },
  estrellas: { x: 420, y: 80, rotate: 90 },
};

function Piece({
  id,
  earned,
  highlight,
  children,
  fill = false,
  fly = false,
}: {
  id: string;
  earned: Set<string>;
  highlight?: string | null;
  children: ReactNode;
  fill?: boolean;
  /** Celebración: al ganarse, la pieza entra volando desde fuera y se incrusta */
  fly?: boolean;
}) {
  const reduce = useReducedMotion();
  const on = earned.has(id);
  const isNew = on && highlight === id && !reduce;
  const from = FLY_FROM[id];
  const flying = fly && isNew && Boolean(from);
  return (
    <motion.g
      // al ganarse en la celebración se vuelve a montar, para que la entrada se anime
      key={fly && on ? "on" : "off"}
      data-piece={id}
      initial={flying ? { opacity: 0, x: from.x, y: from.y, rotate: from.rotate, scale: 2.2 } : isNew ? { opacity: 0, scale: 1.6 } : false}
      animate={flying ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 } : { opacity: 1, scale: 1 }}
      transition={
        flying
          ? { type: "spring", stiffness: 95, damping: 13, mass: 0.9, opacity: { duration: 0.25 } }
          : isNew
            ? { duration: 1.1, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }
            : undefined
      }
      style={{ transformOrigin: "100px 130px", transformBox: "view-box" }}
      stroke={on ? "url(#medal-gold)" : "rgba(255,255,255,0.16)"}
      strokeDasharray={on ? undefined : "3 4"}
      fill={on && fill ? "rgba(245,184,61,0.16)" : "none"}
      filter={on ? "url(#medal-glow)" : undefined}
    >
      {children}
    </motion.g>
  );
}

function FaceSvg({ face, earned, highlight, fly }: { face: Face; earned: Set<string>; highlight?: string | null; fly?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const complete = earned.has("medalla");
  return (
    <svg viewBox="0 0 200 260" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="medal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe7a3" />
          <stop offset="45%" stopColor="#f5b83d" />
          <stop offset="100%" stopColor="#c8860a" />
        </linearGradient>
        <radialGradient id={`medal-bg-${uid}`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={complete ? "#3a5f96" : "#1c3a66"} />
          <stop offset="100%" stopColor={complete ? "#13284b" : "#0d1d38"} />
        </radialGradient>
        <filter id="medal-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <path id={`ins-${uid}`} d="M39 186 A72 104 0 1 1 161 186" />
      </defs>

      {/* Cuerpo de la medalla */}
      <ellipse cx="100" cy="130" rx="92" ry="122" fill={`url(#medal-bg-${uid})`} />
      <ellipse
        cx="100"
        cy="130"
        rx="92"
        ry="122"
        fill="none"
        stroke={complete ? "url(#medal-gold)" : "rgba(245,184,61,0.45)"}
        strokeWidth={complete ? 5 : 3}
      />
      <ellipse cx="100" cy="130" rx="84" ry="114" fill="none" stroke="rgba(245,184,61,0.22)" strokeWidth="1" />

      <g strokeLinecap="round" strokeLinejoin="round">
        {face === "front" ? (
          <>
            <Piece id="rayos" earned={earned} highlight={highlight} fly={fly}>
              <g strokeWidth="1.6">
                {[...RAYS_LEFT, ...RAYS_RIGHT].map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
            </Piece>
            <Piece id="globo" earned={earned} highlight={highlight} fly={fly} fill>
              <g strokeWidth="2">
                <path d="M62 214 A38 18 0 0 1 138 214 Z" />
                <path d="M74 205 Q100 198 126 205 M100 196 V214 M84 199 Q80 207 82 214 M116 199 Q120 207 118 214" strokeWidth="1.2" />
              </g>
            </Piece>
            <Piece id="serpiente" earned={earned} highlight={highlight} fly={fly}>
              <g strokeWidth="2.2">
                <path d="M58 206 C66 196 74 212 84 204 S100 196 110 204 S128 210 136 200" />
                <path d="M136 200 C139 196 145 196 146 200 C145 204 139 204 136 200 Z" strokeWidth="1.6" />
              </g>
            </Piece>
            <Piece id="maria" earned={earned} highlight={highlight} fly={fly} fill>
              <g strokeWidth="2.2">
                <circle cx="100" cy="74" r="9" />
                <path d="M100 63 C86 65 82 80 85 94 L70 194 C86 202 114 202 130 194 L115 94 C118 80 114 65 100 63 Z" />
                <path d="M88 102 C82 112 78 122 74 132 M112 102 C118 112 122 122 126 132" />
                <path d="M92 150 C96 160 104 160 108 150" strokeWidth="1.2" />
              </g>
            </Piece>
            <Piece id="inscripcion" earned={earned} highlight={highlight} fly={fly}>
              <text
                fontSize="7.6"
                fontWeight={600}
                letterSpacing="0.3"
                fill={earned.has("inscripcion") ? "#f5c867" : "rgba(255,255,255,0.18)"}
                stroke="none"
              >
                <textPath href={`#ins-${uid}`} startOffset="50%" textAnchor="middle">
                  {INSCRIPTION}
                </textPath>
              </text>
              <text
                x="100"
                y="238"
                fontSize="11"
                fontWeight={700}
                textAnchor="middle"
                fill={earned.has("inscripcion") ? "#f5c867" : "rgba(255,255,255,0.18)"}
                stroke="none"
              >
                1830
              </text>
            </Piece>
          </>
        ) : (
          <>
            <Piece id="estrellas" earned={earned} highlight={highlight} fly={fly} fill>
              <g strokeWidth="1.2">
                {STARS.map((p) => (
                  <polygon key={p} points={p} />
                ))}
              </g>
            </Piece>
            <Piece id="cruz" earned={earned} highlight={highlight} fly={fly}>
              <path d="M100 50 V108 M86 66 H114 M68 108 H132" strokeWidth="5" />
            </Piece>
            <Piece id="m" earned={earned} highlight={highlight} fly={fly}>
              <path d="M72 164 V122 L100 150 L128 122 V164 M100 108 V150" strokeWidth="5" />
            </Piece>
            <Piece id="corazones" earned={earned} highlight={highlight} fly={fly} fill>
              <g transform="translate(51 186) scale(0.82)" strokeWidth="2.4">
                <path d={HEART} />
                <path d="M1 12c9 5 37 5 46 0M2 18c9 5 35 5 44 0" fill="none" />
                <path d={FLAME} />
                <path d="M24 -14v-10M20 -20h8" fill="none" />
              </g>

              <g transform="translate(110 186) scale(0.82)" strokeWidth="2.4">
                <path d={HEART} />
                <path d="M-12 -8L20 20M-14 0l10-10M-12 -8l-5-5" fill="none" />
                <path d={FLAME} />
              </g>
            </Piece>
          </>
        )}
      </g>
    </svg>
  );
}

export default function Medal({
  earned,
  highlight,
  initialFace = "front",
  className,
  showFlip = true,
  fly = false,
}: {
  earned: Set<string>;
  highlight?: string | null;
  initialFace?: Face;
  className?: string;
  showFlip?: boolean;
  /** Celebración: las piezas entran volando al ganarse */
  fly?: boolean;
}) {
  const [face, setFace] = useState<Face>(initialFace);
  const reduce = useReducedMotion();
  const complete = earned.has("medalla");

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative aspect-[200/260] w-full [perspective:1200px]">
        {/* Halo */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute -inset-[12%] rounded-full blur-3xl transition-opacity duration-700",
            complete ? "bg-[#f5b83d]/35 opacity-100" : "bg-[#5b8dd6]/25 opacity-80",
          )}
        />
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: face === "front" ? 0 : 180 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 14 }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <FaceSvg face="front" earned={earned} highlight={highlight} fly={fly} />
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <FaceSvg face="back" earned={earned} highlight={highlight} fly={fly} />
          </div>
        </motion.div>
        {complete && !reduce && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[50%]">
            <div className="fiesta-sheen absolute -inset-y-4 -left-1/2 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </div>
        )}
      </div>
      {showFlip && (
        <button
          type="button"
          onClick={() => setFace((f) => (f === "front" ? "back" : "front"))}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white shadow-[0_3px_0_rgba(0,0,0,0.25),0_8px_20px_rgba(0,0,0,0.25)] backdrop-blur transition hover:bg-white/15 active:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.25)]"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          {face === "front" ? "Ver el reverso" : "Ver el anverso"}
        </button>
      )}
    </div>
  );
}
