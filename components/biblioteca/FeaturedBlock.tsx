import Link from "next/link";
import { Clock, FileText, Lock, Sparkles } from "lucide-react";
import { AXIS_LABELS, TYPE_SINGULAR, libraryHref, readingTimeLabel } from "@/lib/biblioteca";
import { buttonVariants } from "@/components/ui/button-variants";
import { StarsRing } from "@/components/brand";
import BookCover from "./BookCover";
import ReadButton from "./ReadButton";
import { ACC_INK, docStyle, type LibraryCardDoc } from "./shared";

// Lectura destacada: portada grande inclinada, resumen y botón para empezar.
// Si hay más destacados, aparecen debajo en pequeño.
export default function FeaturedBlock({ docs }: { docs: LibraryCardDoc[] }) {
  const [main, ...rest] = docs;
  if (!main) return null;
  const time = readingTimeLabel(main.readingMinutes);

  return (
    <section aria-labelledby="destacado-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        style={docStyle(main)}
        className={`${ACC_INK} relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card-lg dark:bg-[#0b1426] px-5 py-8 sm:px-10 sm:py-12 lg:px-14`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_85%_30%,color-mix(in_oklab,var(--acc-l)_14%,transparent),transparent_70%),radial-gradient(60%_60%_at_0%_100%,rgba(217,143,6,0.12),transparent_70%)] dark:bg-[radial-gradient(70%_90%_at_85%_30%,color-mix(in_oklab,var(--from)_85%,transparent),transparent_70%),radial-gradient(60%_60%_at_0%_100%,rgba(217,143,6,0.14),transparent_70%)]"
        />
        <StarsRing
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[30rem] w-[30rem] text-(--acc-ink) opacity-[0.12]"
        />

        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-14">
          <div className="order-2 md:order-1">
            <p className="inline-flex items-center gap-2 rounded-full bg-jmv-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Te recomendamos
            </p>
            <h2
              id="destacado-title"
              className="mt-4 font-display text-3xl font-semibold leading-[1.08] text-fg text-balance sm:text-4xl lg:text-5xl"
            >
              <Link href={libraryHref(main.slug)} className="hover:text-accent-gold">
                {main.title}
              </Link>
            </h2>
            {main.author && <p className="mt-3 text-lg text-fg-soft">{main.author}</p>}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-soft sm:text-lg">{main.summary}</p>

            <ul className="mt-6 flex flex-wrap gap-2 text-sm text-fg-muted dark:text-slate-100" aria-label="Detalles">
              <li className="inline-flex items-center gap-1.5 rounded-full border border-fg/15 bg-fg/[0.06] px-3 py-1.5">
                <FileText className="h-4 w-4 text-(--acc-ink)" aria-hidden />
                {TYPE_SINGULAR[main.type]}
              </li>
              {main.axis && (
                <li className="rounded-full border border-fg/15 bg-fg/[0.06] px-3 py-1.5">{AXIS_LABELS[main.axis]}</li>
              )}
              {time && (
                <li className="inline-flex items-center gap-1.5 rounded-full border border-fg/15 bg-fg/[0.06] px-3 py-1.5">
                  <Clock className="h-4 w-4 text-(--acc-ink)" aria-hidden />
                  <span className="sr-only">Tiempo de lectura: </span>
                  {time}
                </li>
              )}
              {main.pageCount ? (
                <li className="rounded-full border border-fg/15 bg-fg/[0.06] px-3 py-1.5">{main.pageCount} páginas</li>
              ) : null}
              {main.visibility === "miembros" && (
                <li className="inline-flex items-center gap-1.5 rounded-full border border-accent-gold/40 bg-jmv-gold/10 px-3 py-1.5 text-accent-gold">
                  <Lock className="h-4 w-4" aria-hidden />
                  Solo miembros
                </li>
              )}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ReadButton doc={main} />
              <Link
                href={libraryHref(main.slug)}
                className={buttonVariants({ variant: "outlineAuto", size: "lg", className: "rounded-full dark:border-white/40" })}
              >
                Ver detalles
                <span className="sr-only">: {main.title}</span>
              </Link>
            </div>
          </div>

          <div className="order-1 mx-auto w-44 sm:w-56 md:order-2 md:w-full md:max-w-[18rem] lg:max-w-[21rem]">
            <div className="motion-safe:transition-transform motion-safe:duration-700 [perspective:1200px]">
              <div className="[transform:rotateY(-14deg)_rotateZ(1.5deg)] [transform-origin:left_center] drop-shadow-[0_30px_35px_rgba(15,23,42,0.32)] dark:drop-shadow-[0_40px_45px_rgba(0,0,0,0.55)]">
                <BookCover doc={main} priority sizes="(min-width: 1024px) 336px, (min-width: 768px) 288px, 224px" />
              </div>
            </div>
          </div>
        </div>

        {rest.length > 0 && (
          <div className="mt-10 border-t border-line pt-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">También destacamos</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(0, 3).map((doc) => (
                <li key={doc.id}>
                  <Link
                    href={libraryHref(doc.slug)}
                    className="group flex min-h-11 items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-fg/[0.06]"
                  >
                    <div className="w-14 shrink-0">
                      <BookCover doc={doc} sizes="56px" />
                    </div>
                    <span className="min-w-0">
                      <span className="line-clamp-2 font-semibold text-fg group-hover:text-accent-gold">{doc.title}</span>
                      {doc.author && <span className="mt-0.5 block truncate text-sm text-fg-muted">{doc.author}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
