import type { ReactNode } from "react";
import type { SlotPhoto } from "@/lib/site-images";
import { HeroBackdrop } from "@/components/media/HeroMedia";

interface BlogLayoutProps {
  /** Botón principal del encabezado (crear publicación) */
  action?: ReactNode;
  /** Columna lateral: sesión, bienvenida. En móvil va después del feed. */
  aside?: ReactNode;
  /** Foto de la cabecera (espacio "blog.hero") */
  heroImages?: readonly SlotPhoto[];
  children: ReactNode;
}

// Estructura del blog: cabecera breve con foto ("Comunidad JMV") y, debajo, el
// feed primero (también en el DOM) y la columna lateral.
// La cabecera es una isla oscura (data-tone="dark") en ambos modos: foto + velo y
// texto blanco. Debajo, en claro el fondo es bg-page; en oscuro se conserva el
// fondo slate-100 de siempre. Las tarjetas del feed son islas blancas fijas.
export default function BlogLayout({ action, aside, heroImages = [], children }: BlogLayoutProps) {
  const hasPhoto = heroImages.length > 0;
  return (
    <div className="min-h-screen overflow-x-hidden bg-page dark:bg-slate-100">
      <header
        data-tone="dark"
        className={`relative isolate flex items-end overflow-hidden bg-jmv-ink text-white ${
          hasPhoto ? "min-h-[46svh] sm:min-h-[40vh]" : ""
        }`}
      >
        {hasPhoto ? (
          <HeroBackdrop images={heroImages} sizes="100vw" />
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-jmv" aria-hidden="true" />
        )}
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-24 pb-6 sm:px-6 sm:pt-28 sm:pb-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-jmv-gold-text uppercase sm:text-sm">
              Blog de JMV Ecuador
            </p>
            <h1 className="font-display text-4xl font-semibold [text-shadow:0_2px_16px_rgb(15_23_42/0.45)] sm:text-5xl">
              Comunidad JMV
            </h1>
            <p className="mt-2 text-base leading-snug text-slate-100 [text-shadow:0_1px_10px_rgb(15_23_42/0.6)] sm:mt-3 sm:text-lg">
              Momentos, testimonios y recursos de jóvenes de JMV en todo el Ecuador.
            </p>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-8">
        <div className="min-w-0">{children}</div>
        {aside ? (
          <aside aria-label="Tu cuenta" className="lg:sticky lg:top-24 lg:self-start">
            {aside}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
