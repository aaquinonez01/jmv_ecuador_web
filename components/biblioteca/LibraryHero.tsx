import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { StarsRing } from "@/components/brand";
import { HeroBackdrop } from "@/components/media/HeroMedia";
import { TYPE_LABELS } from "@/lib/biblioteca";
import type { SlotPhoto } from "@/lib/site-images";
import type { LibraryType } from "@/types/library";
import BookCover from "./BookCover";
import LibrarySearch from "./LibrarySearch";
import { readingsLabel, type LibraryCardDoc } from "./shared";
import { filtersHref } from "./filters";

// Cabecera de /biblioteca: foto administrable (espacio biblioteca.hero) en una isla
// oscura corta con el título, y debajo, montado sobre su borde, el buscador.
// En escritorio, el abanico de portadas va sobre la foto, a la derecha.
export default function LibraryHero({
  images,
  covers,
  total,
  routes,
  types,
}: {
  images: readonly SlotPhoto[];
  covers: LibraryCardDoc[];
  total: number;
  routes: number;
  types: LibraryType[];
}) {
  const fan = covers.slice(0, 5);
  return (
    <section aria-labelledby="biblioteca-title" className="relative pb-10 sm:pb-12">
      <div
        data-tone="dark"
        className="relative isolate flex min-h-[46svh] items-end overflow-hidden bg-jmv-ink pb-14 pt-24 sm:min-h-[46vh] sm:pb-16 sm:pt-28 lg:min-h-[30rem]"
      >
        <HeroBackdrop images={images} carouselLabel="Fotos de la Biblioteca" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:px-8">
          <div className="min-w-0">
            {/* La ruta se ve desde sm; en móvil solo queda su JSON-LD para buscadores */}
            <Breadcrumbs items={[{ label: "Biblioteca" }]} jsonLd className="mb-6 hidden sm:block" />
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-jmv-gold-text sm:text-sm">
              Para leer, orar y compartir
            </p>
            <h1
              id="biblioteca-title"
              className="font-display text-5xl font-semibold leading-[1.02] text-white text-balance [text-shadow:0_2px_16px_rgb(15_23_42/0.45)] sm:text-6xl lg:text-7xl"
            >
              Biblioteca <span className="italic text-jmv-gold-text">JMV</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-snug text-slate-100 [text-shadow:0_1px_10px_rgb(15_23_42/0.6)] sm:mt-4 sm:text-xl">
              Lecturas para crecer en la fe, formarte y servir, desde tu celular.
            </p>
          </div>
          {fanNode(fan)}
        </div>
      </div>

      <div className="relative mx-auto -mt-7 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <LibrarySearch label="Buscar en la biblioteca" placeholder="¿Qué quieres leer hoy?" className="max-w-xl" />

          {types.length > 0 && (
            <nav aria-label="Atajos de la biblioteca" className="mt-5">
              <ul className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
                {types.map((t) => (
                  <li key={t}>
                    <Link
                      href={filtersHref({ tipo: t })}
                      className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-line-strong bg-surface px-4 text-sm font-medium text-fg shadow-card transition-colors hover:border-accent-gold/60 hover:bg-surface-2 dark:backdrop-blur"
                    >
                      {TYPE_LABELS[t]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {total > 0 && (
            <p className="mt-6 text-sm text-fg-muted">
              <strong className="font-semibold text-fg">{readingsLabel(total)}</strong>
              {routes > 0 && (
                <>
                  {" "}
                  · <strong className="font-semibold text-fg">{routes}</strong>{" "}
                  {routes === 1 ? "ruta de formación" : "rutas de formación"}
                </>
              )}{" "}
              · Gratis, para toda la familia JMV
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Abanico de portadas (solo escritorio) */
function fanNode(fan: LibraryCardDoc[]) {
  return (
    <div aria-hidden="true" className="relative hidden h-[22rem] lg:block">
      <StarsRing withCircle className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 text-jmv-gold-text opacity-20" />
      {fan.length > 0 ? (
        fan.map((doc, i) => {
          const mid = (fan.length - 1) / 2;
          const offset = i - mid;
          return (
            <div
              key={doc.id}
              className="absolute left-1/2 top-1/2 w-40 xl:w-44"
              style={{
                zIndex: 10 - Math.abs(Math.round(offset)),
                transform: `translate(-50%, -50%) translateX(${offset * 92}px) translateY(${Math.abs(offset) * 22}px) rotate(${offset * 7}deg)`,
              }}
            >
              <BookCover doc={doc} sizes="176px" />
            </div>
          );
        })
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-56 w-40 rounded-[3px_10px_10px_3px] border border-white/15 bg-white/[0.06]" />
        </div>
      )}
    </div>
  );
}
