import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { StarsRing } from "@/components/brand";
import StarField from "@/components/calendario/StarField";
import { TYPE_LABELS } from "@/lib/biblioteca";
import type { LibraryType } from "@/types/library";
import BookCover from "./BookCover";
import LibrarySearch from "./LibrarySearch";
import { readingsLabel, type LibraryCardDoc } from "./shared";
import { filtersHref } from "./filters";

// Cabecera de /biblioteca: cielo nocturno con la luz cálida de una lámpara de
// lectura, el buscador al centro y un abanico de portadas (escritorio).
export default function LibraryHero({
  covers,
  total,
  routes,
  types,
}: {
  covers: LibraryCardDoc[];
  total: number;
  routes: number;
  types: LibraryType[];
}) {
  const fan = covers.slice(0, 5);
  return (
    <section aria-labelledby="biblioteca-title" className="relative isolate overflow-hidden bg-[#070d1d] pb-20 pt-28 sm:pb-24 sm:pt-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(60%_55%_at_78%_38%,rgba(217,143,6,0.26)_0%,transparent_70%),radial-gradient(90%_70%_at_30%_0%,#1d4e8a_0%,#0f2547_45%,#070d1d_100%)]"
      />
      <StarField seed={11} count={70} className="-z-10" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-jmv-ink" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:px-8">
        <div className="min-w-0">
          <Breadcrumbs items={[{ label: "Biblioteca" }]} jsonLd className="mb-8" />
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-jmv-gold-text">Para leer, orar y compartir</p>
          <h1
            id="biblioteca-title"
            className="font-display text-5xl font-semibold leading-[1.02] text-white text-balance sm:text-6xl lg:text-7xl"
          >
            Biblioteca <span className="italic text-jmv-gold-text">JMV</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            Lecturas para crecer en la fe, formarte y servir. Ábrelas desde tu celular y sigue donde te quedaste.
          </p>

          <LibrarySearch
            label="Buscar en la biblioteca"
            placeholder="¿Qué quieres leer hoy?"
            className="mt-8 max-w-xl"
          />

          {types.length > 0 && (
            <nav aria-label="Atajos de la biblioteca" className="mt-5">
              <ul className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
                {types.map((t) => (
                  <li key={t}>
                    <Link
                      href={filtersHref({ tipo: t })}
                      className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-white/20 bg-white/[0.06] px-4 text-sm font-medium text-white backdrop-blur transition-colors hover:border-jmv-gold-text/60 hover:bg-white/10"
                    >
                      {TYPE_LABELS[t]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {total > 0 && (
            <p className="mt-6 text-sm text-slate-300">
              <strong className="font-semibold text-white">{readingsLabel(total)}</strong>
              {routes > 0 && (
                <>
                  {" "}
                  · <strong className="font-semibold text-white">{routes}</strong>{" "}
                  {routes === 1 ? "ruta de formación" : "rutas de formación"}
                </>
              )}{" "}
              · Gratis, para toda la familia JMV
            </p>
          )}
        </div>

        <div aria-hidden="true" className="relative hidden h-[26rem] lg:block">
          <StarsRing withCircle className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 text-jmv-gold-text opacity-[0.14]" />
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
                  <BookCover doc={doc} priority={i === Math.round(mid)} sizes="176px" />
                </div>
              );
            })
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-56 w-40 rounded-[3px_10px_10px_3px] border border-white/15 bg-white/[0.04]" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
