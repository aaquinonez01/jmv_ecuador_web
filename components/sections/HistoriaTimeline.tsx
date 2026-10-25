import Image from "next/image";
import { MapPin } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { MarianMonogram, StarsRing } from "../brand";
import { SITE, yearsSinceFoundation } from "@/lib/site";

interface Hito {
  year: string;
  /** Lugar solo cuando consta en el contenido histórico */
  lugar?: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
}

// "De la rue du Bac a Quito": hitos ordenados desde las apariciones de 1830.
const hitos: Hito[] = [
  {
    year: "1830",
    lugar: "Rue du Bac, París",
    title: "Origen en París: apariciones de la Medalla Milagrosa",
    description:
      'El 18 de julio de 1830, la Virgen se aparece a Santa Catalina Labouré en la capilla de la rue du Bac y le revela su deseo de formar una asociación de jóvenes que imiten a Jesús. Nace con el nombre de "Hijas de María Inmaculada", con el P. Aladel como primer director y Benigna Hairón como primera Hija de María. Las primeras reuniones se llamaban "Cenáculos Marianos".',
    image: { src: "/images/historia/catalina.jpg", alt: "Santa Catalina Labouré" },
  },
  {
    year: "1847",
    title: "Aprobación pontificia de Pío IX",
    description:
      "El 20 de junio de 1847, el papa Pío IX aprueba oficialmente la Asociación de Hijas de María, reconociendo en un primer momento a los grupos de París como obra eclesial.",
    image: { src: "/images/historia/pio_9.jpg", alt: "Retrato del papa Pío IX" },
  },
  {
    year: "1850",
    title: "Expansión y apertura a la rama masculina",
    description:
      'El 19 de julio de 1850 se aprueban los demás grupos de Francia y del extranjero, y la asociación se abre a los jóvenes varones. Pasa a llamarse "Hijos e Hijas de María Inmaculada" y se extiende junto a las Hijas de la Caridad y los Padres Paúles.',
    image: {
      src: "/images/historia/hijas_hijos.webp",
      alt: "Antiguo grupo de Hijos e Hijas de María Inmaculada",
    },
  },
  {
    year: "1987",
    title: "Nace la asociación JMV",
    description:
      'El 28 de abril de 1987, el Superior General de la Congregación de la Misión y de las Hijas de la Caridad reconoce y actualiza la asociación con su nombre oficial de entonces: "Asociación Juventud Mariana Vicentina" (JMV).',
    image: { src: "/images/historia/fundacion.jpg", alt: "Reconocimiento de la asociación en 1987" },
  },
  {
    year: String(SITE.foundedYear),
    lugar: "Quito, Ecuador",
    title: "Fundación de JMV Ecuador",
    description:
      'El 18 de julio de 1995, tras un encuentro en México donde Sor Noemí Miño recibe la motivación y la información necesarias, JMV se funda en Ecuador. El primer grupo del país fue el de la "Medalla Milagrosa" de Quito, desde donde se formó un equipo de jóvenes para visitar y acompañar a otros grupos en todo el país.',
    image: {
      src: "/images/historia/jmv_ecuador_fundacion.jpg",
      alt: "Primeros jóvenes de JMV Ecuador",
    },
  },
  {
    year: "1999",
    title: "Aprobación de los estatutos",
    description:
      "El P. Robert P. Maloney, entonces Superior General, aprueba los estatutos de la asociación y consolida el marco que la rige en todo el mundo.",
    image: { src: "/images/historia/jmv_padre_maloney.png", alt: "P. Robert P. Maloney, CM" },
  },
  {
    year: "2000",
    title: "Aprobación oficial de JMV Ecuador",
    description:
      "El 12 de junio de 2000, el P. Robert P. Maloney, Director General de la asociación, aprueba oficialmente JMV Ecuador y reconoce al primer Consejo Nacional, liderado por el P. Jhon Macías, Sor Noemí Miño y Juan Carlos Cajo.",
  },
  {
    year: "2025",
    title: "30 años de JMV Ecuador",
    description:
      "Tres décadas después de aquella semilla en tierra ecuatoriana, JMV es un segundo hogar para miles de jóvenes que crecen como buenos cristianos y sirven al pobre al estilo de San Vicente de Paúl, Santa Luisa de Marillac y Santa Catalina Labouré.",
    image: { src: "/images/historia/jmv_20.jpg", alt: "Celebración de los 30 años de JMV Ecuador" },
  },
];

export default function HistoriaTimeline() {
  return (
    <section
      id="historia"
      aria-labelledby="historia-titulo"
      className="scroll-mt-24 bg-gradient-to-b from-page via-section-blue to-page py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="historia-titulo"
          eyebrow="Línea de tiempo"
          title="De la rue du Bac a Quito"
          description={`De las apariciones de la Medalla Milagrosa en París hasta los ${yearsSinceFoundation()} años de JMV en Ecuador.`}
        />

        <ol className="relative space-y-10 border-l-2 border-accent-gold/40 pl-6 sm:pl-10">
          {hitos.map((hito) => (
            <li key={hito.year} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[2.05rem] top-1.5 h-4 w-4 rounded-full border-4 border-page bg-accent-gold sm:-left-[3.05rem]"
              />
              <article className="grid overflow-hidden rounded-2xl border border-line bg-surface shadow-card dark:border-white/15 dark:bg-white/5 md:grid-cols-[1fr_16rem]">
                <div className="p-5 sm:p-6">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-2xl font-bold text-accent-gold">{hito.year}</span>
                    {hito.lugar && (
                      <span className="inline-flex items-center gap-1 text-sm text-fg-subtle dark:text-slate-300">
                        <MapPin className="h-4 w-4" aria-hidden />
                        {hito.lugar}
                      </span>
                    )}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-fg">{hito.title}</h3>
                  <p className="mt-3 leading-relaxed text-fg-muted">{hito.description}</p>
                </div>
                <div className="relative order-first aspect-[16/9] bg-surface-sunken dark:bg-jmv-ink md:order-none md:aspect-auto md:min-h-56">
                  {hito.image ? (
                    <Image
                      src={hito.image.src}
                      alt={hito.image.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 256px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center text-accent-gold/40"
                    >
                      <StarsRing className="absolute h-44 w-44" />
                      <MarianMonogram className="h-20 w-16" strokeWidth={4} />
                    </div>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
