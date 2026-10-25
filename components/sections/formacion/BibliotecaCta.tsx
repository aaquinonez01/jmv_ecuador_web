import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import StarsRing from "@/components/brand/StarsRing";
import MarianMonogram from "@/components/brand/MarianMonogram";
import { buttonVariants } from "@/components/ui/Button";
import { AXIS_LABELS } from "@/lib/biblioteca";
import type { LibraryAxis } from "@/types/library";

const AXES = Object.keys(AXIS_LABELS) as LibraryAxis[];

// Lomos decorativos: sugieren una estantería sin depender de portadas reales
const SPINES = [
  { h: "h-40", w: "w-9", bg: "bg-jmv-gold", tilt: "" },
  { h: "h-48", w: "w-11", bg: "bg-white", tilt: "" },
  { h: "h-44", w: "w-8", bg: "bg-[#2f6db5]", tilt: "" },
  { h: "h-36", w: "w-10", bg: "bg-jmv-gold-text", tilt: "rotate-[8deg] origin-bottom-left" },
];

/** Invitación a la Biblioteca JMV desde las páginas de formación */
export default function BibliotecaCta({ className = "" }: { className?: string }) {
  return (
    <section aria-labelledby="biblioteca-cta-titulo" className={className}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-jmv-gold-text/40 bg-gradient-to-br from-jmv-blue to-jmv-ink p-6 text-white shadow-2xl sm:p-10">
          <StarsRing
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-jmv-gold-text/15"
          />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">
                <BookOpen className="h-4 w-4" aria-hidden />
                Biblioteca JMV
              </p>
              <h2
                id="biblioteca-cta-titulo"
                className="font-display text-3xl font-semibold leading-tight sm:text-4xl"
              >
                Lee, ora y crece a tu ritmo
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-slate-200">
                Libros, documentos y guías de formación para leer desde el celular. Tu avance se
                guarda en tu teléfono: retoma donde te quedaste, sin crear cuenta.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Explorar por eje formativo">
                {AXES.map((axis) => (
                  <li key={axis}>
                    <Link
                      href={`/biblioteca?eje=${axis}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-white/25 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:border-jmv-gold-text hover:bg-white/10"
                    >
                      {AXIS_LABELS[axis]}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/biblioteca"
                className={buttonVariants({ variant: "gold", size: "md", className: "group mt-6 gap-2" })}
              >
                Abrir la biblioteca
                <ArrowRight
                  className="h-5 w-5 transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </div>

            <div aria-hidden className="hidden items-end gap-1.5 md:flex">
              {SPINES.map((spine, i) => (
                <span
                  key={i}
                  className={`relative flex ${spine.h} ${spine.w} ${spine.bg} ${spine.tilt} items-start justify-center rounded-sm pt-3 shadow-lg ring-1 ring-black/10`}
                >
                  <span className="h-px w-1/2 bg-jmv-ink/30" />
                  {i === 1 && (
                    <MarianMonogram className="absolute bottom-4 h-6 w-6 text-jmv-blue" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
