import Link from "next/link";
import { ArrowRight, BadgeCheck, ScrollText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { STATUTES_PATH } from "./content";

// Bloque "Nuestros estatutos" para la página Quiénes somos.
export default function EstatutosTeaser() {
  return (
    <section aria-labelledby="estatutos-teaser" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-jmv-ink via-[#163a68] to-jmv-blue p-8 text-white sm:p-12">
          <ScrollText aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 text-white/5 sm:h-64 sm:w-64" />
          <div className="relative max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">Nuestros estatutos</p>
            <h2 id="estatutos-teaser" className="font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl">
              Las reglas que nos dimos para caminar juntos
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-200">
              Quiénes somos, para qué existimos, cómo elegimos a nuestro Consejo y cómo cuidamos lo que tenemos. Léelos en
              2 minutos o artículo por artículo, con buscador y glosario.
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm text-slate-200">
              <BadgeCheck className="h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
              Aprobados por el Director General de la Asociación
            </p>
            <Link href={STATUTES_PATH} className={buttonVariants({ variant: "gold", size: "lg", className: "mt-8" })}>
              Leer los estatutos
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
