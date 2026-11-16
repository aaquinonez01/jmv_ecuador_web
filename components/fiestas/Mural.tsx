"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "yet-another-react-lightbox/styles.css";
import { motion } from "framer-motion";
import { Camera, EyeOff, Images } from "lucide-react";
import { setPhotoStatusAPI } from "@/lib/fiestas/admin-api";
import { getMyReactions, getPhotos, hasSession, react } from "@/lib/fiestas/api";
import { REACTIONS, type FiestaDaySummary, type FiestaPhoto, type Reaction } from "@/lib/fiestas/types";
import { cn } from "@/lib/utils";
import { Sheet } from "./ui";

// El visor de fotos se descarga solo cuando alguien abre una foto
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

const thumb = (url: string, w: number) => url.replace("/upload/", `/upload/c_fill,g_auto,ar_1:1,w_${w},q_auto,f_auto/`);

interface Album {
  comunidad: string;
  photos: FiestaPhoto[];
  days: number;
  reactions: number;
}

// Mural "Así lo vivimos": un álbum por comunidad (así ninguna llena el mural sola).
// Al abrir el álbum se ven sus fotos por día, con reacciones.

export default function Mural({
  slug,
  days,
  onNeedAuth,
  refreshKey,
  isAdmin = false,
  generic = false,
}: {
  slug: string;
  days: FiestaDaySummary[];
  onNeedAuth: () => void;
  refreshKey?: number;
  /** Los administradores pueden quitar fotos desde el mismo mural */
  isAdmin?: boolean;
  /** Fiestas sin novena: el texto no habla de novena ni triduo */
  generic?: boolean;
}) {
  const [day, setDay] = useState<number | undefined>(undefined);
  const [photos, setPhotos] = useState<FiestaPhoto[] | null>(null);
  const [mine, setMine] = useState<Set<string>>(new Set());
  const [openAlbum, setOpenAlbum] = useState<string | null>(null);
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

  // Un álbum por comunidad; primero la que subió fotos más recientemente
  const albums = useMemo<Album[]>(() => {
    const map = new Map<string, FiestaPhoto[]>();
    for (const p of photos ?? []) map.set(p.comunidad, [...(map.get(p.comunidad) ?? []), p]);
    return [...map.entries()].map(([comunidad, list]) => ({
      comunidad,
      photos: list,
      days: new Set(list.map((p) => p.dayNumber)).size,
      reactions: list.reduce((n, p) => n + Object.values(p.reactions).reduce((a, b) => a + (b ?? 0), 0), 0),
    }));
  }, [photos]);

  const album = albums.find((a) => a.comunidad === openAlbum) ?? null;
  // Dentro del álbum: del primer día al último
  const albumPhotos = useMemo(
    () => [...(album?.photos ?? [])].sort((a, b) => a.dayNumber - b.dayNumber || a.createdAt.localeCompare(b.createdAt)),
    [album],
  );
  const albumDays = useMemo(() => {
    const out: { dayNumber: number; label: string; items: { p: FiestaPhoto; i: number }[] }[] = [];
    albumPhotos.forEach((p, i) => {
      const last = out.at(-1);
      if (last?.dayNumber === p.dayNumber) last.items.push({ p, i });
      else out.push({ dayNumber: p.dayNumber, label: p.label, items: [{ p, i }] });
    });
    return out;
  }, [albumPhotos]);

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

  const hide = async (p: FiestaPhoto) => {
    if (!window.confirm(`¿Quitar del mural esta foto de ${p.comunidad}? Queda en Admin → Fiestas → Fotos → Rechazadas, por si quieres devolverla.`)) return;
    try {
      await setPhotoStatusAPI(p.id, "rejected");
      setPhotos((list) => list?.filter((x) => x.id !== p.id) ?? null);
    } catch {
      window.alert("No se pudo quitar la foto. Inténtalo de nuevo.");
    }
  };

  // Con fotos de prueba subidas antes de tiempo, también se muestran esos días
  const withPhotos = new Set((photos ?? []).map((p) => p.dayNumber));
  const opened = days.filter((d) => d.state !== "locked" || d.dayNumber === day || withPhotos.has(d.dayNumber));

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
      ) : albums.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/25 px-6 py-12 text-center">
          <Camera className="mx-auto mb-3 h-10 w-10 text-[#f5c867]" aria-hidden="true" />
          <p className="font-semibold text-white">Todavía no hay fotos {day ? "de este día" : ""}</p>
          <p className="mt-1 text-sm text-white/65">
            {generic ? "El responsable de cada comunidad sube cómo lo vivieron." : "El responsable de cada comunidad sube cómo vivieron la novena, el triduo o la fiesta."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {albums.map((a) => {
            const cover = a.photos.slice(0, 3);
            return (
              <motion.button
                key={a.comunidad}
                type="button"
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                onClick={() => setOpenAlbum(a.comunidad)}
                aria-label={`Abrir el álbum de ${a.comunidad}, ${a.photos.length} ${a.photos.length === 1 ? "foto" : "fotos"}`}
                className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] text-left shadow-[0_6px_0_rgba(0,0,0,0.3),0_14px_30px_-16px_rgba(0,0,0,0.7)] transition active:translate-y-1"
              >
                {/* Portada: una foto grande y, si hay más, dos pequeñas al lado */}
                <div className={cn("relative grid aspect-square gap-0.5", cover.length >= 3 ? "grid-cols-3 grid-rows-2" : "grid-cols-1")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb(cover[0].url, 500)}
                    alt=""
                    loading="lazy"
                    className={cn("h-full w-full object-cover", cover.length >= 3 && "col-span-2 row-span-2")}
                  />
                  {cover.length >= 3 &&
                    cover.slice(1).map((p) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={p.id} src={thumb(p.url, 250)} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ))}
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white">
                    <Images className="h-3.5 w-3.5" aria-hidden="true" />
                    {a.photos.length}
                  </span>
                </div>
                <div className="space-y-1 p-3">
                  <p className="text-sm font-bold leading-tight text-white">{a.comunidad}</p>
                  <p className="text-xs text-white/60">
                    {a.photos.length} {a.photos.length === 1 ? "foto" : "fotos"}
                    {!day && ` · ${a.days} ${a.days === 1 ? "día" : "días"}`}
                    {a.reactions > 0 && ` · ${a.reactions} ❤`}
                  </p>
                  <p className="text-xs font-semibold text-[#f5c867]">Ver álbum →</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      <Sheet open={Boolean(album)} onClose={() => setOpenAlbum(null)} title={album?.comunidad ?? "Álbum"} wide>
        {album && (
          <div className="space-y-6">
            <p className="-mt-2 text-sm text-white/60">
              {album.photos.length} {album.photos.length === 1 ? "foto" : "fotos"} · toca una para verla grande
            </p>
            {albumDays.map((g) => (
              <section key={g.dayNumber}>
                <h4 className="mb-2 text-sm font-bold text-white">{g.label}</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {g.items.map(({ p, i }) => (
                    <figure key={p.id} className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06]">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => hide(p)}
                          className="absolute right-2 top-2 z-10 inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#d3302f] px-3 text-xs font-bold text-white shadow-[0_3px_0_#7f1d1d] transition hover:bg-[#b92524] active:translate-y-0.5"
                        >
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                          Quitar
                        </button>
                      )}
                      <button type="button" onClick={() => setIndex(i)} className="block w-full" aria-label="Ver la foto grande">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb(p.url, 500)}
                          alt={p.caption ?? `Foto de ${p.comunidad}, ${p.label}`}
                          loading="lazy"
                          className="aspect-square w-full object-cover"
                        />
                      </button>
                      <figcaption className="space-y-2 p-2.5">
                        {p.caption && <p className="text-xs text-white/75">{p.caption}</p>}
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
                    </figure>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Sheet>

      {index >= 0 && (
        <Lightbox
          open
          close={() => setIndex(-1)}
          index={Math.min(Math.max(0, index), Math.max(0, albumPhotos.length - 1))}
          slides={albumPhotos.map((p) => ({ src: p.url, alt: p.caption ?? p.comunidad }))}
        />
      )}
    </div>
  );
}
