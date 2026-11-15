"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Users } from "lucide-react";
import { getRanking } from "@/lib/fiestas/api";
import type { FiestaRanking } from "@/lib/fiestas/types";
import { cn } from "@/lib/utils";
import { Glass } from "./ui";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Ranking({ slug, myComunidadId, refreshKey }: { slug: string; myComunidadId?: string | null; refreshKey?: number }) {
  const [tab, setTab] = useState<"comunidades" | "personas">("comunidades");
  const [data, setData] = useState<FiestaRanking | null>(null);

  useEffect(() => {
    getRanking(slug).then(setData).catch(() => setData({ muralBonus: 0, people: [], comunidades: [] }));
  }, [slug, refreshKey]);

  const rows =
    tab === "comunidades"
      ? (data?.comunidades ?? []).slice(0, 15).map((c) => ({
          key: c.id,
          name: c.nombre,
          sub: `${c.zona ? `${c.zona} · ` : ""}${c.participants} ${c.participants === 1 ? "participante" : "participantes"}${c.muralDays ? ` · ${c.muralDays} ${c.muralDays === 1 ? "día" : "días"} en el mural` : ""}`,
          value: c.score,
          mine: c.id === myComunidadId,
        }))
      : (data?.people ?? []).map((p, i) => ({
          key: `${p.name}-${i}`,
          name: p.name,
          sub: `${p.comunidad ?? "Sin comunidad"} · ${p.days} ${p.days === 1 ? "día" : "días"}`,
          value: p.points,
          mine: false,
        }));
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <Glass className="p-5 sm:p-6">
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-black/25 p-1">
        {(
          [
            ["comunidades", "Comunidades", Users],
            ["personas", "Jóvenes", Crown],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition",
              tab === id ? "bg-white text-[#0f2547] shadow-[0_3px_0_rgba(0,0,0,0.25)]" : "text-white/70 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {!data ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/10" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-white/70">
          Aún no hay puntos. ¡Sé el primero en completar un día!
        </p>
      ) : (
        <ol className="space-y-2.5">
          {rows.map((r, i) => (
            <motion.li
              key={r.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "relative overflow-hidden rounded-2xl border px-4 py-3",
                r.mine ? "border-[#f5b83d] bg-[#f5b83d]/15" : "border-white/10 bg-white/[0.05]",
              )}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#f5b83d]/25 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: `${(r.value / max) * 100}%` }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.04 }}
              />
              <div className="relative flex items-center gap-3">
                <span className="w-8 shrink-0 text-center text-lg font-bold text-white/80">
                  {MEDALS[i] ?? i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {r.name}
                    {r.mine && <span className="ml-2 text-xs font-bold text-[#f5c867]">· tu comunidad</span>}
                  </p>
                  <p className="truncate text-xs text-white/60">{r.sub}</p>
                </div>
                <span className="shrink-0 text-right">
                  <span className="block text-lg font-bold text-[#f5c867]">{r.value}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-white/50">pts</span>
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      )}
      {tab === "comunidades" && data && rows.length > 0 && (
        <p className="mt-4 text-xs leading-relaxed text-white/55">
          Puntaje = promedio de puntos de quienes participan + {data.muralBonus} por cada día con fotos en el mural. Así una
          comunidad pequeña también puede ganar.
        </p>
      )}
    </Glass>
  );
}
