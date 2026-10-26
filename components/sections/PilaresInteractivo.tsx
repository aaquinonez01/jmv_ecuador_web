"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HandHeart,
  Quote,
  Users,
  type LucideIcon,
} from "lucide-react";
import { TwoHearts } from "@/components/brand";
import SiteImage from "@/components/media/SiteImage";
import ReadMore from "@/components/media/ReadMore";
import type { SlotPhoto } from "@/lib/site-images";
import { PILLAR_SLUGS, type PillarActivity } from "@/lib/api/pillar-activities";
import { getOptimizedUrl, getSrcSet } from "@/lib/helpers/cloudinary";
import { cn } from "@/lib/utils";
import SectionHeading from "../ui/SectionHeading";
import { buttonVariants } from "../ui/button-variants";
import { useTabs } from "./institucional/useTabs";

export type PilarId = "comunidad" | "espiritualidad" | "apostolado" | "formacion";

interface Pilar {
  id: PilarId;
  nombre: string;
  subtitulo: string;
  icono: LucideIcon;
  cita: { texto: string; fuente: string };
  descripcion: string[];
  puntos: { titulo: string; desc: string }[];
  destacados: { titulo: string; chips: string[] };
  enlace?: { href: string; label: string };
}

// El orden es el mismo en el hero (app/pilares), las pestañas y las patas de la silla.
const pilares: Pilar[] = [
  {
    id: "comunidad",
    nombre: "Comunidad juvenil",
    subtitulo: "La pedagogía del encuentro",
    icono: Users,
    cita: {
      texto:
        "La multitud de los creyentes no tenía sino un solo corazón y una sola alma. No había entre ellos ningún necesitado.",
      fuente: "Hechos 4, 32-35",
    },
    descripcion: [
      "JMV es un puente entre tú y tus compañeros. Un hogar donde te sientes acogido, caminas con otros y compartes la vida.",
      "Frente a una sociedad que despersonaliza, JMV nos invita a hacer la experiencia del grupo-comunidad: lugar para crecer, comprometernos con la causa de Jesús y servir a los pobres.",
    ],
    puntos: [
      {
        titulo: "Pedagogía del encuentro",
        desc: "Crece la confianza hasta que surge la pregunta: «¿qué hago para ser uno de ustedes?».",
      },
      {
        titulo: "Etapas del grupo",
        desc: "Nacimiento, infancia, adolescencia, juventud y adultez. Cada una con sus crisis y dones.",
      },
      { titulo: "Ideal de comunidad", desc: "Aceptar y valorar, dialogar, servir y proyectarse al entorno." },
      {
        titulo: "«Morir para dar vida»",
        desc: "Cuando un grupo termina, sus miembros siguen comprometidos en otros espacios de la Iglesia.",
      },
    ],
    destacados: {
      titulo: "Las 5 etapas de un grupo",
      chips: ["Nacimiento", "Infancia", "Adolescencia", "Juventud", "Adultez"],
    },
    enlace: { href: "/estructura#organigrama", label: "Encuentra los grupos de tu zona" },
  },
  {
    id: "espiritualidad",
    nombre: "Espiritualidad",
    subtitulo: "Encuentro con Cristo vivo",
    icono: BookOpen,
    cita: {
      texto: "Donde están dos o tres reunidos en mi nombre, allí estoy yo en medio de ellos.",
      fuente: "Mateo 18, 20",
    },
    descripcion: [
      "Dentro del grupo no solo te encuentras con los otros, sino con el Otro. Como los discípulos de Emaús, descubres que alguien te ha estado acompañando desde el principio.",
      "Aprendemos a contemplar a Cristo «con María y desde María», y a contemplar «a Cristo en los pobres y a los pobres en Cristo».",
    ],
    puntos: [
      {
        titulo: "Tiempos de oración",
        desc: "Sagrada Escritura, lectio divina, meditación diaria del Evangelio y rezo del rosario.",
      },
      { titulo: "Eucaristía", desc: "Cumbre y fuente de toda la actividad de JMV: festiva, profunda y participativa." },
      { titulo: "Espiritualidad del Magníficat", desc: "Alegría, agradecimiento y opción por los pobres y los débiles." },
      { titulo: "Herramientas para crecer", desc: "Tu Proyecto Personal de Vida y un acompañante espiritual." },
    ],
    destacados: { titulo: "Las 4 virtudes", chips: ["Humildad", "Obediencia", "Caridad", "Pureza"] },
    enlace: { href: "/formacion/santos", label: "Conoce a los santos vicencianos" },
  },
  {
    id: "apostolado",
    nombre: "Apostolado",
    subtitulo: "Servir como el buen samaritano",
    icono: HandHeart,
    cita: {
      texto: "Servir a los pobres es servir a Jesucristo. El amor es infinitamente inventivo.",
      fuente: "San Vicente de Paúl",
    },
    descripcion: [
      "Cuando descubres a Cristo vivo, buscas compartir ese tesoro con quienes te rodean: te haces apóstol y servidor.",
      "Con San Pablo: «¡Ay de mí si no anunciara el Evangelio!». Con San Vicente: «No me basta con amar a Dios, si mi prójimo no le ama».",
    ],
    puntos: [
      { titulo: "Educa tu mirada", desc: "«Llegó junto a él y lo vio». Conocer la realidad de los pobres y mirarla a la cara." },
      { titulo: "Educa tu corazón", desc: "«Se llenó de compasión». Dejarte afectar por el sufrimiento, tener corazón de carne." },
      { titulo: "Educa tus manos", desc: "«Le vendó las heridas». Bajarse del caballo y ensuciarse las manos." },
      { titulo: "Asociarnos a otros", desc: "«Cuídalo». Unir esfuerzos con otros grupos para transformar la realidad." },
    ],
    destacados: {
      titulo: "Las 5 notas distintivas",
      chips: ["Eclesial", "Laical", "Mariana", "Vicenciana", "Misionera"],
    },
    enlace: { href: "/actividades", label: "Mira nuestras actividades" },
  },
  {
    id: "formacion",
    nombre: "Formación",
    subtitulo: "Hasta que Cristo sea formado en ti",
    icono: GraduationCap,
    cita: {
      texto: "Formar es engendrar a Jesús en los otros, o más bien engendrar a los otros para Cristo.",
      fuente: "San Bernardo",
    },
    descripcion: [
      "Te conviertes como el barro en manos del alfarero. La meta: madurar en Cristo (Ef 4, 13) para transformar el mundo desde el servicio a los pobres.",
      "Catequesis, encuentros, retiros, cursos: todo lo que te ayuda a crecer íntegramente como persona, cristiano y vicenciano.",
    ],
    puntos: [
      { titulo: "Maduración humano-cristiana", desc: "Valores, criterios, proyecto de vida y unificación entre fe y vida." },
      { titulo: "Experiencia comunitaria y eclesial", desc: "Vida en grupos, integración progresiva en parroquia y diócesis." },
      { titulo: "Espiritualidad mariana-vicenciana", desc: "Vivir y orar como María, asumiendo el Magníficat y el servicio." },
      { titulo: "Compromiso social y misionero", desc: "Análisis crítico-creyente, acción apostólica y disponibilidad misionera." },
    ],
    destacados: {
      titulo: "La desembocadura vocacional",
      chips: ["Laico", "Consagrado", "Otras instancias", "Misionero seglar"],
    },
    enlace: { href: "/formacion", label: "Ver el itinerario de formación" },
  },
];

// Patas de la silla (vista 3/4): mismo orden que las pestañas.
const PATAS = [
  { x1: 52, y1: 138, x2: 52, y2: 226, lx: 52, ly: 238 }, // delantera izquierda
  { x1: 86, y1: 110, x2: 86, y2: 196, lx: 86, ly: 208 }, // trasera izquierda
  { x1: 196, y1: 110, x2: 196, y2: 196, lx: 196, ly: 208 }, // trasera derecha
  { x1: 162, y1: 138, x2: 162, y2: 226, lx: 162, ly: 238 }, // delantera derecha
];

function Silla({ activo, visitados }: { activo: number; visitados: Set<number> }) {
  return (
    <svg viewBox="0 0 248 248" className="h-full w-full" aria-hidden="true" focusable="false">
      {/* Respaldo */}
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-fg/70">
        <line x1="86" y1="110" x2="86" y2="26" />
        <line x1="196" y1="110" x2="196" y2="26" />
        <line x1="86" y1="30" x2="196" y2="30" />
        <line x1="86" y1="56" x2="196" y2="56" />
        <line x1="86" y1="82" x2="196" y2="82" />
      </g>
      {/* Patas */}
      {PATAS.map((p, i) => {
        const esActivo = i === activo;
        const visitado = visitados.has(i);
        return (
          <g key={i}>
            <line
              x1={p.x1}
              y1={p.y1}
              x2={p.x2}
              y2={p.y2}
              strokeLinecap="round"
              strokeWidth={esActivo ? 11 : 8}
              strokeDasharray={visitado || esActivo ? undefined : "6 8"}
              className={`transition-[stroke,stroke-width] duration-300 motion-reduce:transition-none ${
                esActivo ? "stroke-accent-gold" : visitado ? "stroke-fg" : "stroke-fg/40"
              }`}
            />
            <text
              x={p.lx}
              y={p.ly}
              textAnchor="middle"
              className={`text-[13px] font-bold ${esActivo ? "fill-accent-gold" : "fill-fg/80"}`}
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      {/* Asiento */}
      <polygon
        points="40,138 174,138 208,108 74,108"
        className="fill-jmv-blue stroke-fg/80"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Pestañas de los cuatro pilares con la silla. Las fotos llegan del servidor
 * (espacios de foto pilares.<pilar>, administrables en /admin/imagenes); si falta
 * una, se muestra el motivo de los dos corazones.
 */
/** Actividades del pilar (próximas y álbumes), preparadas en el servidor */
function ActividadesDelPilar({ pilar, items }: { pilar: Pilar; items: PillarActivity[] }) {
  const verTodas = `/actividades?pilar=${PILLAR_SLUGS[pilar.id]}#realizadas`;
  return (
    <section aria-labelledby={`actividades-${pilar.id}`} className="mt-8 border-t border-line pt-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h4 id={`actividades-${pilar.id}`} className="text-lg font-bold text-fg">
          Vívelo en JMV
        </h4>
        <Link
          href={verTodas}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
        >
          Ver todas las de {pilar.nombre.toLowerCase()}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-fg-muted">
          Aún no hay actividades publicadas de este pilar. Mira lo que vivimos en{" "}
          <Link href="/actividades" className="font-semibold text-accent-gold underline underline-offset-4">
            Actividades
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
          {items.map((a) => (
            <li key={a.key}>
              <Link
                href={a.href}
                className="group block overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-transform motion-safe:hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/3] bg-surface-2">
                  {a.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getOptimizedUrl(a.coverUrl, { w: 400 })}
                      srcSet={getSrcSet(a.coverUrl, [300, 600])}
                      sizes="(min-width: 1024px) 260px, (min-width: 640px) 30vw, 45vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-accent-gold">
                      <pilar.icono className="h-8 w-8" aria-hidden />
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide",
                      a.kind === "proxima" ? "bg-jmv-gold text-jmv-ink" : "bg-jmv-ink/80 text-white",
                    )}
                  >
                    {a.kind === "proxima" ? "Próxima" : "Realizada"}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-fg group-hover:underline">{a.title}</p>
                  {a.dateLabel && <p className="mt-0.5 text-xs text-fg-subtle">{a.dateLabel}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function PilaresInteractivo({
  fotos = {},
  actividades = {},
}: {
  fotos?: Partial<Record<PilarId, SlotPhoto>>;
  actividades?: Partial<Record<PilarId, PillarActivity[]>>;
}) {
  const [visitados, setVisitados] = useState<Set<number>>(() => new Set([0]));
  const marcarVisitado = useCallback(
    (i: number) => setVisitados((prev) => (prev.has(i) ? prev : new Set(prev).add(i))),
    [],
  );
  const { active, select, getTabProps, getPanelProps } = useTabs(pilares.length, "pilar", 0, marcarVisitado);

  // Los enlaces del hero (#comunidad, #espiritualidad…) abren la pestaña correspondiente
  useEffect(() => {
    const sync = () => {
      const idx = pilares.findIndex((p) => `#${p.id}` === window.location.hash);
      if (idx === -1) return;
      select(idx);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("pilares")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [select]);

  const completa = visitados.size === pilares.length;

  return (
    <section
      id="pilares"
      aria-labelledby="pilares-titulo"
      className="scroll-mt-24 bg-gradient-to-b from-page via-section-blue to-page py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="pilares-titulo"
          eyebrow="Fundamentos"
          title="Las cuatro patas de la silla"
          className="mb-3 sm:mb-5"
        />
        <ReadMore lines={3} className="mx-auto mb-8 max-w-3xl text-center sm:mb-10" buttonClassName="mx-auto flex">
          <p className="text-lg leading-relaxed text-fg-muted">
            JMV es un hogar grande. Como una silla necesita sus cuatro patas para mantenerse firme, nuestra casa se
            sostiene sobre estos pilares. «Nadie puede poner otro cimiento que el ya puesto: Jesucristo» (1 Cor 3, 11).
          </p>
        </ReadMore>

        <div className="mb-8 grid items-center gap-6 md:grid-cols-[14rem_1fr]">
          <figure className="mx-auto w-48 md:w-full">
            <div className="aspect-square">
              <Silla activo={active} visitados={visitados} />
            </div>
            <figcaption className="mt-2 text-center text-sm text-fg-muted">
              Pata {active + 1} de 4: <span className="font-semibold text-fg">{pilares[active].nombre}</span>
              . Has explorado {visitados.size} de 4 pilares.
            </figcaption>
          </figure>

          <div
            role="tablist"
            aria-label="Pilares de JMV"
            className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3"
          >
            {pilares.map((p, index) => {
              const PIcon = p.icono;
              const selected = index === active;
              return (
                <button
                  key={p.id}
                  {...getTabProps(index)}
                  className={`flex min-h-14 items-center gap-3 rounded-xl border p-3 text-left transition-colors sm:p-4 ${
                    selected
                      ? "border-accent-gold bg-jmv-gold/15 dark:bg-accent-gold/15"
                      : "border-fg/15 bg-surface shadow-card hover:border-fg/30 hover:bg-surface-2"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      selected ? "bg-jmv-gold text-jmv-ink" : "bg-surface-2 text-accent-gold"
                    }`}
                  >
                    <PIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-fg-muted">
                      Pilar {index + 1}
                    </span>
                    <span className="block font-bold leading-tight text-fg">{p.nombre}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {pilares.map((pilar, i) => {
          const Icon = pilar.icono;
          const foto = fotos[pilar.id];
          const chips = (
            <>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fg-muted dark:text-slate-200">
                {pilar.destacados.titulo}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {pilar.destacados.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-accent-gold/50 bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-accent-gold dark:bg-jmv-ink/70"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </>
          );
          return (
            <div
              key={pilar.id}
              {...getPanelProps(i)}
              className="grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-fg/15 bg-surface p-5 shadow-card motion-safe:animate-in motion-safe:fade-in-0 sm:p-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:p-8"
            >
              <div
                data-tone="dark"
                className="relative isolate aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[16/9] lg:aspect-auto lg:min-h-[480px]"
              >
                {foto ? (
                  <SiteImage
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-cover"
                    style={{ objectPosition: foto.position ?? "center" }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-jmv" aria-hidden="true">
                    <TwoHearts className="absolute top-8 left-1/2 w-3/4 max-w-sm -translate-x-1/2 text-jmv-gold-text/40" />
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-hero-veil via-hero-veil/50 via-40% to-transparent to-75%"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <span className="hidden h-12 w-12 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink shadow-lg sm:flex">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-jmv-gold-text sm:mt-3">
                    Pilar {i + 1}
                  </p>
                  <h3 className="text-2xl font-bold text-white sm:text-3xl">{pilar.nombre}</h3>
                  <p className="text-slate-100">{pilar.subtitulo}</p>
                  {/* En escritorio los chips van sobre la foto; en móvil, bajo el texto */}
                  <div className="mt-4 hidden lg:block">{chips}</div>
                </div>
              </div>

              <div className="flex flex-col">
                <ReadMore lines={4}>
                  {pilar.descripcion.map((parrafo, j) => (
                    <p key={j} className={`text-base leading-7 text-fg-soft sm:text-lg sm:leading-8 ${j > 0 ? "mt-3" : ""}`}>
                      {parrafo}
                    </p>
                  ))}
                </ReadMore>

                <figure className="mt-4 rounded-xl border border-accent-gold/25 bg-surface-sunken p-4">
                  <Quote className="mb-2 h-5 w-5 text-accent-gold" aria-hidden />
                  <blockquote className="italic leading-6 text-fg/90">
                    <p>“{pilar.cita.texto}”</p>
                  </blockquote>
                  <figcaption className="mt-1 text-sm font-semibold text-accent-gold">
                    — {pilar.cita.fuente}
                  </figcaption>
                </figure>

                <h4 className="mt-5 mb-2.5 text-sm font-bold uppercase tracking-wider text-fg-muted">
                  Claves para vivirlo
                </h4>
                <ReadMore lines={8} moreLabel={`Ver las ${pilar.puntos.length} claves`} lessLabel="Ver menos">
                  <ol className="space-y-2.5">
                    {pilar.puntos.map((punto, n) => (
                      <li key={punto.titulo} className="flex gap-3 rounded-xl bg-surface-2 p-3 dark:bg-white/5">
                        <span
                          aria-hidden
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-accent-gold ring-1 ring-line dark:bg-white/10 dark:ring-0"
                        >
                          {n + 1}
                        </span>
                        <div>
                          <h5 className="text-sm font-bold text-fg">{punto.titulo}</h5>
                          <p className="text-sm leading-6 text-fg-muted">{punto.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </ReadMore>

                <div className="mt-5 lg:hidden">{chips}</div>

                {pilar.enlace && (
                  <Link
                    href={pilar.enlace.href}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 self-start font-semibold text-accent-gold underline underline-offset-4 hover:text-fg"
                  >
                    {pilar.enlace.label}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                )}

                <ActividadesDelPilar pilar={pilar} items={actividades[pilar.id] ?? []} />
              </div>
            </div>
          );
        })}

        <div className="mt-10 rounded-2xl border border-fg/15 bg-surface p-6 text-center shadow-card sm:p-8">
          <h3 className="text-2xl font-bold text-fg">
            {completa ? "Tu silla está completa" : "Una silla se sostiene con sus cuatro patas"}
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-fg-muted">
            {completa
              ? "Ahora da un paso concreto: empieza tu Proyecto Personal de Vida junto a un grupo de JMV que te acompañe."
              : "Recorre los cuatro pilares y descubre cómo se viven juntos en un grupo de JMV."}
          </p>
          <Link href="/unete" className={buttonVariants({ variant: "gold", className: "mt-5" })}>
            Quiero dar el paso
          </Link>
        </div>
      </div>
    </section>
  );
}
