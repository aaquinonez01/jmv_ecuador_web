import Link from "next/link";
import { ArrowRight, Eye, Target } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { StarDivider } from "../brand";
import SiteImage from "../media/SiteImage";
import ReadMore from "../media/ReadMore";
import type { SlotPhoto } from "@/lib/site-images";

// Misión, visión y una cita de San Vicente, con la foto del espacio
// "quienes-somos.mision". Los valores se desarrollan en /pilares para no
// repetirlos aquí. En móvil los textos largos se pliegan con "Leer más".
export default function MisionVision({ photo, intro }: { photo?: SlotPhoto; intro?: string }) {
  return (
    <section
      id="mision"
      aria-labelledby="mision-titulo"
      className="scroll-mt-24 bg-gradient-to-b from-page via-section-blue to-section-blue py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="mision-titulo"
          eyebrow="Nuestra identidad"
          title="Misión y visión"
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
            {intro && (
              <ReadMore lines={3}>
                <p className="text-lg leading-relaxed text-fg-soft">{intro}</p>
              </ReadMore>
            )}

            <article className="rounded-2xl border border-line-card bg-surface-card p-5 shadow-card sm:p-7">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-jmv-red text-white">
                  <Target className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="text-2xl font-bold text-fg">Misión</h3>
              </div>
              <ReadMore lines={4}>
                <p className="leading-relaxed text-fg-soft sm:text-lg">
                  Formar integralmente a jóvenes comprometidos con la fe católica y el servicio a los pobres, viviendo
                  el carisma vicenciano bajo la protección maternal de María, para ser agentes de transformación en la
                  sociedad ecuatoriana.
                </p>
              </ReadMore>
            </article>

            <article className="rounded-2xl border border-line-card bg-surface-card p-5 shadow-card sm:p-7">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink">
                  <Eye className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="text-2xl font-bold text-fg">Visión</h3>
              </div>
              <ReadMore lines={4}>
                <p className="leading-relaxed text-fg-soft sm:text-lg">
                  Ser una comunidad juvenil referente en Ecuador por la vivencia auténtica del carisma vicenciano, que
                  contribuye a la transformación social y a la evangelización de las nuevas generaciones a través del
                  testimonio y el servicio.
                </p>
              </ReadMore>
            </article>
          </div>
        </div>

        <p className="mt-8 text-center text-fg-muted">
          Esta misión se sostiene en cuatro pilares: comunidad, espiritualidad,
          apostolado y formación.{" "}
          <Link
            href="/pilares"
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
          >
            Conoce los pilares
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
