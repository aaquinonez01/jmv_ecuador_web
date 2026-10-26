import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteImage from "@/components/media/SiteImage";
import ReadMore from "@/components/media/ReadMore";
import { fetchSlotImages } from "@/lib/api/site-images.server";

// Qué comparte la JMV en todo el mundo. Los valores se detallan en /pilares.
export default async function JmvMundoCarisma() {
  const [foto] = await fetchSlotImages("jmv-mundo.carisma");

  return (
    <section
      id="carisma-internacional"
      aria-labelledby="carisma-internacional-titulo"
      className="bg-gradient-to-b from-section-a to-section-blue py-14 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {foto && (
          <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-line shadow-card lg:aspect-auto lg:h-96">
            <SiteImage
              src={foto.src}
              alt={foto.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: foto.position ?? "center" }}
            />
          </div>
        )}

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent-gold">
            Nuestro carisma
          </p>
          <h2
            id="carisma-internacional-titulo"
            className="mb-4 text-3xl font-bold text-fg sm:mb-6 sm:text-4xl md:text-5xl"
          >
            ¿Qué vive la JMV?
          </h2>
          <ReadMore lines={4}>
            <p className="text-lg leading-relaxed text-fg-soft">
              Las Juventudes Marianas Vicencianas son una asociación internacional de la Familia de San Vicente de
              Paúl. Nacieron de las apariciones de la Virgen de la Medalla Milagrosa en 1830 y hoy están presentes en
              los cinco continentes. JMV Ecuador es parte de esta gran familia.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-fg-soft">
              Son la renovación de la antigua Asociación de Hijas e Hijos de María. Como parte de la Familia de San
              Vicente de Paúl, comparten un mismo carisma en todo el mundo: amor a María, servicio a los pobres y
              formación de los jóvenes, en comunión con la Iglesia.
            </p>
          </ReadMore>
          <Link
            href="/pilares"
            className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg sm:mt-6"
          >
            Así se vive en Ecuador: los cuatro pilares
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
