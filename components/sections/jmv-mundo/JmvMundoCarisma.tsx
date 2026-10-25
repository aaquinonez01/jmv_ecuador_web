import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Qué comparte la JMV en todo el mundo. Los valores se detallan en /pilares.
export default function JmvMundoCarisma() {
  return (
    <section
      id="carisma-internacional"
      aria-labelledby="carisma-internacional-titulo"
      className="bg-gradient-to-b from-section-a to-section-blue py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative h-72 overflow-hidden rounded-3xl border border-line shadow-card sm:h-96">
          <Image
            src="/images/gallery/adoracion_santisimo.jpeg"
            alt="Jóvenes de JMV en adoración al Santísimo"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
            Nuestro carisma
          </p>
          <h2
            id="carisma-internacional-titulo"
            className="mb-6 text-3xl font-bold text-fg sm:text-4xl md:text-5xl"
          >
            ¿Qué vive la JMV?
          </h2>
          <p className="text-lg leading-relaxed text-fg-muted">
            Las Juventudes Marianas Vicencianas son la renovación de la antigua
            Asociación de Hijas e Hijos de María. Como parte de la Familia de San
            Vicente de Paúl, comparten un mismo carisma en todo el mundo: amor a
            María, servicio a los pobres y formación de los jóvenes, en comunión
            con la Iglesia.
          </p>
          <Link
            href="/pilares"
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
          >
            Así se vive en Ecuador: los cuatro pilares
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
