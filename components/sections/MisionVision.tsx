import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { StarDivider } from "../brand";
import SiteImage from "../media/SiteImage";
import ReadMore from "../media/ReadMore";
import type { SlotPhoto } from "@/lib/site-images";

// Texto literal del Art. 5 de los Estatutos Nacionales (2010). Los estatutos no
// definen "misión" ni "visión": no añadir aquí nada que no esté en el documento.
const FINES = [
  {
    numeral: "5.1",
    texto:
      "Formar a sus miembros para que vivan la vocación cristiana tomando como modelo a la Virgen María. De ella toman el fiarse en Dios y su modelo de orar.",
  },
  {
    numeral: "5.2",
    texto:
      "A ejemplo de María al servicio de su prima Isabel, suscitar, animar y mantener, en la Asociación: prontitud y disponibilidad en el espíritu misionero y el apostolado a favor de los pobres, principalmente de los jóvenes víctimas de la pobreza espiritual y material. Les servirá el ejemplo misionero de San Vicente de Paúl, protector de la Asociación para el apostolado mediante el testimonio de vida y el servicio a los pobres.",
  },
  {
    numeral: "5.3",
    texto:
      "Procurar la promoción de sus miembros, personal y colectivamente, para colaborar en el seno de la Iglesia y de la sociedad, con toda clase de medios pastorales, culturales y creativos, con los demás agentes de Pastoral, según las orientaciones de la Jerarquía de la Iglesia universal y local.",
  },
];

// Fines de la Asociación y una cita de San Vicente, con la foto del espacio
// "quienes-somos.mision".
export default function MisionVision({ photo }: { photo?: SlotPhoto }) {
  return (
    <section
      id="fines"
      aria-labelledby="fines-titulo"
      className="scroll-mt-24 bg-gradient-to-b from-page via-section-blue to-section-blue py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="fines-titulo"
          eyebrow="Estatutos Nacionales"
          title="Fines de la Asociación"
          className="mb-8 sm:mb-12"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
          {photo && (
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface-2 shadow-card sm:aspect-[16/9] lg:aspect-auto lg:min-h-[32rem]">
              <SiteImage
                src={photo.src}
                alt={photo.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 460px, 100vw"
                className="object-cover"
                style={{ objectPosition: photo.position ?? "center" }}
              />
            </div>
          )}

          <div className="flex flex-col gap-5">
            <p className="text-lg leading-relaxed text-fg-soft">
              Constituyen fines y objetivos de la Asociación los siguientes:
            </p>

            <ol className="flex flex-col gap-4">
              {FINES.map((fin) => (
                <li
                  key={fin.numeral}
                  className="flex gap-4 rounded-2xl border border-line-card bg-surface-card p-5 shadow-card sm:p-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-jmv-gold font-display font-semibold text-jmv-ink">
                    {fin.numeral}
                  </span>
                  <ReadMore lines={5} className="min-w-0 flex-1">
                    <p className="leading-relaxed text-fg-soft">{fin.texto}</p>
                  </ReadMore>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="mt-8 text-center">
          <Link
            href="/quienes-somos/estatutos#articulo-5"
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
          >
            Leer en los Estatutos Nacionales (Art. 5)
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>

        <figure className="mx-auto mt-12 max-w-3xl text-center sm:mt-14">
          <StarDivider className="mb-5" />
          <blockquote className="font-display text-xl italic leading-relaxed text-fg sm:text-3xl">
            <p>
              “Entreguemos a Dios nuestras personas y nuestros bienes; Él cuidará
              de nosotros como cuida de las flores del campo y de las aves del
              cielo.”
            </p>
          </blockquote>
          <figcaption className="mt-4 text-fg-muted">
            <span className="font-semibold text-accent-gold">San Vicente de Paúl</span>
            , fundador de la Familia Vicenciana
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
