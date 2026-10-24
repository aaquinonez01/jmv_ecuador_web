import Link from "next/link";
import { ArrowRight, Eye, Target } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { StarDivider } from "../brand";

// Misión, visión y una cita de San Vicente. Los valores se desarrollan en /pilares
// para no repetirlos aquí.
export default function MisionVision() {
  return (
    <section
      id="mision"
      aria-labelledby="mision-titulo"
      className="scroll-mt-24 bg-gradient-to-b from-jmv-ink via-[#132f55] to-[#132f55] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="mision-titulo"
          eyebrow="Nuestra identidad"
          title="Misión y visión"
          description="Lo que nos mueve cada día como Juventudes Marianas Vicencianas."
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <article className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-jmv-red text-white">
                <Target className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">Misión</h3>
            </div>
            <p className="text-lg leading-relaxed text-slate-200">
              Formar integralmente a jóvenes comprometidos con la fe católica y el
              servicio a los pobres, viviendo el carisma vicenciano bajo la
              protección maternal de María, para ser agentes de transformación en
              la sociedad ecuatoriana.
            </p>
          </article>

          <article className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink">
                <Eye className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">Visión</h3>
            </div>
            <p className="text-lg leading-relaxed text-slate-200">
              Ser una comunidad juvenil referente en Ecuador por la vivencia
              auténtica del carisma vicenciano, que contribuye a la transformación
              social y a la evangelización de las nuevas generaciones a través del
              testimonio y el servicio.
            </p>
          </article>
        </div>

        <p className="mt-8 text-center text-slate-300">
          Esta misión se sostiene en cuatro pilares: comunidad, espiritualidad,
          apostolado y formación.{" "}
          <Link
            href="/pilares"
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-jmv-gold-text underline underline-offset-4 hover:text-white"
          >
            Conoce los pilares
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>

        <figure className="mx-auto mt-14 max-w-3xl text-center">
          <StarDivider className="mb-6" />
          <blockquote className="font-display text-2xl italic leading-relaxed text-white sm:text-3xl">
            <p>
              “Entreguemos a Dios nuestras personas y nuestros bienes; Él cuidará
              de nosotros como cuida de las flores del campo y de las aves del
              cielo.”
            </p>
          </blockquote>
          <figcaption className="mt-4 text-slate-300">
            <span className="font-semibold text-jmv-gold-text">San Vicente de Paúl</span>
            , fundador de la Familia Vicenciana
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
