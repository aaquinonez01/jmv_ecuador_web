"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  HandHeart,
  Loader2,
  Lock,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import StarField from "@/components/calendario/StarField";
import {
  errorMessage,
  getDay,
  getFiesta,
  getMe,
  getResult,
  markPurpose,
  sendAnswers,
  statusOf,
} from "@/lib/fiestas/api";
import { longDate, pieceInfo } from "@/lib/fiestas/pieces";
import { dayPieceName, isMedal, symbolWords } from "@/lib/fiestas/symbol";
import { makeShareCard, shareCard } from "@/lib/fiestas/share-card";
import type { DayResult, FiestaDayContent, FiestaMe, FiestaPublic } from "@/lib/fiestas/types";
import { cn } from "@/lib/utils";
import AuthDialog from "./AuthDialog";
import FeastExperience from "./FeastExperience";
import FeastSky from "./FeastSky";
import FeastWall from "./FeastWall";
import Medal from "./Medal";
import { FEAST_ACCEPT } from "@/lib/fiestas/feast-medalla";
import FiestaSymbol from "./FiestaSymbol";
import RichText from "./RichText";
import { Confetti, FiestaButton, FiestaStyles, Glass, Sheet } from "./ui";

type Load =
  | { kind: "loading" }
  | { kind: "ready"; fiesta: FiestaPublic; day: FiestaDayContent }
  | { kind: "closed"; fiesta: FiestaPublic | null; message: string };

/** La Medalla completa (portada del día de la fiesta) */
const FEAST_ALL = new Set(["rayos", "globo", "serpiente", "inscripcion", "maria", "m", "cruz", "corazones", "estrellas", "medalla"]);
/** Destellos de la portada festiva (posiciones fijas) */
const FEAST_SPARKS = [
  { x: 8, y: 12, size: 18, dur: 3.2, delay: 0 },
  { x: 88, y: 9, size: 22, dur: 3.8, delay: 0.6 },
  { x: 16, y: 44, size: 14, dur: 2.9, delay: 1.1 },
  { x: 82, y: 38, size: 16, dur: 3.5, delay: 0.3 },
  { x: 6, y: 74, size: 20, dur: 4.1, delay: 1.6 },
  { x: 92, y: 68, size: 14, dur: 3.1, delay: 0.9 },
  { x: 28, y: 88, size: 16, dur: 3.6, delay: 0.4 },
  { x: 72, y: 90, size: 20, dur: 3.3, delay: 1.3 },
];

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function DayExperience({ slug, dayNumber }: { slug: string; dayNumber: number }) {
  const [state, setState] = useState<Load>({ kind: "loading" });
  const [me, setMe] = useState<FiestaMe | null>(null);
  const [result, setResult] = useState<DayResult | null>(null);
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [burst, setBurst] = useState(0);
  const [purposeBusy, setPurposeBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [sharing, setSharing] = useState(false);
  const [feast, setFeast] = useState(false);

  const load = useCallback(async () => {
    const [fiesta, m] = await Promise.all([getFiesta(slug).catch(() => null), getMe(slug)]);
    setMe(m);
    try {
      const day = await getDay(slug, dayNumber, Boolean(m?.user.isAdmin));
      if (!fiesta) throw new Error();
      setState({ kind: "ready", fiesta, day });
    } catch (e) {
      const s = statusOf(e);
      setState({
        kind: "closed",
        fiesta,
        message: s === 403 ? errorMessage(e) : s === 404 ? "Este día no existe." : "No pudimos cargar el día. Revisa tu internet.",
      });
      return;
    }
    setResult(await getResult(slug, dayNumber));
  }, [slug, dayNumber]);

  useEffect(() => {
    load();
  }, [load]);

  // Día de la fiesta de la Medalla: la celebración se abre sola la primera vez
  const feastDay = state.kind === "ready" && isMedal(state.fiesta) && state.day.piece === "medalla";
  useEffect(() => {
    if (!feastDay) return;
    const key = `jmv-fiesta-vista:${slug}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {
      // sin almacenamiento: se abre igual
    }
    setFeast(true);
  }, [feastDay, slug]);

  // La página misma está de fiesta: confeti al llegar y al volver de la celebración
  useEffect(() => {
    if (feastDay && !feast) setBurst((b) => b + 1);
  }, [feastDay, feast]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const earned = useMemo(() => {
    if (state.kind !== "ready") return new Set<string>();
    const done = new Set(me?.days.filter((d) => d.answered).map((d) => d.dayNumber));
    if (result?.answered) done.add(dayNumber);
    return new Set(state.fiesta.days.filter((d) => done.has(d.dayNumber)).map((d) => d.piece));
  }, [state, me, result, dayNumber]);

  if (state.kind === "loading") {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-16">
          <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-64 animate-pulse rounded-3xl bg-white/10" />
        </div>
      </Shell>
    );
  }

  if (state.kind === "closed") {
    return (
      <Shell>
        <div className="mx-auto max-w-xl px-4 pb-24 pt-32 text-center">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-white/10 text-[#f5c867]">
            {/todav[ií]a no/i.test(state.message) ? <Lock className="h-8 w-8" /> : <Clock className="h-8 w-8" />}
          </span>
          <h1 className="font-display text-3xl font-semibold">{state.message}</h1>
          <p className="mt-3 text-white/70">Vuelve pronto: cada día se abre a la medianoche (hora de Ecuador).</p>
          <Link
            href={`/fiestas/${slug}`}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 font-semibold shadow-[0_3px_0_rgba(0,0,0,0.25)]"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
        </div>
      </Shell>
    );
  }

  const { fiesta, day } = state;
  const medal = isMedal(fiesta);
  const words = symbolWords(fiesta);
  const summary = fiesta.days.find((d) => d.dayNumber === dayNumber);
  const piece = { ...pieceInfo(day.piece), name: dayPieceName(fiesta, summary ?? day) };
  /** Con este día quedó completo el símbolo */
  const complete = medal ? day.piece === "medalla" : fiesta.days.every((d) => earned.has(d.piece));
  const q = day.questions[step];
  const idx = fiesta.days.findIndex((d) => d.dayNumber === dayNumber);
  const prev = fiesta.days[idx - 1];
  const next = fiesta.days[idx + 1];
  const answered = Boolean(result?.answered);
  const isAdmin = Boolean(me?.user.isAdmin);

  const choose = (i: number) => {
    setPicks((p) => {
      const n = [...p];
      n[step] = i;
      return n;
    });
  };

  const submit = async () => {
    setSending(true);
    setError("");
    try {
      const r = await sendAnswers(slug, dayNumber, picks);
      setResult({ ...r, answered: true });
      setBurst((b) => b + 1);
      setCelebrate(true);
      setMe(await getMe(slug));
    } catch (e) {
      if (statusOf(e) === 409) {
        setResult(await getResult(slug, dayNumber));
      } else if (statusOf(e) === 401) {
        setAuth(true);
      } else setError(errorMessage(e));
    } finally {
      setSending(false);
    }
  };

  const purpose = async () => {
    if (!me) return setAuth(true);
    setPurposeBusy(true);
    try {
      const r = await markPurpose(slug, dayNumber);
      setResult((res) => ({ ...(res ?? { answered: false }), purposeDone: true }));
      if (r.points) {
        setToast(`+${r.points} puntos por cumplir tu propósito 💛`);
        setBurst((b) => b + 1);
      }
      setMe(await getMe(slug));
    } catch (e) {
      setToast(errorMessage(e));
    } finally {
      setPurposeBusy(false);
    }
  };

  const share = async () => {
    setSharing(true);
    try {
      const url = `${window.location.host}/fiestas/${slug}`;
      const blob = await makeShareCard({
        fiestaTitle: fiesta.title,
        headline: complete ? `¡Completé mi ${words.name}!` : `Completé el ${day.label.toLowerCase()}`,
        piece: `✦ ${piece.name}`,
        earned: [...earned],
        face: piece.face === "back" ? "back" : "front",
        progress: complete ? undefined : `${earned.size} de ${fiesta.days.length} ${words.pieces} de mi ${words.name}`,
        layers: medal
          ? undefined
          : {
              base: fiesta.symbol?.image ?? null,
              images: fiesta.days.filter((d) => d.layerImage && earned.has(d.piece)).map((d) => d.layerImage!),
            },
        footer: "JMV Ecuador",
        url,
      });
      const res = await shareCard(blob);
      if (res === "downloaded") setToast("Imagen descargada: súbela a tu estado o historia ✨");
    } catch {
      setToast("No se pudo crear la imagen.");
    } finally {
      setSharing(false);
    }
  };

  /** Imagen de recuerdo del día de la fiesta: la Medalla completa con su nombre */
  const shareFeast = async () => {
    setSharing(true);
    try {
      const year = fiesta.feastDate.slice(0, 4);
      const blob = await makeShareCard({
        fiestaTitle: fiesta.title,
        headline: FEAST_ACCEPT.shareHeadline,
        piece: me?.user.name ?? "JMV Ecuador",
        earned: [...fiesta.days.map((d) => d.piece), "medalla"],
        face: "front",
        progress: [me?.comunidad?.nombre, `${longDate(fiesta.feastDate)} de ${year}`].filter(Boolean).join(" · "),
        footer: "JMV Ecuador",
        url: `${window.location.host}/fiestas/${slug}`,
      });
      const res = await shareCard(blob, "jmv-medalla-milagrosa.png");
      if (res === "downloaded") setToast("Imagen descargada: súbela a tu estado o historia ✨");
    } catch {
      setToast("No se pudo crear la imagen.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <Shell>
      <Confetti burst={burst} />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-24 sm:pt-28">
        <Link
          href={`/fiestas/${slug}`}
          className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold shadow-[0_3px_0_rgba(0,0,0,0.25)] transition hover:bg-white/15 active:translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {fiesta.title}
        </Link>

        {isAdmin && <AdminBanner />}

        {/* Encabezado del día */}
        <header className="grid items-center gap-6 sm:grid-cols-[1fr_150px]">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f5b83d] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3b2600] shadow-[0_2px_0_#9a6504]">
                {day.label}
              </span>
              <span className="text-sm text-white/70 first-letter:uppercase">{longDate(day.date)}</span>
              {day.isToday && (
                <span className="rounded-full bg-[#d3302f] px-2.5 py-0.5 text-xs font-bold uppercase text-white shadow-[0_2px_0_#8f1f1e]">
                  Hoy
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{day.title}</h1>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-[#ffe7a3]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {answered ? "Ganaste" : "Hoy puedes ganar"}: <strong>{piece.name}</strong>
            </p>
          </div>
          <div className="mx-auto w-[130px] sm:w-[150px]">
            <FiestaSymbol
              fiesta={fiesta}
              earned={earned}
              initialFace={piece.face === "back" ? "back" : "front"}
              showFlip={false}
              key={piece.face}
            />
          </div>
        </header>

        {/* Día de la fiesta: portada festiva, el cielo y el recuerdo de todos */}
        {feastDay && (
          <>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-8 overflow-hidden rounded-[2rem] border border-[#f5b83d]/60 bg-[#0b1a33] px-6 pb-8 pt-10 text-center shadow-[0_4px_0_rgba(154,101,4,0.55),0_24px_60px_-16px_rgba(245,184,61,0.55)] sm:px-10"
            >
              <div
                aria-hidden="true"
                className="fiesta-rays absolute left-1/2 top-40 -ml-[450px] -mt-[450px] h-[900px] w-[900px] opacity-60 [background:repeating-conic-gradient(from_0deg,rgba(245,184,61,0.26)_0deg_4deg,transparent_4deg_15deg)] [mask-image:radial-gradient(circle,black_20%,transparent_66%)]"
              />
              {/* destellos que flotan */}
              {FEAST_SPARKS.map((p, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="absolute text-[#ffe7a3]"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
                  animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.25, 0.7], y: [0, -10, 0] }}
                  transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✦
                </motion.span>
              ))}

              <p className="relative inline-block rounded-full bg-[#f5b83d] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#3b2600] shadow-[0_3px_0_#9a6504]">
                ¡Hoy es la fiesta!
              </p>
              <div className="fiesta-float relative mx-auto mt-6 w-44 sm:w-52">
                <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-[#f5b83d]/40 blur-3xl" />
                <Medal earned={FEAST_ALL} showFlip={false} />
              </div>
              <h2
                className="font-display relative mt-6 bg-gradient-to-b from-[#fff3c4] via-[#f5c867] to-[#e0a11c] bg-clip-text text-4xl font-semibold leading-tight sm:text-5xl"
                style={{ color: "transparent" }}
              >
                Nuestra Señora de la Medalla Milagrosa
              </h2>
              <p className="font-display relative mx-auto mt-3 max-w-md text-xl italic" style={{ color: "#fff" }}>
                «Oh María, sin pecado concebida, ruega por nosotros que recurrimos a ti»
              </p>
              <div className="relative mt-5 flex flex-wrap justify-center gap-2 text-sm font-semibold">
                {["27 de noviembre de 1830", `${Number(fiesta.feastDate.slice(0, 4)) - 1830} años después`, "JMV Ecuador"].map((t) => (
                  <span key={t} className="rounded-full px-3.5 py-1.5" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(245,184,61,0.5)", color: "#ffe7a3" }}>
                    {t}
                  </span>
                ))}
              </div>
              <FiestaButton tone="gold" className="relative mt-7 px-8 text-lg" onClick={() => setFeast(true)}>
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Vivir la fiesta
              </FiestaButton>
              <p className="relative mx-auto mt-3 max-w-sm text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                Revive las apariciones, completa tu Medalla y recíbela en tu corazón junto a todo JMV Ecuador.
              </p>
            </motion.section>

            <FeastSky
              slug={slug}
              title="Un solo cielo"
              myComunidad={me?.comunidad?.nombre}
              hideEmpty
              demo={isAdmin}
              className="mt-6 rounded-[2rem] bg-[#0b1a33] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:p-8"
            />
            <FeastWall
              slug={slug}
              fiestaId={fiesta.id}
              canUpload={Boolean(me)}
              onNeedAuth={me ? undefined : () => setAuth(true)}
              isAdmin={isAdmin}
              className="mt-6 rounded-[2rem] bg-[#0b1a33] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:p-8"
            />
          </>
        )}

        {/* Oraciones de todos los días (plegables) */}
        {day.dailyPrayers && (
          <details className="group mt-10 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.05] shadow-[0_4px_0_rgba(0,0,0,0.3)]">
            <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-5 py-3 font-semibold text-white [&::-webkit-details-marker]:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-[#f5c867]">
                <HandHeart className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex-1">
                Oraciones para todos los días
                <span className="block text-xs font-normal text-white/55">Para empezar la jornada · toca para abrir</span>
              </span>
              <ArrowRight className="h-5 w-5 text-white/50 transition group-open:rotate-90" aria-hidden="true" />
            </summary>
            <div className="border-t border-white/10 px-5 py-5 text-[16px]">
              <RichText text={day.dailyPrayers} />
            </div>
          </details>
        )}

        {/* Tema */}
        {day.theme && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={day.dailyPrayers ? "mt-6" : "mt-10"}>
            <Glass className="p-6 sm:p-8">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#f5c867]">
                <BookOpen className="h-4 w-4" aria-hidden="true" /> El camino de hoy
              </h2>
              <div className="text-[17px]">
                <RichText text={day.theme} />
              </div>
              {day.source && <p className="mt-5 text-xs text-white/50">Fuente: {day.source}</p>}
            </Glass>
          </motion.section>
        )}

        {/* Oración */}
        {day.prayer && (
          <section className="mt-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#f5b83d]/50 bg-gradient-to-br from-[#f5b83d]/20 via-[#f5b83d]/5 to-transparent p-6 shadow-[0_18px_40px_-20px_rgba(245,184,61,0.5)] sm:p-8">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#f5c867]">Oración</h2>
              <p className="whitespace-pre-line font-display text-xl italic leading-relaxed text-white">{day.prayer}</p>
            </div>
          </section>
        )}

        {/* Preguntas */}
        {day.questions.length > 0 && (
          <section className="mt-10" aria-labelledby="preguntas">
            <h2 id="preguntas" className="mb-4 font-display text-3xl font-semibold">
              {answered ? "Tus respuestas" : "Responde y gana puntos"}
            </h2>

            {!me && !answered ? (
              <Glass className="p-6 text-center">
                <p className="text-lg font-semibold">Crea tu cuenta para responder</p>
                <p className="mt-1 text-white/70">Solo tu nombre, tu comunidad, tu correo y una contraseña.</p>
                <FiestaButton tone="gold" className="mt-5" onClick={() => setAuth(true)}>
                  Crear cuenta o entrar <ArrowRight className="h-5 w-5" />
                </FiestaButton>
              </Glass>
            ) : answered && result?.questions ? (
              <div className="space-y-4">
                <Glass className="flex items-center gap-4 p-5">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#f5b83d] text-2xl font-bold text-[#3b2600] shadow-[0_4px_0_#9a6504]">
                    {result.correct}/{result.total}
                  </span>
                  <div>
                    <p className="text-lg font-semibold">
                      {result.correct === result.total ? "¡Perfecto! 🎉" : result.correct ? "¡Bien hecho!" : "¡Gracias por participar!"}
                    </p>
                    <p className="text-sm text-white/70">
                      Ganaste <strong className="text-[#f5c867]">{result.points} puntos</strong>
                      {result.onTime ? " (incluye el bono por responder hoy)" : ""}.
                    </p>
                  </div>
                </Glass>
                {result.questions.map((rq, i) => (
                  <Glass key={rq.id} className="p-5">
                    <p className="mb-3 font-semibold">
                      {i + 1}. {rq.prompt}
                    </p>
                    <ul className="space-y-2">
                      {rq.options.map((o, oi) => {
                        const correct = oi === rq.correctIndex;
                        const mine = oi === rq.yours;
                        return (
                          <li
                            key={oi}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm",
                              correct
                                ? "border-[#2fa36b] bg-[#2fa36b]/20"
                                : mine
                                  ? "border-[#d3302f] bg-[#d3302f]/20"
                                  : "border-white/10 bg-white/[0.03] text-white/70",
                            )}
                          >
                            {correct ? (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#4fd18f]" aria-label="Correcta" />
                            ) : mine ? (
                              <X className="h-5 w-5 shrink-0 text-[#ff8a8a]" aria-label="Tu respuesta" />
                            ) : (
                              <span className="w-5 shrink-0 text-center text-xs font-bold text-white/40">{LETTERS[oi]}</span>
                            )}
                            {o}
                          </li>
                        );
                      })}
                    </ul>
                    {rq.explanation && <p className="mt-3 text-sm text-white/70">💡 {rq.explanation}</p>}
                  </Glass>
                ))}
              </div>
            ) : (
              q && (
                <Glass className="overflow-hidden p-5 sm:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#f5b83d] to-[#ffe7a3]"
                        animate={{ width: `${((step + (picks[step] != null ? 1 : 0)) / day.questions.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-white/70">
                      {step + 1} de {day.questions.length}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="mb-5 text-xl font-semibold leading-snug">{q.prompt}</p>
                      <div className="grid gap-3">
                        {q.options.map((o, i) => {
                          const on = picks[step] === i;
                          return (
                            <motion.button
                              key={i}
                              type="button"
                              whileTap={{ scale: 0.98 }}
                              onClick={() => choose(i)}
                              aria-pressed={on}
                              className={cn(
                                "flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left font-medium transition",
                                on
                                  ? "border-[#f5b83d] bg-[#f5b83d] text-[#3b2600] shadow-[0_4px_0_#9a6504]"
                                  : "border-white/20 bg-white/[0.08] text-white shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:bg-white/15 active:translate-y-1 active:shadow-none",
                              )}
                            >
                              <span
                                className={cn(
                                  "grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold",
                                  on ? "bg-[#3b2600] text-[#f5c867]" : "bg-white/15",
                                )}
                              >
                                {on ? <Check className="h-4 w-4" strokeWidth={3} /> : LETTERS[i]}
                              </span>
                              {o}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  {error && <p className="mt-4 rounded-2xl bg-[#d3302f]/25 px-4 py-3 text-sm">{error}</p>}
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <FiestaButton tone="glass" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                      <ArrowLeft className="h-4 w-4" /> Atrás
                    </FiestaButton>
                    {step < day.questions.length - 1 ? (
                      <FiestaButton tone="white" disabled={picks[step] == null} onClick={() => setStep((s) => s + 1)}>
                        Siguiente <ArrowRight className="h-4 w-4" />
                      </FiestaButton>
                    ) : (
                      <FiestaButton
                        tone="gold"
                        disabled={sending || day.questions.some((_, i) => picks[i] == null)}
                        onClick={submit}
                      >
                        {sending && <Loader2 className="h-5 w-5 animate-spin" />}
                        Enviar respuestas
                      </FiestaButton>
                    )}
                  </div>
                  <p className="mt-4 text-center text-xs text-white/50">
                    Solo tienes una oportunidad. {day.isToday ? "Si respondes hoy, ganas un bono extra." : ""}
                  </p>
                </Glass>
              )
            )}
          </section>
        )}

        {/* Propósito */}
        {day.purpose && (
          <section className="mt-10">
            <div
              className={cn(
                "rounded-3xl border p-6 sm:p-8",
                result?.purposeDone
                  ? "border-[#2fa36b]/60 bg-[#2fa36b]/15"
                  : "border-white/15 bg-gradient-to-br from-[#d3302f]/20 to-transparent shadow-[0_18px_40px_-22px_rgba(211,48,47,0.6)]",
              )}
            >
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#ffb4b3]">
                <HandHeart className="h-4 w-4" aria-hidden="true" /> Propósito del día
              </h2>
              <p className="whitespace-pre-line text-lg leading-relaxed text-white">{day.purpose}</p>
              <div className="mt-5">
                {result?.purposeDone ? (
                  <p className="inline-flex items-center gap-2 font-semibold text-[#7be3ad]">
                    <CheckCircle2 className="h-5 w-5" /> ¡Lo cumpliste! Gracias por servir.
                  </p>
                ) : (
                  <FiestaButton tone="red" onClick={purpose} disabled={purposeBusy}>
                    {purposeBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                    Lo cumplí
                  </FiestaButton>
                )}
              </div>
            </div>
          </section>
        )}

        {answered && (
          <div className="mt-8 text-center">
            <FiestaButton tone="glass" onClick={share} disabled={sharing}>
              {sharing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Share2 className="h-5 w-5" />}
              Compartir en mi estado
            </FiestaButton>
          </div>
        )}

        {/* Navegación entre días */}
        <nav className="mt-12 grid grid-cols-2 gap-3" aria-label="Otros días">
          {prev ? (
            <DayLink slug={slug} d={prev} dir="prev" preview={isAdmin} />
          ) : (
            <span />
          )}
          {next ? <DayLink slug={slug} d={next} dir="next" preview={isAdmin} /> : <span />}
        </nav>
      </div>

      {/* Celebración: pieza ganada */}
      <Sheet open={celebrate} onClose={() => setCelebrate(false)} title={medal ? "¡Nueva pieza!" : "¡Lo lograste!"}>
        <div className="text-center">
          <div className="mx-auto w-48">
            <FiestaSymbol fiesta={fiesta} earned={earned} highlight={day.piece} initialFace={piece.face === "back" ? "back" : "front"} showFlip={false} />
          </div>
          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-[#f5c867]">Ganaste</p>
          <p className="font-display text-3xl font-semibold">{piece.name}</p>
          <p className="mt-2 text-white/75">
            {result?.correct}/{result?.total} correctas · <strong className="text-[#f5c867]">+{result?.points} puntos</strong>
          </p>
          <div className="mt-6 grid gap-3">
            <FiestaButton tone="gold" onClick={share} disabled={sharing}>
              {sharing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Share2 className="h-5 w-5" />}
              Compartir en mi estado
            </FiestaButton>
            <FiestaButton tone="glass" onClick={() => setCelebrate(false)}>
              Ver mis respuestas
            </FiestaButton>
          </div>
        </div>
      </Sheet>

      {feast && (
        <FeastExperience
          slug={slug}
          fiestaId={fiesta.id}
          fiestaTitle={fiesta.title}
          me={me}
          onClose={() => setFeast(false)}
          onNeedAuth={() => setAuth(true)}
          onShare={shareFeast}
          sharing={sharing}
        />
      )}

      <AuthDialog
        open={auth}
        onClose={() => setAuth(false)}
        onDone={() => {
          setAuth(false);
          load();
        }}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed inset-x-4 bottom-6 z-[96] mx-auto max-w-md rounded-2xl bg-white px-5 py-4 text-center font-semibold text-[#0f2547] shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

function DayLink({ slug, d, dir, preview = false }: { slug: string; d: FiestaPublic["days"][number]; dir: "prev" | "next"; preview?: boolean }) {
  const open = d.state === "open" || preview;
  const inner = (
    <span
      className={cn(
        "flex min-h-16 items-center gap-3 rounded-2xl border px-4 py-3",
        dir === "next" && "flex-row-reverse text-right",
        open
          ? "border-white/20 bg-white/[0.08] shadow-[0_4px_0_rgba(0,0,0,0.3)] transition hover:bg-white/15 active:translate-y-1 active:shadow-none"
          : "border-white/10 bg-white/[0.03] text-white/50",
      )}
    >
      {dir === "prev" ? <ArrowLeft className="h-5 w-5 shrink-0" /> : open ? <ArrowRight className="h-5 w-5 shrink-0" /> : <Lock className="h-5 w-5 shrink-0" />}
      <span className="min-w-0">
        <span className="block text-xs text-white/60">{d.label}</span>
        <span className="block truncate text-sm font-semibold">{d.title ?? (open ? "Vista previa" : d.state === "soon" ? "En preparación" : "Aún no empieza")}</span>
      </span>
    </span>
  );
  return open ? <Link href={`/fiestas/${slug}/dia/${d.dayNumber}`}>{inner}</Link> : inner;
}

export function AdminBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#f5b83d]/60 bg-[#f5b83d]/15 p-4 text-sm sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <span className="mb-1.5 inline-block rounded-full bg-[#f5b83d] px-2.5 py-0.5 text-xs font-bold uppercase text-[#3b2600]">Modo prueba</span>
        <p className="leading-snug text-white/85">
          Como administrador puedes abrir todos los días antes de su fecha. Tus puntos no se suman y no apareces en el ranking.
        </p>
      </div>
      {children}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div data-fiesta className="relative isolate min-h-screen overflow-hidden bg-[#070d1d] text-white">
      <FiestaStyles />
      <div
        aria-hidden="true"
        className="fiesta-sky absolute inset-0 -z-20 bg-[radial-gradient(90%_50%_at_50%_0%,#1d4e8a_0%,#0f2547_45%,#070d1d_100%)]"
      />
      <StarField count={110} seed={827} className="-z-10 h-[1200px]" />
      {children}
    </div>
  );
}
