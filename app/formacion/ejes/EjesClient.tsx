"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Cross, Heart, Library, Star, Users } from "lucide-react";
import { useTabs } from "@/components/sections/institucional/useTabs";

const ejesFormativos = [
  {
    id: "humano",
    titulo: "Eje humano",
    icono: BookOpen,
    descripcion:
      "Desarrollo integral de la persona, potenciando valores, colaboración y solidaridad.",
    detalles: [
      "Formación en liderazgo y comunicación efectiva",
      "Desarrollo de habilidades interpersonales",
      "Potenciación de talentos individuales",
      "Construcción de valores sólidos",
      "Fomento del trabajo en equipo",
      "Crecimiento personal y autoconocimiento",
    ],
    objetivos: [
      "Formar líderes íntegros y comprometidos",
      "Desarrollar capacidades de comunicación",
      "Fortalecer la autoestima y confianza",
      "Promover la colaboración y solidaridad",
    ],
  },
  {
    id: "cristocentrico",
    titulo: "Eje cristocéntrico",
    icono: Cross,
    descripcion:
      "Encuentro personal con Cristo evangelizador de los pobres, viviendo las virtudes cristianas.",
    detalles: [
      "Encuentro personal con Jesucristo",
      "Vivencia de las virtudes de humildad y obediencia",
      "Práctica de la caridad y pureza",
      "Evangelización comprometida",
      "Oración y vida sacramental",
      "Testimonio cristiano en la sociedad",
    ],
    objetivos: [
      "Profundizar la relación personal con Cristo",
      "Vivir las virtudes cristianas auténticamente",
      "Ser evangelizadores de los pobres",
      "Integrar fe y vida cotidiana",
    ],
  },
  {
    id: "mariano",
    titulo: "Eje mariano",
    icono: Star,
    descripcion:
      "María como modelo de fe y seguimiento, espiritualidad basada en el Magníficat.",
    detalles: [
      "María como modelo de todos los creyentes",
      "Espiritualidad del Magníficat",
      'Consagración mariana "a Jesús con María"',
      "Virtudes marianas en la vida diaria",
      "Devoción a la Medalla Milagrosa",
      "Imitación de la fe y humildad de María",
    ],
    objetivos: [
      "Imitar las virtudes de María Santísima",
      "Vivir la espiritualidad del Magníficat",
      "Consagrarse totalmente a Jesús por María",
      "Ser testimonio de fe como María",
    ],
  },
  {
    id: "vicenciano",
    titulo: "Eje vicenciano",
    icono: Heart,
    descripcion:
      "Inspiración en el carisma de San Vicente de Paúl, servicio preferencial a los pobres.",
    detalles: [
      "Carisma de San Vicente de Paúl",
      "Servicio preferencial a los más pobres",
      "Evangelización y promoción humana",
      "Justicia social y transformación",
      "Creatividad en el servicio",
      "Amor efectivo y afectivo hacia los necesitados",
    ],
    objetivos: [
      "Vivir el carisma vicenciano auténticamente",
      "Servir preferencialmente a los pobres",
      "Promover la justicia social",
      "Ser agentes de transformación social",
    ],
  },
  {
    id: "eclesial",
    titulo: "Eje eclesial",
    icono: Users,
    descripcion:
      "Compromiso activo en la Iglesia, trabajando en comunión con pastores y laicos.",
    detalles: [
      "Participación activa en la vida eclesial",
      "Comunión con pastores y laicos",
      "Compromiso en diócesis y parroquias",
      "Formación en doctrina social de la Iglesia",
      "Apostolado laical comprometido",
      "Construcción del Reino de Dios",
    ],
    objetivos: [
      "Fortalecer la pertenencia eclesial",
      "Trabajar en comunión con la jerarquía",
      "Participar activamente en la misión de la Iglesia",
      "Construir el Reino de Dios en la sociedad",
    ],
  },
];

export default function EjesClient() {
  const { active, select, getTabProps, getPanelProps } = useTabs(ejesFormativos.length, "eje");
  const total = ejesFormativos.length;
  const anterior = ejesFormativos[(active - 1 + total) % total];
  const siguiente = ejesFormativos[(active + 1) % total];

  return (
    <section
      id="ejes"
      aria-labelledby="ejes-titulo"
      className="scroll-mt-24 bg-gradient-to-b from-section-a to-section-blue py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="ejes-titulo" className="sr-only">
          Los cinco ejes formativos
        </h2>

        <div
          role="tablist"
          aria-label="Ejes formativos"
          className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {ejesFormativos.map((eje, index) => {
            const Icono = eje.icono;
            const selected = active === index;
            return (
              <button
                key={eje.id}
                {...getTabProps(index)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors sm:px-5 ${
                  selected
                    ? "border-jmv-gold bg-jmv-gold text-jmv-ink"
                    : "border-line-strong bg-surface text-fg shadow-card hover:bg-surface-2 dark:hover:bg-white/15"
                }`}
              >
                <Icono className="h-4 w-4" aria-hidden />
                {eje.titulo}
              </button>
            );
          })}
        </div>

        {ejesFormativos.map((eje, index) => {
          const Icono = eje.icono;
          return (
            <article
              key={eje.id}
              {...getPanelProps(index)}
              className="rounded-2xl border border-fg/15 bg-surface p-6 text-fg shadow-card sm:p-8 lg:p-12"
            >
              <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-2">
                  <Icono className="h-8 w-8 text-accent-gold" aria-hidden />
                </span>
                <div>
                  <h3 className="mb-2 text-2xl font-bold sm:text-3xl lg:text-4xl">{eje.titulo}</h3>
                  <p className="text-base leading-relaxed text-fg-muted sm:text-lg">{eje.descripcion}</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div>
                  <h4 className="mb-4 text-xl font-bold text-accent-gold sm:text-2xl">Aspectos fundamentales</h4>
                  <ul className="space-y-3">
                    {eje.detalles.map((detalle) => (
                      <li key={detalle} className="flex items-start gap-3">
                        <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-gold" />
                        <span className="leading-relaxed text-fg-muted">{detalle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-xl font-bold text-accent-gold sm:text-2xl">Objetivos principales</h4>
                  <ol className="space-y-3">
                    {eje.objetivos.map((objetivo, n) => (
                      <li key={objetivo} className="flex items-start gap-3 rounded-xl border border-line bg-surface-2 p-4 dark:bg-white/5">
                        <span
                          aria-hidden
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-accent-gold ring-1 ring-line dark:bg-white/10 dark:ring-0"
                        >
                          {n + 1}
                        </span>
                        <span className="leading-relaxed text-fg-muted">{objetivo}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <Link
                href={`/biblioteca?eje=${eje.id}`}
                className="group mt-8 flex items-center gap-4 rounded-xl border border-accent-gold/40 bg-jmv-gold/10 p-4 transition-colors hover:bg-jmv-gold/15 dark:bg-accent-gold/10 dark:hover:bg-accent-gold/15 sm:p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink">
                  <Library className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-fg">Lecturas del {eje.titulo.toLowerCase()}</span>
                  <span className="block text-sm text-fg-muted">Libros y guías de la Biblioteca JMV para profundizar.</span>
                </span>
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-accent-gold transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </article>
          );
        })}

        <nav aria-label="Navegar entre ejes" className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => select(active - 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-fg shadow-card hover:bg-surface-2 dark:hover:bg-white/15 sm:px-6"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
            Anterior
            <span className="sr-only">: {anterior.titulo}</span>
          </button>
          <p className="text-sm text-fg-muted" aria-live="polite">
            {active + 1} de {total}
          </p>
          <button
            type="button"
            onClick={() => select(active + 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-fg shadow-card hover:bg-surface-2 dark:hover:bg-white/15 sm:px-6"
          >
            Siguiente
            <span className="sr-only">: {siguiente.titulo}</span>
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
        </nav>
      </div>
    </section>
  );
}
