"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Megaphone, X } from "lucide-react";
import type { HomeAnnouncement } from "@/types/consejo";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { buttonVariants } from "@/components/ui/button-variants";

const isExternal = (url: string) => /^https?:\/\//i.test(url);
const KEY = "jmv-anuncio-visto";

/** Anuncios que esta persona ya cerró (la ventana sale una sola vez por anuncio) */
function seen(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

// Ventana que se abre al entrar a la portada con el anuncio más importante.
// Se muestra una vez por anuncio; si se edita el anuncio, vuelve a salir.
export default function AnnouncementPopup({ announcement: a }: { announcement: HomeAnnouncement }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const version = `${a.id}:${a.updatedAt ?? ""}`;

  useEffect(() => {
    if (seen().includes(version)) return;
    // Un momento después de cargar, para que primero se vea la portada
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, [version]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(KEY, JSON.stringify([...seen().filter((v) => !v.startsWith(`${a.id}:`)), version].slice(-20)));
    } catch {
      // sin almacenamiento (modo privado): la ventana volverá a salir en la próxima visita
    }
  }, [a.id, version]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  const cta = a.ctaUrl && a.ctaLabel ? { url: a.ctaUrl, label: a.ctaLabel } : null;
  const ctaClass = buttonVariants({ variant: "gold", className: "w-full justify-center sm:w-auto" });

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div aria-hidden="true" className="anuncio-fade absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={close} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="anuncio-ventana-titulo"
        className="anuncio-pop relative flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-jmv-gold/40 bg-white shadow-2xl sm:rounded-3xl dark:bg-slate-900"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Cerrar el anuncio"
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-slate-950/55 text-white shadow-md transition hover:bg-slate-950/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-gold"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="overflow-y-auto">
          {a.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getOptimizedUrl(a.imageUrl, { w: 1000 })}
              alt=""
              className="max-h-[46svh] w-full bg-slate-950 object-contain"
            />
          ) : (
            <div className="h-3 w-full bg-gradient-to-r from-jmv-blue via-jmv-gold to-jmv-red" aria-hidden="true" />
          )}

          <div className="p-6 sm:p-8">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              Anuncio destacado
            </p>
            <h2 id="anuncio-ventana-titulo" className="mb-2 pr-10 text-2xl font-bold text-fg sm:text-3xl">
              {a.titulo}
            </h2>
            {a.subtitulo && <p className="mb-3 font-medium text-accent-gold">{a.subtitulo}</p>}
            <p className="whitespace-pre-line leading-relaxed text-fg-soft">{a.mensaje}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              {cta &&
                (isExternal(cta.url) ? (
                  <a href={cta.url} target="_blank" rel="noopener noreferrer" className={ctaClass} onClick={close}>
                    {cta.label}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                ) : (
                  <Link href={cta.url} className={ctaClass} onClick={close}>
                    {cta.label}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                ))}
              <button
                type="button"
                onClick={close}
                className="min-h-11 rounded-xl px-4 text-sm font-semibold text-fg-muted underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jmv-gold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes anuncio-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes anuncio-pop { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: none } }
        .anuncio-fade { animation: anuncio-fade 0.25s ease-out both }
        .anuncio-pop { animation: anuncio-pop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both }
        @media (prefers-reduced-motion: reduce) { .anuncio-fade, .anuncio-pop { animation: none } }
      `}</style>
    </div>
  );
}
