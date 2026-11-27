"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, EyeOff, X } from "lucide-react";
import Medal from "@/components/fiestas/Medal";
import { getFiesta, getKeepsakes, getMe, getPhotos, getSky, hasSession, type FiestaSky, type Keepsake } from "@/lib/fiestas/api";
import type { FiestaPhoto, FiestaPublic } from "@/lib/fiestas/types";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";

// «Así vivió JMV Ecuador la Medalla Milagrosa»: el recuerdo de la novena y la fiesta en la
// portada. Los jóvenes con su medalla son las doce estrellas que giran alrededor de la
// Medalla; debajo pasa el mural de las comunidades.
//
// Por ahora solo lo ven los administradores. Para abrirlo a todos: PUBLICO = true.
// (En desarrollo, NEXT_PUBLIC_RECAP_PREVIEW=1 lo muestra sin sesión para poder revisarlo.)
const PUBLICO = process.env.NEXT_PUBLIC_RECAP_PREVIEW === "1";
const SLUG = "medalla-milagrosa";
const ALL = new Set(["rayos", "globo", "serpiente", "inscripcion", "maria", "m", "cruz", "corazones", "estrellas", "medalla"]);
const STARS = 12;

const gold = "#f5c867";
const soft = "rgba(255,255,255,0.74)";

/** Estrellas de fondo, en posiciones fijas (mismas en servidor y navegador) */
const SKY = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  s: 1 + ((i * 7) % 3),
  d: 2.4 + ((i * 13) % 30) / 10,
  t: ((i * 17) % 40) / 10,
}));

/** Cuenta desde cero cuando el número entra en pantalla */
function Count({ to, label }: { to: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1400);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <div ref={ref} className="min-w-0 px-2 text-center">
      <p className="font-display text-4xl font-semibold tabular-nums sm:text-5xl" style={{ color: gold }}>
        {n}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] sm:text-sm" style={{ color: soft }}>
        {label}
      </p>
    </div>
  );
}

/** Una fila del mural que pasa sin fin; la lista va dos veces para que no se note el corte */
function Row({ photos, reverse, onOpen }: { photos: FiestaPhoto[]; reverse?: boolean; onOpen: (p: FiestaPhoto) => void }) {
  if (photos.length === 0) return null;
  // Con pocas fotos se repiten hasta llenar el ancho de la pantalla
  const base = photos.length < 8 ? Array.from({ length: Math.ceil(8 / photos.length) }, () => photos).flat() : photos;
  return (
    <div className="recap-row group relative overflow-hidden">
      <div
        className={`recap-track flex w-max gap-4 py-3 ${reverse ? "recap-track-rev" : ""}`}
        style={{ animationDuration: `${base.length * 7}s` }}
      >
        {[...base, ...base].map((p, i) => (
          <button
            key={`${p.id}-${i}`}
            type="button"
            onClick={() => onOpen(p)}
            aria-hidden={i >= base.length}
            tabIndex={i >= base.length ? -1 : 0}
            aria-label={`Ver foto de ${p.comunidad}, ${p.label}`}
            className="recap-tile relative h-44 w-64 shrink-0 overflow-hidden rounded-2xl text-left outline-none ring-offset-2 ring-offset-[#071226] focus-visible:ring-2 focus-visible:ring-[#f5c867] sm:h-56 sm:w-80"
            style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)`, boxShadow: "0 18px 40px -18px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,200,103,0.35)" }}
          >
            <img src={getOptimizedUrl(p.url, { w: 640 })} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-10" style={{ background: "linear-gradient(to top, rgba(4,10,24,0.92), transparent)" }}>
              <span className="block truncate text-sm font-semibold" style={{ color: "#fff" }}>
                {p.comunidad}
              </span>
              <span className="block text-xs font-medium" style={{ color: gold }}>
                {p.label}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FeastRecap() {
  const [show, setShow] = useState(PUBLICO);
  const [fiesta, setFiesta] = useState<FiestaPublic | null>(null);
  const [photos, setPhotos] = useState<FiestaPhoto[]>([]);
  const [faces, setFaces] = useState<Keepsake[]>([]);
  const [sky, setSky] = useState<FiestaSky | null>(null);
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState<FiestaPhoto | null>(null);
  const [all, setAll] = useState(false);

  // Quién lo ve: todos si ya es público; mientras tanto, solo administradores
  useEffect(() => {
    if (PUBLICO || !hasSession()) return;
    getMe(SLUG).then((m) => setShow(Boolean(m?.user.isAdmin)));
  }, []);

  useEffect(() => {
    if (!show) return;
    getFiesta(SLUG).then(setFiesta).catch(() => {});
    getPhotos(SLUG).then(setPhotos).catch(() => {});
    getKeepsakes(SLUG).then(setFaces).catch(() => {});
    getSky(SLUG).then(setSky).catch(() => {});
  }, [show]);

  // Cada pocos segundos se ilumina la estrella siguiente. Con más de doce jóvenes, la
  // estrella que se acaba de apagar cambia por el siguiente que aún no ha salido: así
  // pasan todos, de uno en uno, sin esperar a que termine la vuelta.
  const slots = Math.min(STARS, faces.length);
  useEffect(() => {
    if (slots === 0) return;
    const t = setInterval(() => setTick((x) => x + 1), 3200);
    return () => clearInterval(t);
  }, [slots]);
  const spot = slots ? tick % slots : 0;

  const order = useMemo(() => Array.from({ length: slots }, (_, k) => Math.floor((k * STARS) / slots)), [slots]);
  const stars = useMemo(
    () =>
      Array.from({ length: STARS }, (_, i) => {
        // Con menos de doce jóvenes, se reparten por todo el círculo en vez de quedar juntos
        const k = order.indexOf(i);
        // Cuántas veces se ha renovado esta estrella (una por cada vez que dejó de estar iluminada)
        const veces = faces.length > slots && tick > k ? Math.floor((tick - k - 1) / slots) + 1 : 0;
        const face = k < 0 ? null : veces === 0 ? faces[k] : faces[(slots + k + (veces - 1) * slots) % faces.length];
        const a = (i / STARS) * Math.PI * 2 - Math.PI / 2;
        return { face, left: 50 + 41 * Math.cos(a), top: 50 + 41 * Math.sin(a) };
      }),
    [faces, order, slots, tick],
  );
  const litSlot = order[spot] ?? -1;
  const lit = stars[litSlot]?.face ?? null;

  // En la portada solo pasan las fotos que el equipo eligió en el admin. Mientras no haya
  // ninguna elegida, la vista previa de los administradores las muestra todas.
  const chosen = useMemo(() => photos.filter((p) => p.featured), [photos]);
  const mural = chosen.length > 0 ? chosen : PUBLICO ? [] : photos;
  // El mural alterna comunidades para que no pasen seguidas todas las fotos de una sola
  const mixed = useMemo(() => {
    const groups = new Map<string, FiestaPhoto[]>();
    for (const p of mural) groups.set(p.comunidad, [...(groups.get(p.comunidad) ?? []), p]);
    const lists = [...groups.values()];
    const out: FiestaPhoto[] = [];
    for (let i = 0; out.length < mural.length; i++) for (const l of lists) if (l[i]) out.push(l[i]);
    return out;
  }, [mural]);
  const [rowA, rowB] = useMemo(() => [mixed.filter((_, i) => i % 2 === 0), mixed.filter((_, i) => i % 2 === 1)], [mixed]);

  const step = useCallback(
    (d: number) => setOpen((o) => (o ? mixed[(mixed.findIndex((p) => p.id === o.id) + d + mixed.length) % mixed.length] : o)),
    [mixed],
  );
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  if (!show || !fiesta || (photos.length === 0 && faces.length === 0)) return null;
  const year = fiesta.feastDate.slice(0, 4);

  return (
    <section aria-labelledby="recap-title" className="relative isolate overflow-hidden py-16 sm:py-24" style={{ background: "radial-gradient(120% 90% at 50% 0%, #14305f 0%, #0b1a33 45%, #060d1c 100%)", color: "#fff" }}>
      <style>{`
        @keyframes recap-twinkle { 0%,100% { opacity:.15; transform:scale(.7) } 50% { opacity:1; transform:scale(1.25) } }
        @keyframes recap-spin { to { transform: rotate(360deg) } }
        @keyframes recap-unspin { to { transform: translate(-50%,-50%) rotate(-360deg) } }
        @keyframes recap-slide { to { transform: translateX(-50%) } }
        @keyframes recap-rise { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
        .recap-ring { animation: recap-spin 110s linear infinite }
        .recap-star { transform: translate(-50%,-50%); animation: recap-unspin 110s linear infinite }
        .recap-rays { animation: recap-spin 160s linear infinite reverse }
        .recap-track { animation: recap-slide linear infinite }
        .recap-track-rev { animation-direction: reverse }
        .recap-row:hover .recap-track, .recap-row:focus-within .recap-track { animation-play-state: paused }
        .recap-tile { transition: transform .35s ease, filter .35s ease }
        .recap-tile:hover { transform: rotate(0deg) scale(1.05) !important; filter: brightness(1.08) }
        .recap-name { animation: recap-rise .45s ease both }
        @media (prefers-reduced-motion: reduce) {
          .recap-ring, .recap-star, .recap-rays, .recap-track, .recap-twinkle, .recap-name { animation: none !important }
          .recap-row { overflow-x: auto }
        }
      `}</style>

      {/* Cielo de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {SKY.map((p, i) => (
          <span key={i} className="recap-twinkle absolute rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: "#ffe7a3", animation: `recap-twinkle ${p.d}s ease-in-out ${p.t}s infinite` }} />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {!PUBLICO && (
          <p className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: soft }}>
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> Vista previa: solo la ven los administradores
          </p>
        )}

        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.26em]" style={{ color: gold }}>
            Novena y fiesta · noviembre de {year}
          </p>
          <h2 id="recap-title" className="font-display mt-3 bg-gradient-to-b from-[#fff3c4] via-[#f5c867] to-[#e0a11c] bg-clip-text text-4xl font-semibold leading-[1.1] sm:text-6xl" style={{ color: "transparent" }}>
            Así vivió JMV Ecuador la Medalla Milagrosa
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed" style={{ color: soft }}>
            Nueve días de camino y una fiesta. Estas son las comunidades y los jóvenes que la hicieron suya.
          </p>
        </header>

        {/* Los números del camino */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-y-8 rounded-3xl px-2 py-7 sm:grid-cols-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(245,200,103,0.3)" }}>
          <Count to={fiesta.comunidades} label="comunidades" />
          <Count to={fiesta.participants} label="jóvenes en camino" />
          <Count to={photos.length} label="fotos del mural" />
          <Count to={sky?.total ?? 0} label="medallas recibidas" />
        </div>

        {/* Las doce estrellas: los jóvenes con su medalla giran alrededor de la Medalla */}
        {faces.length > 0 && (
          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,30rem)]">
            <div className="text-center lg:order-2 lg:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: gold }}>
                Las doce estrellas
              </p>
              <h3 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Cada estrella es un joven que la lleva en el corazón</h3>
              <div className="mt-6 min-h-[5.5rem]" aria-live="polite">
                {lit && (
                  <div key={lit.userId} className="recap-name">
                    <p className="font-display text-2xl font-semibold" style={{ color: gold }}>
                      {lit.name}
                    </p>
                    {lit.comunidad && (
                      <p className="mt-1 text-base" style={{ color: soft }}>
                        {lit.comunidad}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                {faces.length} {faces.length === 1 ? "joven subió" : "jóvenes subieron"} su foto con la medalla
              </p>
              {faces.length > 1 && (
                <button
                  type="button"
                  onClick={() => setAll((v) => !v)}
                  aria-expanded={all}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(245,200,103,0.5)", color: "#fff" }}
                >
                  {all ? "Ocultar" : `Ver a ${faces.length === 2 ? "los dos" : "todos"}`}
                </button>
              )}
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[30rem] lg:order-1">
              <div aria-hidden="true" className="recap-rays absolute inset-[-12%] [background:repeating-conic-gradient(from_0deg,rgba(245,184,61,0.22)_0deg_4deg,transparent_4deg_15deg)] [mask-image:radial-gradient(circle,black_18%,transparent_66%)]" />
              <div aria-hidden="true" className="absolute inset-[26%] rounded-full blur-3xl" style={{ background: "rgba(245,184,61,0.35)" }} />
              <div className="absolute inset-[27%]">
                <Medal earned={ALL} showFlip={false} />
              </div>
              <div className="recap-ring absolute inset-0">
                {stars.map((s, i) => {
                  const on = i === litSlot && Boolean(s.face);
                  return (
                    <div key={i} className="recap-star absolute" style={{ left: `${s.left}%`, top: `${s.top}%`, width: "16%", aspectRatio: "1" }}>
                      {s.face ? (
                        <div
                          className="h-full w-full overflow-hidden rounded-full transition-all duration-700"
                          style={{
                            transform: on ? "scale(1.32)" : "scale(1)",
                            boxShadow: on ? `0 0 0 3px ${gold}, 0 0 34px 6px rgba(245,184,61,0.75)` : "0 0 0 2px rgba(245,200,103,0.55), 0 8px 20px -6px rgba(0,0,0,0.7)",
                          }}
                        >
                          <img key={s.face.userId} src={getOptimizedUrl(s.face.url, { w: 240 })} alt={`${s.face.name} con su medalla`} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div aria-hidden="true" className="flex h-full w-full items-center justify-center text-2xl sm:text-3xl" style={{ color: "rgba(245,200,103,0.5)" }}>
                          ✦
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Todos los jóvenes, sin importar cuántos sean: una cuadrícula que crece y se desplaza */}
      {all && (
        <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
          <ul className="grid max-h-[32rem] grid-cols-3 gap-x-3 gap-y-5 overflow-y-auto rounded-3xl p-5 sm:grid-cols-5 lg:grid-cols-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(245,200,103,0.3)" }}>
            {faces.map((f) => (
              <li key={f.userId} className="min-w-0 text-center">
                <img src={getOptimizedUrl(f.url, { w: 240 })} alt="" loading="lazy" className="mx-auto aspect-square w-full max-w-24 rounded-full object-cover" style={{ boxShadow: "0 0 0 2px rgba(245,200,103,0.6)" }} />
                <p className="mt-2 truncate text-sm font-semibold" style={{ color: "#fff" }}>{f.name}</p>
                {f.comunidad && <p className="truncate text-xs" style={{ color: soft }}>{f.comunidad}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* El mural: dos filas que pasan en sentidos opuestos */}
      {mixed.length > 0 && (
        <div className="mt-16">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: gold }}>
              El mural de las comunidades
            </p>
            <h3 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Así se rezó en cada rincón del país</h3>
            {!PUBLICO && chosen.length === 0 && (
              <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: soft }}>
                Aún no eliges fotos: ahora ves todas. En el admin de la fiesta, pestaña Fotos, marca «Portada» en las que quieras mostrar aquí.
              </p>
            )}
          </div>
          <div className="mt-6 space-y-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <Row photos={rowA} onOpen={setOpen} />
            <Row photos={rowB.length ? rowB : rowA} reverse onOpen={setOpen} />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Las comunidades y sus estrellas */}
        {sky && sky.stars.some((s) => s.comunidad) && (
          <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-2.5">
            {sky.stars
              .filter((s) => s.comunidad)
              .map((s) => (
                <li key={s.comunidad} className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(245,200,103,0.35)", color: "#fff" }}>
                  {s.comunidad} <span style={{ color: gold }}>✦ {s.n}</span>
                </li>
              ))}
          </ul>
        )}

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="font-display text-2xl italic leading-snug sm:text-3xl" style={{ color: "#fff" }}>
            «Oh María, sin pecado concebida, ruega por nosotros que recurrimos a ti»
          </p>
          <Link
            href={`/fiestas/${SLUG}`}
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-base font-bold transition active:translate-y-0.5"
            style={{ background: gold, color: "#3b2600", boxShadow: "0 4px 0 #9a6504" }}
          >
            Revivir el camino <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Foto en grande */}
      {open && (
        <div role="dialog" aria-modal="true" aria-label={`Foto de ${open.comunidad}`} className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background: "rgba(3,8,20,0.94)" }} onClick={() => setOpen(null)}>
          <button type="button" autoFocus onClick={() => setOpen(null)} aria-label="Cerrar" className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>
            <X className="h-6 w-6" />
          </button>
          {mixed.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Foto anterior" className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Foto siguiente" className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>
                <ArrowRight className="h-6 w-6" />
              </button>
            </>
          )}
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={getOptimizedUrl(open.url, { w: 1600 })} alt={open.caption ?? `${open.comunidad}, ${open.label}`} className="max-h-[78vh] w-auto rounded-2xl object-contain" />
            <figcaption className="mt-3 text-center">
              <span className="block text-lg font-semibold" style={{ color: "#fff" }}>{open.comunidad}</span>
              <span className="block text-sm" style={{ color: gold }}>
                {open.label}
                {open.caption ? ` · ${open.caption}` : ""}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
