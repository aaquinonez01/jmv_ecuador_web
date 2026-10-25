import type { ReactNode } from "react";
import { StarsRing } from "@/components/brand";

interface BlogLayoutProps {
  /** Botón principal del encabezado (crear publicación) */
  action?: ReactNode;
  /** Columna lateral: sesión, bienvenida. En móvil va después del feed. */
  aside?: ReactNode;
  children: ReactNode;
}

// Estructura del blog: encabezado "Comunidad JMV" con las doce estrellas y,
// debajo, el feed primero (también en el DOM) y la columna lateral.
// Tema: en claro la cabecera es marfil (bg-hero-plain) y el fondo bg-page; en
// oscuro se conservan la banda tinta y el fondo slate-100 de siempre. Las
// tarjetas del feed son islas blancas fijas en ambos modos.
export default function BlogLayout({ action, aside, children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-page dark:bg-slate-100">
      <header className="relative isolate overflow-hidden border-b border-line bg-hero-plain text-fg dark:border-b-0 dark:bg-jmv-ink dark:bg-none">
        <div className="absolute inset-0 -z-10 hidden bg-gradient-jmv dark:block" aria-hidden="true" />
        <StarsRing className="pointer-events-none absolute -top-16 -right-16 -z-10 h-72 w-72 text-accent-gold/20 sm:h-96 sm:w-96" />
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold tracking-wide text-accent-gold uppercase">
              Blog de JMV Ecuador
            </p>
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">
              Comunidad JMV
            </h1>
            <p className="mt-3 text-base text-fg/90 sm:text-lg">
              Momentos, testimonios y recursos que comparten jóvenes de JMV en
              todo el Ecuador.
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
