"use client";

import { ArrowLeft, ArrowRight, BookOpen, Cross, Heart, Star, Users } from "lucide-react";
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
      className="scroll-mt-24 bg-gradient-to-b from-jmv-ink to-[#132f55] py-16 sm:py-20"
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
                    : "border-white/20 bg-white/5 text-white hover:bg-white/15"
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
              className="rounded-2xl border border-white/15 bg-white/5 p-6 text-white sm:p-8 lg:p-12"
            >
              <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icono className="h-8 w-8 text-jmv-gold-text" aria-hidden />
                </span>
                <div>
                  <h3 className="mb-2 text-2xl font-bold sm:text-3xl lg:text-4xl">{eje.titulo}</h3>
                  <p className="text-base leading-relaxed text-slate-200 sm:text-lg">{eje.descripcion}</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div>
                  <h4 className="mb-4 text-xl font-bold text-jmv-gold-text sm:text-2xl">Aspectos fundamentales</h4>
                  <ul className="space-y-3">
                    {eje.detalles.map((detalle) => (
                      <li key={detalle} className="flex items-start gap-3">
                        <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-jmv-gold-text" />
                        <span className="leading-relaxed text-slate-200">{detalle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-xl font-bold text-jmv-gold-text sm:text-2xl">Objetivos principales</h4>
                  <ol className="space-y-3">
                    {eje.objetivos.map((objetivo, n) => (
                      <li key={objetivo} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                        <span
                          aria-hidden
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-jmv-gold-text"
                        >
                          {n + 1}
                        </span>
                        <span className="leading-relaxed text-slate-200">{objetivo}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>
          );
        })}

        <nav aria-label="Navegar entre ejes" className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => select(active - 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-white hover:bg-white/15 sm:px-6"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
            Anterior
            <span className="sr-only">: {anterior.titulo}</span>
          </button>
          <p className="text-sm text-slate-300" aria-live="polite">
            {active + 1} de {total}
          </p>
          <button
            type="button"
            onClick={() => select(active + 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-white hover:bg-white/15 sm:px-6"
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
