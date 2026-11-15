"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera, LogOut, Sparkles, Trophy, Users } from "lucide-react";
import StarField from "@/components/calendario/StarField";
import { getFiesta, getMe, logout } from "@/lib/fiestas/api";
import { daysBetween, longDate, pieceInfo, PIECES } from "@/lib/fiestas/pieces";
import type { FiestaMe, FiestaPublic } from "@/lib/fiestas/types";
import AuthDialog from "./AuthDialog";
import CommunityPanel from "./CommunityPanel";
import DayPath from "./DayPath";
import Medal from "./Medal";
import Mural from "./Mural";
import Ranking from "./Ranking";
import { FiestaButton, FiestaStyles, Glass } from "./ui";

function SectionTitle({ kicker, title, icon: Icon }: { kicker: string; title: string; icon: typeof Sparkles }) {
  return (
    <div className="mb-6 flex items-end gap-3">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f5b83d] text-[#3b2600] shadow-[0_4px_0_#9a6504]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f5c867]">{kicker}</p>
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      </div>
    </div>
  );
}

export default function FiestaHome({ initial }: { initial: FiestaPublic }) {
  const [fiesta, setFiesta] = useState(initial);
  const [me, setMe] = useState<FiestaMe | null>(null);
  const [ready, setReady] = useState(false);
  const [auth, setAuth] = useState<null | "registro" | "entrar">(null);
  const [refresh, setRefresh] = useState(0);

  const slug = fiesta.slug;
  const load = useCallback(async () => {
    const [f, m] = await Promise.all([getFiesta(slug).catch(() => null), getMe(slug)]);
    if (f) setFiesta(f);
    setMe(m);
    setReady(true);
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const earned = useMemo(() => {
    const done = new Set(me?.days.filter((d) => d.answered).map((d) => d.dayNumber));
    return new Set(fiesta.days.filter((d) => done.has(d.dayNumber)).map((d) => d.piece));
  }, [me, fiesta.days]);

  const today = fiesta.days.find((d) => d.isToday && d.state === "open");
  const nextOpen = today ?? fiesta.days.filter((d) => d.state === "open").at(-1);
  const toFeast = daysBetween(fiesta.today, fiesta.feastDate);
  const first = fiesta.days[0];
  const startsIn = first ? daysBetween(fiesta.today, first.date) : 0;
  const totalPieces = fiesta.days.length;

  return (
    <div data-tone="dark" className="relative isolate overflow-hidden bg-[#070d1d] text-white">
      <FiestaStyles />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(90%_60%_at_50%_0%,#1d4e8a_0%,#0f2547_45%,#070d1d_100%)]"
      />
      <StarField count={140} seed={1127} className="-z-10 h-[1400px]" />

      {/* ── Portada ── */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-28 sm:pt-32 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f5b83d]/40 bg-[#f5b83d]/10 px-4 py-1.5 text-sm font-semibold text-[#f5c867]"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {toFeast > 0 ? `Faltan ${toFeast} ${toFeast === 1 ? "día" : "días"} para la fiesta` : toFeast === 0 ? "¡Hoy es la fiesta!" : "Gracias por vivirla"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-semibold leading-[1.05] sm:text-6xl"
          >
            {fiesta.title}
          </motion.h1>
          {fiesta.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-white/80"
            >
              {fiesta.subtitle}
            </motion.p>
          )}
          {fiesta.intro && <p className="mx-auto mt-4 max-w-xl whitespace-pre-line text-white/70 lg:mx-0">{fiesta.intro}</p>}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            {!ready ? (
              <div className="h-12 w-64 animate-pulse rounded-2xl bg-white/10" />
            ) : me ? (
              <>
                {nextOpen ? (
                  <Link
                    href={`/fiestas/${slug}/dia/${nextOpen.dayNumber}`}
                    className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#ffd36e] to-[#f0a81f] px-6 text-base font-semibold text-[#3b2600] shadow-[0_4px_0_#9a6504,0_10px_24px_rgba(240,168,31,0.35)] transition active:translate-y-[3px] active:shadow-[0_1px_0_#9a6504]"
                  >
                    {today ? `Vivir el ${today.label.toLowerCase()}` : `Ir al ${nextOpen.label.toLowerCase()}`}
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                ) : (
                  <p className="rounded-2xl bg-white/10 px-5 py-3 text-white/85">
                    {startsIn > 0 ? `Empezamos el ${longDate(first.date)}. ¡Te esperamos!` : "Pronto se abre el primer día."}
                  </p>
                )}
                <FiestaButton
                  tone="glass"
                  onClick={async () => {
                    await logout();
                    setMe(null);
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Salir
                </FiestaButton>
              </>
            ) : (
              <>
                <FiestaButton tone="gold" className="px-7 text-base" onClick={() => setAuth("registro")}>
                  Únete a la novena
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </FiestaButton>
                <FiestaButton tone="glass" onClick={() => setAuth("entrar")}>
                  Ya tengo cuenta
                </FiestaButton>
              </>
            )}
          </motion.div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {me && (
              <Glass className="px-5 py-3 text-left">
                <p className="text-xs text-white/60">Hola, {me.user.name}</p>
                <p className="text-xl font-bold text-[#f5c867]">
                  {me.totalPoints} <span className="text-sm font-semibold text-white/70">puntos</span>
                </p>
              </Glass>
            )}
            <Glass className="px-5 py-3 text-left">
              <p className="text-xs text-white/60">Ya participan</p>
              <p className="text-xl font-bold">
                {fiesta.participants} <span className="text-sm font-semibold text-white/70">{fiesta.participants === 1 ? "joven" : "jóvenes"}</span>
                <span className="text-sm font-semibold text-white/70">
                  {" "}
                  de {fiesta.comunidades} {fiesta.comunidades === 1 ? "comunidad" : "comunidades"}
                </span>
              </p>
            </Glass>
          </div>
        </div>

        {/* Medalla */}
        <div className="relative mx-auto w-full max-w-[250px] sm:max-w-[320px]">
          <div
            aria-hidden="true"
            className="fiesta-rays absolute -inset-24 -z-10 opacity-40 [background:repeating-conic-gradient(from_0deg,rgba(245,184,61,0.22)_0deg_4deg,transparent_4deg_15deg)] [mask-image:radial-gradient(circle,black_25%,transparent_68%)]"
          />
          <div className="fiesta-float">
            <Medal earned={earned} />
          </div>
          <p className="mt-3 text-center text-sm text-white/75">
            {me ? (
              <>
                Llevas <strong className="text-[#f5c867]">{earned.size}</strong> de {totalPieces} piezas
              </>
            ) : (
              "Cada día completado suma una pieza a tu Medalla"
            )}
          </p>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      {!me && ready && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Entra cada día", "Lee el tema del día y su oración."],
              ["2", "Responde y suma", "Contesta las preguntas: cada acierto da puntos para ti y tu comunidad."],
              ["3", "Arma tu Medalla", "Cada día ganas una pieza. El 27 la completas."],
            ].map(([n, t, d], i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Glass className="flex h-full gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-lg font-bold text-[#0f2547] shadow-[0_3px_0_rgba(0,0,0,0.3)]">
                    {n}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{t}</p>
                    <p className="text-sm text-white/70">{d}</p>
                  </div>
                </Glass>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Camino de los días ── */}
      <section id="dias" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20">
        <SectionTitle kicker="Día a día" title="El camino de la novena" icon={Sparkles} />
        <DayPath slug={slug} days={fiesta.days} me={me} />
        {me && earned.size > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {PIECES.filter((p) => earned.has(p.id)).map((p) => (
              <span
                key={p.id}
                className="rounded-full border border-[#f5b83d]/50 bg-[#f5b83d]/15 px-3 py-1 text-xs font-semibold text-[#ffe7a3]"
              >
                ✦ {pieceInfo(p.id).name}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── Comunidad ── */}
      {me && (
        <section id="comunidad" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20">
          <SectionTitle kicker="Juntos" title="Tu comunidad" icon={Users} />
          <CommunityPanel slug={slug} days={fiesta.days} onChanged={() => setRefresh((r) => r + 1)} />
        </section>
      )}

      {/* ── Ranking ── */}
      <section id="ranking" className="mx-auto max-w-3xl scroll-mt-24 px-4 pb-20">
        <SectionTitle kicker="Así vamos" title="Ranking" icon={Trophy} />
        <Ranking slug={slug} myComunidadId={me?.comunidad?.id} refreshKey={refresh} />
      </section>

      {/* ── Mural ── */}
      <section id="mural" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24">
        <SectionTitle kicker="Así lo vivimos" title="Mural de las comunidades" icon={Camera} />
        <Mural slug={slug} days={fiesta.days} onNeedAuth={() => setAuth("registro")} refreshKey={refresh} />
      </section>

      <AuthDialog
        open={auth !== null}
        initialTab={auth ?? "registro"}
        onClose={() => setAuth(null)}
        onDone={() => {
          setAuth(null);
          setRefresh((r) => r + 1);
          load();
        }}
      />
    </div>
  );
}
