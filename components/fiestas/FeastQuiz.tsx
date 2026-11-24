"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { errorMessage, getResult, sendAnswers, statusOf } from "@/lib/fiestas/api";
import type { DayResult, FiestaDayContent } from "@/lib/fiestas/types";
import { cn } from "@/lib/utils";
import { FiestaButton } from "./ui";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Las preguntas del día de la fiesta, dentro de la celebración: una por pantalla.
// Al terminar se envían todas y se muestra cuántas acertó, con su explicación.
export default function FeastQuiz({
  slug,
  dayNumber,
  questions,
  result,
  loggedIn,
  onNeedAuth,
  onAnswered,
}: {
  slug: string;
  dayNumber: number;
  questions: FiestaDayContent["questions"];
  result: DayResult | null;
  loggedIn: boolean;
  onNeedAuth: () => void;
  onAnswered: (r: DayResult) => void;
}) {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (answers: number[]) => {
    if (!loggedIn) return onNeedAuth();
    setSending(true);
    setError("");
    try {
      const r = await sendAnswers(slug, dayNumber, answers);
      onAnswered({ ...r, answered: true });
    } catch (e) {
      if (statusOf(e) === 409) {
        const r = await getResult(slug, dayNumber);
        if (r) onAnswered(r);
      } else if (statusOf(e) === 401) onNeedAuth();
      else setError(errorMessage(e));
    } finally {
      setSending(false);
    }
  };

  // ── Ya respondió: resultado y repaso ──
  if (result?.answered) {
    const total = result.total ?? questions.length;
    return (
      <div className="w-full">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f5c867]">Lo que caminaste</p>
        <p className="font-display mt-3 text-7xl font-semibold text-[#f5c867]">
          {result.correct ?? 0}
          <span className="text-3xl text-white/60"> de {total}</span>
        </p>
        <p className="mt-2 text-lg text-white/85">
          {(result.correct ?? 0) === total ? "¡Todas! Se nota que viviste la novena." : "Respuestas correctas"}
          {typeof result.points === "number" && <strong className="text-[#ffe7a3]"> · +{result.points} puntos</strong>}
        </p>
        <ul className="mx-auto mt-6 max-w-lg space-y-3 text-left">
          {(result.questions ?? []).map((q, i) => {
            const ok = q.yours === q.correctIndex;
            return (
              <li key={q.id} className={cn("rounded-2xl border p-4", ok ? "border-[#2fa36b]/60 bg-[#2fa36b]/15" : "border-[#e2504f]/60 bg-[#e2504f]/12")}>
                <p className="flex items-start gap-2 font-semibold">
                  <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", ok ? "bg-[#2fa36b]" : "bg-[#d3302f]")}>
                    {ok ? <Check className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
                  </span>
                  <span>
                    {i + 1}. {q.prompt}
                  </span>
                </p>
                <p className="mt-2 pl-8 text-[15px] text-white/90">
                  <span className="text-white/60">{ok ? "Respondiste: " : "La respuesta: "}</span>
                  {q.options[q.correctIndex]}
                </p>
                {q.explanation && <p className="mt-1.5 pl-8 text-sm text-white/70">{q.explanation}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (questions.length === 0) return <p className="text-white/70">Hoy no hay preguntas.</p>;

  // ── Respondiendo ──
  const q = questions[step];
  const picked = picks[step];
  const last = step === questions.length - 1;

  return (
    <div className="w-full">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f5c867]">Lo que caminaste en la novena</p>
      <p className="mt-2 text-sm text-white/65">
        Pregunta {step + 1} de {questions.length}
      </p>
      <div className="mx-auto mt-3 flex max-w-xs gap-1.5" aria-hidden="true">
        {questions.map((x, i) => (
          <span key={x.id} className={cn("h-1.5 flex-1 rounded-full", i < step ? "bg-[#f5c867]" : i === step ? "bg-white" : "bg-white/20")} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <h2 className="font-display mx-auto mt-6 max-w-lg text-2xl font-semibold leading-snug sm:text-3xl">{q.prompt}</h2>
          <div role="radiogroup" aria-label={q.prompt} className="mx-auto mt-6 grid max-w-lg gap-3 text-left">
            {q.options.map((o, i) => {
              const on = picked === i;
              return (
                <button
                  key={o}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPicks((p) => Object.assign([...p], { [step]: i }))}
                  className={cn(
                    "flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition active:translate-y-0.5",
                    on
                      ? "border-[#f5b83d] bg-[#f5b83d] text-[#3b2600] shadow-[0_4px_0_#9a6504]"
                      : "border-white/25 bg-white/10 text-white shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:bg-white/15",
                  )}
                >
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold", on ? "bg-[#3b2600] text-[#ffd36e]" : "bg-white/15")}>
                    {LETTERS[i]}
                  </span>
                  {o}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {error && (
        <p role="alert" className="mx-auto mt-4 max-w-lg rounded-2xl bg-[#d3302f]/25 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col items-center gap-2">
        <FiestaButton
          tone="gold"
          className="px-7 text-base"
          disabled={picked === undefined || sending}
          onClick={() => (last ? submit(picks) : setStep((s) => s + 1))}
        >
          {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
          {last ? (loggedIn ? "Enviar mis respuestas" : "Entra para enviarlas") : "Siguiente pregunta"}
          {!sending && <ArrowRight className="h-5 w-5" aria-hidden="true" />}
        </FiestaButton>
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="min-h-11 px-3 text-sm font-semibold text-white/70 underline-offset-4 hover:underline">
            Volver a la pregunta anterior
          </button>
        )}
      </div>
    </div>
  );
}
