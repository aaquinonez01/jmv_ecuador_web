"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, HandHeart, Loader2, Share2, Sparkles, X } from "lucide-react";
import StarField from "@/components/calendario/StarField";
import { consecrate, errorMessage, getMyConsecration, type FiestaSky } from "@/lib/fiestas/api";
import {
  FEAST_ACCEPT,
  FEAST_CHAIN,
  FEAST_PIECES,
  FEAST_ROOTS,
  FEAST_STORY,
  type FeastArt,
} from "@/lib/fiestas/feast-medalla";
import type { FiestaMe } from "@/lib/fiestas/types";
import { cn } from "@/lib/utils";
import FeastSky from "./FeastSky";
import FeastVirgin from "./FeastVirgin";
import FeastWall from "./FeastWall";
import Medal from "./Medal";
import { Confetti, FiestaButton } from "./ui";

type Screen =
  | { kind: "story"; index: number }
  | { kind: "medal" }
  | { kind: "roots" }
  | { kind: "consecration" }
  | { kind: "sky" };

const SCREENS: Screen[] = [
  ...FEAST_STORY.map((_, index) => ({ kind: "story" as const, index })),
  { kind: "medal" },
  { kind: "roots" },
  { kind: "consecration" },
  { kind: "sky" },
];

const ALL_PIECES = new Set([...FEAST_PIECES.map((p) => p.id), "medalla"]);

/** Doce estrellas en círculo */
function Stars12({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const cx = 100 + Math.cos(a) * 78;
        const cy = 100 + Math.sin(a) * 78;
        const pts = Array.from({ length: 10 }, (_, n) => {
          const r = n % 2 === 0 ? 11 : 4.6;
          const ang = (Math.PI / 5) * n - Math.PI / 2;
          return `${(cx + Math.cos(ang) * r).toFixed(1)},${(cy + Math.sin(ang) * r).toFixed(1)}`;
        }).join(" ");
        return (
          <motion.polygon
            key={i}
            points={pts}
            fill="#f5c867"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.09, type: "spring", stiffness: 220, damping: 14 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
    </svg>
  );
}

/** Ilustración de cada pantalla del relato */
function Art({ art }: { art: FeastArt }) {
  if (art === "anio")
    return (
      <motion.p
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="font-display bg-gradient-to-b from-[#ffe7a3] via-[#f5b83d] to-[#c8860a] bg-clip-text text-[7.5rem] font-semibold leading-none text-transparent drop-shadow-[0_0_40px_rgba(245,184,61,0.45)] sm:text-[10rem]"
      >
        1830
      </motion.p>
    );
  if (art === "capilla")
    return (
      <svg viewBox="0 0 200 240" className="h-56 w-auto sm:h-64" aria-hidden="true">
        <defs>
          <radialGradient id="feast-luz" cx="50%" cy="40%" r="70%">
            <stop offset="0" stopColor="#fff6d6" />
            <stop offset="0.45" stopColor="#f5b83d" stopOpacity="0.75" />
            <stop offset="1" stopColor="#f5b83d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.ellipse cx="100" cy="130" rx="95" ry="110" fill="url(#feast-luz)" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0.7] }} transition={{ duration: 2.2 }} />
        <motion.path
          d="M52 232 V112 A48 62 0 0 1 148 112 V232"
          fill="none"
          stroke="#ffe7a3"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        <motion.path d="M100 86 V150 M80 108 H120" fill="none" stroke="#ffe7a3" strokeWidth="5" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }} />
      </svg>
    );
  if (art === "estrellas") return <Stars12 className="h-56 w-56 sm:h-64 sm:w-64" />;
  if (art === "servicio")
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
        className="grid h-44 w-44 place-items-center rounded-[3rem] bg-gradient-to-b from-[#ffd36e] to-[#f0a81f] text-[#3b2600] shadow-[0_10px_0_#9a6504,0_30px_70px_rgba(240,168,31,0.45)]"
      >
        <HandHeart className="h-24 w-24" strokeWidth={1.6} aria-hidden="true" />
      </motion.div>
    );
  // La Virgen resplandeciente (con los rayos de sus manos en la segunda aparición)
  if (art === "virgen" || art === "luz") return <FeastVirgin rays={art === "virgen"} className="h-72 w-auto sm:h-80" />;
  const back = art === "medalla";
  const earned = back ? new Set(["m", "cruz"]) : art === "rayos" ? new Set(["rayos", "maria"]) : new Set(ALL_PIECES);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative w-44 sm:w-52">
      {art === "nombre" && <div aria-hidden="true" className="absolute -inset-8 rounded-full bg-[#f5b83d]/40 blur-3xl" />}
      <Medal earned={earned} highlight={art === "rayos" ? "rayos" : null} initialFace={back ? "back" : "front"} showFlip={false} />
    </motion.div>
  );
}

/** La Medalla se arma pieza por pieza, gira al reverso y queda completa */
function MedalCeremony({ name, onDone }: { name: string | null; onDone: () => void }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? FEAST_PIECES.length + 1 : 0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (count > FEAST_PIECES.length) {
      doneRef.current();
      return;
    }
    // Una pausa más larga al pasar del anverso al reverso, para que se vea el giro
    const flip = count > 0 && count < FEAST_PIECES.length && FEAST_PIECES[count].face !== FEAST_PIECES[count - 1].face;
    const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 800 : flip ? 2600 : count === FEAST_PIECES.length ? 2000 : 1650);
    return () => clearTimeout(t);
  }, [count]);

  const complete = count > FEAST_PIECES.length;
  const earned = useMemo(() => {
    const s = new Set(FEAST_PIECES.slice(0, count).map((p) => p.id));
    if (complete) s.add("medalla");
    return s;
  }, [count, complete]);
  const current = FEAST_PIECES[Math.min(count, FEAST_PIECES.length) - 1];

  // La Medalla gira una sola vez: se queda en el reverso mientras entran sus piezas
  // y vuelve al anverso al completarse. Gira después de que la última pieza se asentó.
  const [face, setFace] = useState<"front" | "back">("front");
  useEffect(() => {
    const next = complete ? "front" : (FEAST_PIECES[count]?.face ?? null);
    if (!next) return;
    const t = setTimeout(() => setFace(next), complete ? 0 : 1450);
    return () => clearTimeout(t);
  }, [count, complete]);

  // Un pequeño golpe cuando la pieza se incrusta
  const [scope, animate] = useAnimate<HTMLDivElement>();
  useEffect(() => {
    if (count === 0 || reduce || !scope.current) return;
    void animate(scope.current, { scale: [1, 1, 1.045, 1] }, { duration: 1.5, times: [0, 0.66, 0.8, 1] });
  }, [count, reduce, animate, scope]);

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f5c867]">Nueve caminos, una Medalla</p>
      <div className="relative mt-6 w-56 sm:w-64">
        <div aria-hidden="true" className={cn("absolute -inset-8 rounded-full blur-3xl transition-opacity duration-1000", complete ? "bg-[#f5b83d]/40 opacity-100" : "opacity-0")} />
        <div ref={scope}>
          <Medal earned={earned} highlight={complete ? null : current?.id} face={complete ? undefined : face} showFlip={complete} fly />
        </div>
      </div>
      <p className="mt-6 min-h-6 text-sm text-white/70" aria-live="polite">
        {complete ? "" : `${Math.min(count, FEAST_PIECES.length)} de ${FEAST_PIECES.length} piezas`}
      </p>
      <AnimatePresence>
        {complete && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{name ? `${name}, esta es tu Medalla` : "Esta es tu Medalla"}</h2>
            <p className="mx-auto mt-3 max-w-sm text-lg text-[#ffe7a3]">«Oh María, sin pecado concebida, ruega por nosotros que recurrimos a ti»</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// La noche del 27: el relato de 1830, la Medalla completa, nuestras raíces,
// recibir la Medalla y el cielo que se enciende con cada joven.
export default function FeastExperience({
  slug,
  fiestaId,
  fiestaTitle,
  me,
  onClose,
  onNeedAuth,
  onShare,
  sharing = false,
}: {
  slug: string;
  fiestaId: string;
  fiestaTitle: string;
  me: FiestaMe | null;
  onClose: () => void;
  /** Pide crear cuenta o entrar (para recibir la Medalla) */
  onNeedAuth: () => void;
  /** Crea y comparte la imagen de recuerdo */
  onShare: () => void;
  sharing?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [ceremonyDone, setCeremonyDone] = useState(false);
  const [done, setDone] = useState(false);
  const [sky, setSky] = useState<FiestaSky | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [burst, setBurst] = useState(0);
  const screen = SCREENS[step];
  const last = step === SCREENS.length - 1;
  const firstName = me?.user.name.split(/\s+/)[0] ?? null;

  useEffect(() => {
    if (me) getMyConsecration(slug).then(setDone);
  }, [me, slug]);

  const go = useCallback((d: 1 | -1) => setStep((s) => Math.min(SCREENS.length - 1, Math.max(0, s + d))), []);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go]);

  const doConsecrate = async () => {
    if (!me) return onNeedAuth();
    setBusy(true);
    setError("");
    try {
      const r = await consecrate(slug);
      setDone(true);
      setSky(r.sky);
      setBurst((b) => b + 1);
      setStep(SCREENS.length - 1);
    } catch (e) {
      setError(errorMessage(e, "No se pudo guardar. Inténtalo de nuevo."));
    } finally {
      setBusy(false);
    }
  };

  if (typeof document === "undefined") return null;

  const nextLabel =
    screen.kind === "story" && screen.index === FEAST_STORY.length - 1
      ? "Tu Medalla"
      : screen.kind === "medal"
        ? "Nuestras raíces"
        : screen.kind === "roots"
          ? "Recibir la Medalla"
          : "Siguiente";

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${fiestaTitle}: la fiesta`} className="fixed inset-0 z-[90] flex flex-col bg-[#070d1d] text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,#1d4e8a_0%,#0f2547_45%,#070d1d_100%)]" />
      <StarField count={120} seed={1830} className="h-full" />
      <Confetti burst={burst} />

      {/* Avance y cerrar */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-4 sm:px-6">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {SCREENS.map((_, i) => (
            <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-500", i <= step ? "bg-[#f5c867]" : "bg-white/20")} />
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Salir de la celebración"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 shadow-[0_3px_0_rgba(0,0,0,0.25)] transition hover:bg-white/20 active:translate-y-0.5"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Pantalla */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
            className="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-6 py-8 text-center"
          >
            {screen.kind === "story" && (
              <>
                <p className="mb-6 rounded-full border border-[#f5b83d]/45 bg-[#f5b83d]/12 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.18em] text-[#f5c867]">
                  {FEAST_STORY[screen.index].kicker}
                </p>
                <div className="grid min-h-72 place-items-center sm:min-h-80">
                  <Art art={FEAST_STORY[screen.index].art} />
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="font-display mt-8 text-2xl font-semibold leading-snug sm:text-3xl"
                >
                  {FEAST_STORY[screen.index].text}
                </motion.p>
              </>
            )}

            {screen.kind === "medal" && <MedalCeremony name={firstName} onDone={() => setCeremonyDone(true)} />}

            {screen.kind === "roots" && (
              <div className="w-full text-left">
                <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-[#f5c867]">De dónde venimos</p>
                <h2 className="font-display mt-2 text-center text-4xl font-semibold sm:text-5xl">Nuestras raíces</h2>
                <ol className="relative mx-auto mt-8 max-w-md space-y-5 border-l-2 border-[#f5b83d]/40 pl-6">
                  {FEAST_ROOTS.map((r, i) => (
                    <motion.li key={r.year} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.5, duration: 0.5 }} className="relative">
                      <span aria-hidden="true" className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-2 border-[#f5b83d] bg-[#0f2547]" />
                      <p className="font-display text-3xl font-semibold text-[#f5c867]">
                        {r.year} <span className="text-base font-medium text-white/60">· {r.place}</span>
                      </p>
                      <p className="mt-1 text-[15px] leading-relaxed text-white/85">{r.text}</p>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + FEAST_ROOTS.length * 0.5, duration: 0.5 }}
                    className="relative"
                  >
                    <span aria-hidden="true" className="absolute -left-[35px] top-1 h-5 w-5 rounded-full bg-[#f5b83d] shadow-[0_0_24px_rgba(245,184,61,0.9)]" />
                    <p className="font-display text-3xl font-semibold text-white">
                      Hoy{me?.comunidad ? <span className="text-base font-medium text-white/60"> · {me.comunidad.nombre}</span> : null}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-[#ffe7a3]">{firstName ? `Tú, ${firstName}.` : "Tú."}</p>
                  </motion.li>
                </ol>
                <motion.blockquote
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + FEAST_ROOTS.length * 0.5 + 0.6, duration: 0.8 }}
                  className="font-display mx-auto mt-6 max-w-md rounded-3xl border border-white/15 bg-white/[0.06] p-5 text-center text-lg leading-snug"
                >
                  «{FEAST_CHAIN}»
                </motion.blockquote>
              </div>
            )}

            {screen.kind === "consecration" && (
              <div className="w-full">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f5c867]">{FEAST_ACCEPT.kicker}</p>
                <h2 className="font-display mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{FEAST_ACCEPT.title}</h2>
                <div className="font-display mx-auto mt-6 max-w-lg space-y-4 rounded-3xl border border-[#f5b83d]/35 bg-black/25 p-6 text-left text-lg leading-relaxed sm:text-xl">
                  {FEAST_ACCEPT.text.map((p) => (
                    <p key={p.slice(0, 20)}>{p}</p>
                  ))}
                </div>
                {error && (
                  <p role="alert" className="mx-auto mt-4 max-w-lg rounded-2xl bg-[#d3302f]/25 px-4 py-3 text-sm">
                    {error}
                  </p>
                )}
                <div className="mt-6 flex flex-col items-center gap-3">
                  {done ? (
                    <>
                      <p className="text-[#a8f0cc]">{FEAST_ACCEPT.done}</p>
                      <FiestaButton tone="gold" className="px-7 text-base" onClick={() => go(1)}>
                        Ver el cielo <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </FiestaButton>
                    </>
                  ) : (
                    <>
                      <FiestaButton tone="gold" className="px-7 text-base" onClick={doConsecrate} disabled={busy}>
                        {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Sparkles className="h-5 w-5" aria-hidden="true" />}
                        {me ? FEAST_ACCEPT.button : "Entra para recibirla"}
                      </FiestaButton>
                      <p className="max-w-sm text-sm text-white/65">{FEAST_ACCEPT.hint}</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {screen.kind === "sky" && (
              <div className="w-full">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f5c867]">JMV Ecuador, esta noche</p>
                <h2 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">Un solo cielo</h2>
                <FeastSky slug={slug} initial={sky} myComunidad={done ? me?.comunidad?.nombre : null} demo={Boolean(me?.user.isAdmin)} className="mt-6" />
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  {done && (
                    <FiestaButton tone="gold" onClick={onShare} disabled={sharing}>
                      {sharing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Share2 className="h-5 w-5" aria-hidden="true" />}
                      Compartir mi recuerdo
                    </FiestaButton>
                  )}
                  <FiestaButton tone="glass" onClick={onClose}>
                    Seguir con la fiesta
                  </FiestaButton>
                </div>
                <FeastWall
                  slug={slug}
                  fiestaId={fiestaId}
                  canUpload={Boolean(me)}
                  onNeedAuth={me ? undefined : onNeedAuth}
                  isAdmin={Boolean(me?.user.isAdmin)}
                  className="mt-12 border-t border-white/15 pt-10"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegación */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-4 pb-5 pt-3 sm:px-6">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={step === 0}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 font-semibold shadow-[0_3px_0_rgba(0,0,0,0.25)] transition hover:bg-white/15 active:translate-y-0.5 disabled:opacity-0"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Atrás
        </button>
        {!last && screen.kind !== "consecration" && (
          <button
            type="button"
            onClick={() => go(1)}
            disabled={screen.kind === "medal" && !ceremonyDone}
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#ffd36e] to-[#f0a81f] px-6 font-semibold text-[#3b2600] shadow-[0_4px_0_#9a6504,0_10px_24px_rgba(240,168,31,0.35)] transition active:translate-y-[3px] active:shadow-[0_1px_0_#9a6504] disabled:opacity-40"
          >
            {nextLabel} <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
