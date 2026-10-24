import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, Map, MapPin, Users } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonVariants } from "@/components/ui/button-variants";

const CONTINENTES = [
  { region: "África", consejera: "Maria Sfeir", pais: "Líbano" },
  { region: "América", consejera: "Catarina Érika Morais", pais: "Brasil" },
  { region: "Asia-Oceanía", consejera: "Marie Claire Solon Balo", pais: "Filipinas" },
  { region: "Europa", consejera: "Martha Araújo", pais: "Portugal" },
];

const PAISES_ANDINA = ["Colombia", "Ecuador", "Perú", "Bolivia", "Venezuela"];

export default function JmvMundoRegiones() {
  return (
    <section
      id="regiones"
      aria-labelledby="regiones-titulo"
      className="bg-gradient-to-b from-[#132f55] to-jmv-ink py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="regiones-titulo"
          eyebrow="Presencia mundial"
          title="Una JMV por continentes"
          description="El Consejo Internacional cuenta con una consejera o un consejero para cada continente, que acompaña y articula la vida de la JMV en su región."
        />

        <ul className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTINENTES.map((c) => (
            <li key={c.region} className="h-full rounded-2xl border border-white/15 bg-white/5 p-6 text-center">
              <Globe2 className="mx-auto mb-3 h-8 w-8 text-jmv-gold-text" aria-hidden />
              <h3 className="mb-3 text-xl font-bold text-jmv-gold-text">{c.region}</h3>
              <p className="flex items-center justify-center gap-2 font-medium text-white">
                <Users className="h-4 w-4 text-jmv-gold-text" aria-hidden />
                {c.consejera}
              </p>
              <p className="mt-1 text-sm text-slate-300">{c.pais}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-300">Consejera continental</p>
            </li>
          ))}
        </ul>

        <figure className="relative mb-12 h-64 overflow-hidden rounded-3xl border border-white/15 sm:h-80">
          <Image
            src="/images/gallery/encuentro_nacional_2025.jpg"
            alt="Jóvenes de JMV Ecuador con sus banderas en un encuentro nacional"
            fill
            loading="lazy"
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jmv-ink/90 via-jmv-ink/20 to-transparent" />
          <figcaption className="absolute bottom-0 left-0 max-w-xl p-6 text-lg font-medium text-white sm:p-8 sm:text-xl">
            Los encuentros unen a los jóvenes vicencianos de toda la familia.
          </figcaption>
        </figure>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-4 inline-flex items-center rounded-full border border-jmv-gold-text/40 px-4 py-2 text-sm font-medium text-jmv-gold-text">
                <Map className="mr-2 h-4 w-4" aria-hidden />
                JMV Latinoamericana · Región Andina
              </p>
              <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">El lugar de JMV Ecuador</h3>
              <p className="mb-4 leading-relaxed text-slate-200">
                Dentro del continente americano, la JMV se articula también por
                zonas. JMV Ecuador forma parte de la <strong>Región Andina</strong>,
                que reúne a las JMV de los países que comparten la cordillera de los
                Andes y un mismo camino pastoral y vicenciano.
              </p>
              <p className="leading-relaxed text-slate-300">
                Esta cercanía permite compartir encuentros, formación y misión entre
                los jóvenes de la región, fortaleciendo los lazos de la gran familia
                mariana vicenciana en Latinoamérica.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-jmv-ink/50 p-6">
              <h4 className="mb-4 flex items-center text-lg font-semibold text-white">
                <MapPin className="mr-2 h-5 w-5 text-jmv-gold-text" aria-hidden />
                Países de la Región Andina
              </h4>
              <ul className="grid grid-cols-2 gap-3">
                {PAISES_ANDINA.map((pais) => (
                  <li
                    key={pais}
                    className={`rounded-lg border px-4 py-3 text-center font-medium ${
                      pais === "Ecuador"
                        ? "border-jmv-gold-text/60 bg-jmv-gold-text/10 text-jmv-gold-text"
                        : "border-white/10 bg-white/5 text-slate-200"
                    }`}
                  >
                    {pais}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-center text-sm text-slate-300">
                La conformación de la región puede variar según los encuentros y la
                organización pastoral de cada periodo.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-jmv-gold-text/30 bg-jmv-blue p-8 text-center sm:p-12">
          <h3 className="mb-4 text-3xl font-bold text-white">De la familia mundial a tu comunidad</h3>
          <p className="mx-auto mb-8 max-w-2xl text-slate-100">
            JMV Ecuador es la expresión local de esta gran familia presente en los
            cinco continentes. Conoce cómo nos organizamos en el país y súmate.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/estructura" className={buttonVariants({ variant: "gold", size: "lg" })}>
              Estructura de JMV Ecuador
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </Link>
            <Link href="/unete" className={buttonVariants({ variant: "outlineLight", size: "lg" })}>
              Quiero participar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
