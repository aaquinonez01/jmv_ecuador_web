"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, EyeOff, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { errorMessage, getKeepsakes, getMyKeepsake, removeMyKeepsake, uploadKeepsake, type Keepsake } from "@/lib/fiestas/api";
import { removeKeepsakeAPI } from "@/lib/fiestas/admin-api";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { cn } from "@/lib/utils";

// El recuerdo de todos: cada joven sube una foto llevando la medalla.
// Siempre es de noche (colores fijos), como el cielo.

const gold = "#f5c867";
const soft = "rgba(255,255,255,0.72)";
/** Ancho de cada foto: tres por fila en el celular, más en pantallas grandes */
const TILE = "w-[calc((100%-1rem)/3)] sm:w-[calc((100%-1.5rem)/4)] lg:w-[calc((100%-2.5rem)/6)]";

export default function FeastWall({
  slug,
  fiestaId,
  canUpload,
  onNeedAuth,
  isAdmin = false,
  hideEmpty = false,
  className,
}: {
  slug: string;
  /** Para que un administrador pueda quitar fotos */
  fiestaId?: string;
  /** Hay sesión y ya es el día de la fiesta (o es administrador) */
  canUpload: boolean;
  /** Sin sesión: pide entrar. Si falta, no se ofrece subir */
  onNeedAuth?: () => void;
  isAdmin?: boolean;
  /** No mostrar nada si aún no hay fotos y quien mira no puede subir */
  hideEmpty?: boolean;
  className?: string;
}) {
  const [items, setItems] = useState<Keepsake[] | null>(null);
  const [mine, setMine] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<Keepsake | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    getKeepsakes(slug)
      .then(setItems)
      .catch(() => setItems((i) => i ?? []));
  }, [slug]);

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (canUpload) getMyKeepsake(slug).then(setMine);
  }, [canUpload, slug]);

  const pick = async (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return setError("La foto pesa más de 10 MB. Elige una más liviana.");
    setBusy(true);
    setError("");
    try {
      setMine(await uploadKeepsake(slug, file));
      load();
    } catch (e) {
      setError(errorMessage(e, "No se pudo subir la foto. Inténtalo de nuevo."));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const removeMine = async () => {
    if (!window.confirm("¿Quitar tu foto del recuerdo?")) return;
    setBusy(true);
    try {
      await removeMyKeepsake(slug);
      setMine(null);
      load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const hide = async (k: Keepsake) => {
    if (!fiestaId || !window.confirm(`¿Quitar la foto de ${k.name}? No se puede deshacer.`)) return;
    try {
      await removeKeepsakeAPI(fiestaId, k.userId);
      setItems((list) => list?.filter((x) => x.userId !== k.userId) ?? null);
      setOpen(null);
    } catch {
      window.alert("No se pudo quitar la foto.");
    }
  };

  const list = items ?? [];
  // Tu propia foto primero (la de un administrador no sale en la lista pública)
  const others = mine ? list.filter((k) => k.url !== mine) : list;
  if (hideEmpty && !canUpload && !onNeedAuth && list.length === 0) return null;
  // Solo está el recuadro propio: va más grande y al centro
  const alone = others.length === 0;

  return (
    <div className={className}>
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: gold }}>
          El recuerdo de todos
        </p>
        <h3 className="font-display mt-1 text-3xl font-semibold sm:text-4xl" style={{ color: "#fff" }}>
          Caminamos juntos esta novena
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[15px]" style={{ color: soft }}>
          Sube una foto tuya llevando la medalla. Quedará aquí, junto a las de todos los que caminaron estos días.
        </p>
      </div>

      {error && (
        <p role="alert" className="mx-auto mt-4 max-w-md rounded-2xl px-4 py-3 text-center text-sm" style={{ background: "rgba(211,48,47,0.28)", color: "#fff" }}>
          {error}
        </p>
      )}

      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {/* Tu foto, o el botón para subirla */}
        {(canUpload || onNeedAuth) && (
          <li className={cn("relative aspect-square overflow-hidden rounded-2xl", alone ? "w-44 sm:w-52" : TILE)} style={{ border: `2px ${mine ? "solid" : "dashed"} ${gold}`, background: "rgba(245,184,61,0.1)" }}>
            {mine ? (
              <>
                <img src={getOptimizedUrl(mine, { w: 400 })} alt="Tu foto con la medalla" className="h-full w-full object-cover" />
                <span className="absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: gold, color: "#3b2600" }}>
                  Tú
                </span>
                <div className="absolute inset-x-1.5 bottom-1.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => input.current?.click()}
                    disabled={busy}
                    aria-label="Cambiar mi foto"
                    className="grid h-9 flex-1 place-items-center rounded-xl"
                    style={{ background: "rgba(7,13,29,0.78)", color: "#fff" }}
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-4 w-4" aria-hidden="true" />}
                  </button>
                  <button
                    type="button"
                    onClick={removeMine}
                    disabled={busy}
                    aria-label="Quitar mi foto"
                    className="grid h-9 w-9 place-items-center rounded-xl"
                    style={{ background: "rgba(7,13,29,0.78)", color: "#fff" }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => (canUpload ? input.current?.click() : onNeedAuth?.())}
                disabled={busy}
                className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2 text-center"
                style={{ color: gold }}
              >
                {busy ? <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" /> : <Camera className="h-8 w-8" aria-hidden="true" />}
                <span className="text-xs font-bold leading-tight" style={{ color: "#fff" }}>
                  {busy ? "Subiendo…" : canUpload ? "Sube tu foto" : "Entra y sube tu foto"}
                </span>
              </button>
            )}
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
          </li>
        )}

        {others.map((k) => (
          <li key={k.userId} className={cn("relative aspect-square overflow-hidden rounded-2xl", TILE)} style={{ background: "rgba(255,255,255,0.06)" }}>
            <button type="button" onClick={() => setOpen(k)} className="block h-full w-full" aria-label={`Ver la foto de ${k.name}`}>
              <img src={getOptimizedUrl(k.url, { w: 400 })} alt="" loading="lazy" className="h-full w-full object-cover" />
              <span
                className="absolute inset-x-0 bottom-0 truncate px-2 pb-1.5 pt-5 text-left text-[11px] font-semibold"
                style={{ background: "linear-gradient(transparent, rgba(7,13,29,0.85))", color: "#fff" }}
              >
                {k.name}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {items !== null && list.length === 0 && !mine && (
        <p className="mt-4 text-center text-sm" style={{ color: soft }}>
          Todavía no hay fotos. La primera puede ser la tuya.
        </p>
      )}

      {/* Foto ampliada */}
      {open && (
        <div className="fixed inset-0 z-[120] grid place-items-center p-4" style={{ background: "rgba(5,11,24,0.9)" }} role="dialog" aria-modal="true" aria-label={`Foto de ${open.name}`} onClick={() => setOpen(null)}>
          <div className="relative max-h-full w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <img src={getOptimizedUrl(open.url, { w: 1200 })} alt={`${open.name} con la medalla`} className="max-h-[78svh] w-full rounded-3xl object-contain" />
            <p className="mt-3 text-center text-lg font-semibold" style={{ color: "#fff" }}>
              {open.name}
              {open.comunidad && (
                <span className="block text-sm font-normal" style={{ color: soft }}>
                  {open.comunidad}
                </span>
              )}
            </p>
            <div className="mt-3 flex justify-center gap-2">
              {isAdmin && fiestaId && (
                <button type="button" onClick={() => hide(open)} className="inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-sm font-bold" style={{ background: "#d3302f", color: "#fff" }}>
                  <EyeOff className="h-4 w-4" aria-hidden="true" /> Quitar del recuerdo
                </button>
              )}
              <button type="button" onClick={() => setOpen(null)} className="inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-sm font-bold" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>
                <X className="h-4 w-4" aria-hidden="true" /> Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
