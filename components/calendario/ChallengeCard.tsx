"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

// "Tu reto de hoy" con un toggle "Lo haré". Solo se guarda en este navegador.
export default function ChallengeCard({ slug, challenge }: { slug: string; challenge: string }) {
  const reduce = useReducedMotion();
  const storageKey = `jmv-reto-${slug}`;
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      setDone(window.localStorage.getItem(storageKey) === "1");
    } catch {
      // Sin almacenamiento (modo privado): el toggle funciona igual en esta visita
    }
  }, [storageKey]);

  const toggle = () => {
    const next = !done;
    setDone(next);
    try {
      if (next) window.localStorage.setItem(storageKey, "1");
      else window.localStorage.removeItem(storageKey);
    } catch {}
  };

  return (
    <section
      aria-labelledby="reto-title"
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 transition-colors duration-500 sm:p-8",
        done ? "border-jmv-gold-text/60 bg-jmv-gold-text/10" : "border-white/15 bg-white/[0.04]",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-jmv-gold-text/15 text-jmv-gold-text">
          <HeartHandshake className="h-6 w-6" aria-hidden />
        </span>
        <h2 id="reto-title" className="font-display text-2xl font-semibold text-white">
          Tu reto de hoy
        </h2>
      </div>
      <p className="mt-4 text-lg leading-relaxed text-slate-100">{challenge}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          aria-pressed={done}
          onClick={toggle}
          className={cn(
            "inline-flex min-h-12 items-center gap-3 rounded-full border-2 px-5 text-base font-semibold transition-colors motion-safe:active:scale-95",
            done
              ? "border-jmv-gold bg-jmv-gold text-jmv-ink"
              : "border-white/40 text-white hover:border-jmv-gold-text hover:text-jmv-gold-text",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full border-2",
              done ? "border-jmv-ink bg-jmv-ink text-jmv-gold-text" : "border-current",
            )}
          >
            <AnimatePresence initial={false}>
              {done && (
                <motion.span
                  initial={reduce ? false : { scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          Lo haré
        </button>
        <p aria-live="polite" className="text-sm text-slate-200">
          {done ? "¡Bien! Cuéntale a tu comunidad cómo te fue." : ""}
        </p>
      </div>
    </section>
  );
}
