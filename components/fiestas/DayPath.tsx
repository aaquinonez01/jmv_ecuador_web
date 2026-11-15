"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Clock, Lock, Sparkles } from "lucide-react";
import type { FiestaDaySummary, FiestaMe } from "@/lib/fiestas/types";
import { pieceInfo, shortDate } from "@/lib/fiestas/pieces";
import { cn } from "@/lib/utils";

// El camino de los días: hechos (oro), hoy (late), abiertos, en preparación y bloqueados.

export default function DayPath({
  slug,
  days,
  me,
  preview = false,
}: {
  slug: string;
  days: FiestaDaySummary[];
  me: FiestaMe | null;
  /** Administradores: todos los días se pueden abrir */
  preview?: boolean;
}) {
  const done = new Set(me?.days.filter((d) => d.answered).map((d) => d.dayNumber));

  return (
    <ol className="relative grid grid-cols-2 gap-3 lg:grid-cols-5">
      {days.map((d, i) => {
        const isDone = done.has(d.dayNumber);
        const isFeast = d.piece === "medalla";
        const clickable = d.state === "open" || preview;
        const card = (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 5) * 0.06 }}
            className={cn(
              "group relative flex h-full flex-col gap-2 overflow-hidden rounded-3xl border p-3.5 transition sm:p-4",
              isDone
                ? "border-[#f5b83d]/60 bg-gradient-to-br from-[#f5b83d]/25 to-[#f5b83d]/5 shadow-[0_4px_0_rgba(154,101,4,0.55),0_14px_30px_-10px_rgba(245,184,61,0.45)]"
                : d.isToday && d.state === "open"
                  ? "fiesta-pulse border-[#f5b83d] bg-white/[0.12] shadow-[0_4px_0_rgba(0,0,0,0.35),0_16px_34px_-12px_rgba(245,184,61,0.55)]"
                  : clickable
                    ? "border-white/20 bg-white/[0.08] shadow-[0_4px_0_rgba(0,0,0,0.3),0_12px_26px_-14px_rgba(0,0,0,0.6)]"
                    : "border-white/10 bg-white/[0.03]",
              clickable && "hover:-translate-y-1 active:translate-y-0.5",
              isFeast && "col-span-2 lg:col-span-5",
            )}
          >
            {isFeast && (
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(245,184,61,0.28),transparent_70%)]"
              />
            )}
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                  isDone || isFeast ? "bg-[#f5b83d] text-[#3b2600]" : "bg-white/15 text-white",
                )}
              >
                {d.label}
              </span>
              <span className="text-xs font-medium text-white/60">{shortDate(d.date)}</span>
            </div>

            <div className="flex min-h-12 items-center gap-3">
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-2xl",
                  isDone
                    ? "bg-[#f5b83d] text-[#3b2600] shadow-[0_3px_0_#9a6504]"
                    : clickable
                      ? "bg-white/15 text-[#f5c867]"
                      : "bg-white/5 text-white/40",
                )}
              >
                {isDone ? (
                  <Check className="h-6 w-6" strokeWidth={3} />
                ) : d.state === "locked" ? (
                  <Lock className="h-5 w-5" />
                ) : d.state === "soon" ? (
                  <Clock className="h-5 w-5" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </span>
              <p className={cn("text-sm font-semibold leading-snug", clickable ? "text-white" : "text-white/55")}>
                {d.state === "open" ? d.title : preview ? "Vista previa" : d.state === "soon" ? "En preparación" : "Se abre ese día"}
              </p>
            </div>

            <p className={cn("mt-auto text-xs", isDone ? "text-[#ffe7a3]" : "text-white/55")}>
              {isDone ? "Ganaste: " : "Pieza: "}
              <span className="font-semibold">{pieceInfo(d.piece).name}</span>
            </p>
            {d.isToday && d.state === "open" && !isDone && (
              <span className="absolute right-2 top-11 rounded-full bg-[#d3302f] px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-[0_2px_0_#8f1f1e]">
                Hoy
              </span>
            )}
          </motion.div>
        );
        return (
          <li key={d.dayNumber} className={cn(isFeast && "col-span-2 lg:col-span-5")}>
            {clickable ? (
              <Link
                href={`/fiestas/${slug}/dia/${d.dayNumber}`}
                className="block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b83d]"
                aria-label={`${d.label}: ${d.title ?? ""}${isDone ? " (completado)" : ""}`}
              >
                {card}
              </Link>
            ) : (
              card
            )}
          </li>
        );
      })}
    </ol>
  );
}
