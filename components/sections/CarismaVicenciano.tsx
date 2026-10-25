"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandHeart, Lightbulb, Quote, Star, Users } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { StarsRing } from "../brand";
import { useTabs } from "./institucional/useTabs";

const santos = [
  {
    id: "vicente",
    nombre: "San Vicente de Paúl",
    subtitulo: "El padre de los pobres",
    anios: "1581 – 1660",
    descripcion:
      "Sacerdote francés que dedicó su vida al servicio de los más necesitados. Fundador de la Congregación de la Misión y de las Hijas de la Caridad.",
    ensenanzas: [
      "El amor es inventivo hasta el infinito",
      "Hay que servir a los pobres como a nuestros amos y señores",
      "La humildad es la base de toda virtud",
    ],
    hoy: "Su ejemplo nos inspira a ver en cada persona necesitada el rostro de Cristo y a servir con entrega generosa.",
    imagen: null as string | null,
  },
  {
    id: "catalina",
    nombre: "Santa Catalina Labouré",
    subtitulo: "Vidente de la Medalla Milagrosa",
    anios: "1806 – 1876",
    descripcion:
      "Hija de la Caridad francesa a quien la Virgen María se apareció en 1830 en la rue du Bac, en París, y le confió la Medalla Milagrosa, que une a toda la Familia Vicenciana.",
    ensenanzas: [
      "María es nuestra Madre y Mediadora",
      "La oración transforma los corazones",
      "La sencillez abre el corazón a Dios",
    ],
    hoy: "Su devoción mariana nos enseña a vivir bajo la protección de María y a fortalecer nuestro compromiso con los más necesitados.",
    imagen: "/images/historia/catalina.jpg" as string | null,
  },
];

const carismaHoy = [
  {
    icon: HandHeart,
    titulo: "Amor afectivo y efectivo",
    descripcion:
      "No basta con sentir compasión: actuamos de forma concreta para transformar la realidad de quien sufre.",
  },
  {
    icon: Users,
    titulo: "Sencillez y humildad",
    descripcion:
      "Nos acercamos a los demás sin pretensiones, con corazón sencillo y espíritu de servicio.",
  },
  {
    icon: Lightbulb,
    titulo: "Creatividad en el servicio",
    descripcion:
      "Buscamos nuevas formas de responder a las necesidades que van surgiendo en nuestras comunidades.",
  },
];

export default function CarismaVicenciano() {
  const { active, getTabProps, getPanelProps } = useTabs(santos.length, "carisma");

  return (
    <section
      aria-labelledby="carisma-titulo"
      className="bg-section-blue py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="carisma-titulo"
          eyebrow="Nuestras raíces"
          title="Carisma vicenciano"
          description="Dos santos están en el origen de nuestra manera de vivir el Evangelio: San Vicente de Paúl y Santa Catalina Labouré."
        />

        <div
          role="tablist"
          aria-label="Santos del carisma vicenciano"
          className="mx-auto mb-8 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-line bg-surface p-2 shadow-card sm:flex-row dark:border-white/15 dark:bg-white/5"
        >
          {santos.map((s, i) => (
            <button
              key={s.id}
              {...getTabProps(i)}
              className={`min-h-12 flex-1 rounded-xl px-4 py-2 text-base font-semibold transition-colors ${
                active === i
                  ? "bg-jmv-gold text-jmv-ink"
                  : "text-fg hover:bg-surface-2"
              }`}
            >
              {s.nombre}
            </button>
          ))}
        </div>

        {santos.map((s, i) => (
          <div key={s.id} {...getPanelProps(i)} className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <article className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8 dark:border-white/15 dark:bg-white/5">
              <h3 className="text-2xl font-bold text-fg">{s.nombre}</h3>
              <p className="font-medium text-accent-gold">{s.subtitulo}</p>
              <p className="text-sm text-fg-subtle dark:text-slate-300">{s.anios}</p>

              <p className="mt-5 text-lg leading-relaxed text-fg-muted">{s.descripcion}</p>

              <h4 className="mt-6 mb-3 text-lg font-bold text-fg">Enseñanzas principales</h4>
              <ul className="space-y-2">
                {s.ensenanzas.map((e) => (
                  <li key={e} className="flex items-start gap-3">
                    <Star className="mt-1 h-4 w-4 shrink-0 text-accent-gold" aria-hidden />
                    <span className="italic text-fg-muted">“{e}”</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-line bg-surface-2 p-4 dark:bg-white/5">
                <h4 className="mb-1 font-semibold text-accent-gold">Para nuestra vida hoy</h4>
                <p className="text-fg-muted">{s.hoy}</p>
              </div>
            </article>

            {s.imagen ? (
              <figure className="relative min-h-80 overflow-hidden rounded-2xl border border-line shadow-card dark:border-white/15">
                <Image
                  src={s.imagen}
                  alt={`Imagen de ${s.nombre}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </figure>
            ) : (
              <figure className="relative flex min-h-80 flex-col items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface p-8 text-center shadow-card dark:border-white/15 dark:bg-jmv-ink">
                <StarsRing
                  withCircle
                  className="pointer-events-none absolute h-80 w-80 text-accent-gold/15"
                />
                <Quote className="relative mb-4 h-10 w-10 text-accent-gold" aria-hidden />
                <blockquote className="relative font-display text-2xl italic leading-snug text-fg sm:text-3xl">
                  <p>“{s.ensenanzas[0]}”</p>
                </blockquote>
                <figcaption className="relative mt-4 text-fg-muted">{s.nombre}</figcaption>
              </figure>
            )}
          </div>
        ))}

        <div className="mt-6 text-center">
          <Link
            href="/formacion/santos"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
          >
            Conoce a más santos vicencianos
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <h3 className="mt-16 mb-6 text-center text-2xl font-bold text-fg sm:text-3xl">
          Así vivimos el carisma hoy
        </h3>
        <ul className="grid gap-5 md:grid-cols-3">
          {carismaHoy.map((v) => {
            const Icon = v.icon;
            return (
              <li key={v.titulo} className="rounded-2xl border border-line bg-surface p-6 shadow-card dark:border-white/15 dark:bg-white/5">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gold/10 text-accent-gold dark:bg-white/10">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h4 className="mb-2 text-lg font-bold text-fg">{v.titulo}</h4>
                <p className="leading-relaxed text-fg-muted">{v.descripcion}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
