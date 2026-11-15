"use client";

import { useCallback, useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { getMyReactions, getPhotos, hasSession, react } from "@/lib/fiestas/api";
import { REACTIONS, type FiestaDaySummary, type FiestaPhoto, type Reaction } from "@/lib/fiestas/types";
import { cn } from "@/lib/utils";

// Mural "Así lo vivimos": fotos aprobadas de cada comunidad, por día, con reacciones.

export default function Mural({
  slug,
  days,
  onNeedAuth,
  refreshKey,
}: {
  slug: string;
  days: FiestaDaySummary[];
  onNeedAuth: () => void;
  refreshKey?: number;
}) {
  const [day, setDay] = useState<number | undefined>(undefined);
  const [photos, setPhotos] = useState<FiestaPhoto[] | null>(null);
  const [mine, setMine] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(-1);

  const load = useCallback(async () => {
    try {
      setPhotos(await getPhotos(slug, day));
    } catch {
      setPhotos([]);
    }
  }, [slug, day]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  useEffect(() => {
    getMyReactions(slug).then((r) => setMine(new Set(r.map((x) => `${x.photoId}:${x.emoji}`))));
  }, [slug, refreshKey]);

  const toggle = async (p: FiestaPhoto, emoji: Reaction) => {
    if (!hasSession()) return onNeedAuth();
    const key = `${p.id}:${emoji}`;
    try {
      const res = await react(p.id, emoji);
      setMine((s) => {
        const n = new Set(s);
        if (res.reacted) n.add(key);
        else n.delete(key);
        return n;
      });
      setPhotos((list) => list?.map((x) => (x.id === p.id ? { ...x, reactions: res.reactions } : x)) ?? null);
    } catch {
      /* sin conexión: no cambia nada */
    }
  };

  const opened = days.filter((d) => d.state !== "locked");

  return (
    <div>
      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {[{ dayNumber: undefined as number | undefined, label: "Todos" }, ...opened].map((d) => (
          <button
            key={d.label}
            type="button"
            onClick={() => setDay(d.dayNumber)}
            className={cn(
              "min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition active:translate-y-0.5",
              day === d.dayNumber
                ? "bg-[#f5b83d] text-[#3b2600] shadow-[0_3px_0_#9a6504]"
                : "border border-white/20 bg-white/10 text-white shadow-[0_3px_0_rgba(0,0,0,0.25)] hover:bg-white/15",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      {photos === null ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-square animate-pulse rounded-3xl bg-white/10" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/25 px-6 py-12 text-center">
          <Camera className="mx-auto mb-3 h-10 w-10 text-[#f5c867]" aria-hidden="true" />
          <p className="font-semibold text-white">Todavía no hay fotos {day ? "de este día" : ""}</p>
          <p className="mt-1 text-sm text-white/65">
            El responsable de cada comunidad sube cómo vivieron la novena, el triduo o la fiesta.
          </p>
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {photos.map((p, i) => (
            <motion.figure
              key={p.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-3 break-inside-avoid overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.7)]"
            >
              <button type="button" onClick={() => setIndex(i)} className="block w-full" aria-label={`Ver foto de ${p.comunidad}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url.replace("/upload/", "/upload/w_600,q_auto,f_auto/")}
                  alt={p.caption ?? `Foto de ${p.comunidad}, ${p.label}`}
                  loading="lazy"
                  className="w-full transition duration-500 hover:scale-[1.03]"
                />
              </button>
              <figcaption className="space-y-2 p-3">
                <p className="text-sm font-semibold leading-tight text-white">{p.comunidad}</p>
                <p className="text-xs text-white/60">
                  {p.label}
                  {p.caption ? ` · ${p.caption}` : ""}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {REACTIONS.map((r) => {
                    const on = mine.has(`${p.id}:${r.id}`);
                    const n = p.reactions[r.id] ?? 0;
                    return (
                      <motion.button
                        key={r.id}
                        type="button"
                        whileTap={{ scale: 1.25 }}
                        onClick={() => toggle(p, r.id)}
                        aria-label={`${r.label}${n ? ` (${n})` : ""}`}
                        aria-pressed={on}
                        className={cn(
                          "inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-sm transition",
                          on
                            ? "bg-[#f5b83d]/25 ring-1 ring-[#f5b83d] shadow-[0_2px_0_rgba(154,101,4,0.6)]"
                            : "bg-white/10 shadow-[0_2px_0_rgba(0,0,0,0.3)] hover:bg-white/15",
                        )}
                      >
                        <span aria-hidden="true">{r.emoji}</span>
                        {n > 0 && <span className="text-xs font-semibold text-white">{n}</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      )}

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={Math.max(0, index)}
        slides={(photos ?? []).map((p) => ({ src: p.url, alt: p.caption ?? p.comunidad }))}
      />
    </div>
  );
}
