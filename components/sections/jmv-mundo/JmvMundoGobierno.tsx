"use client";

import Image from "next/image";
import {
  Building2,
  Crown,
  Users,
  CalendarClock,
  Mail,
  MapPin,
  Languages,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CONSEJO = [
  {
    nombre: "P. Tomaž Mavrič, CM",
    cargo: "Director General",
    detalle:
      "Superior General de la Congregación de la Misión y de las Hijas de la Caridad; máxima referencia de la asociación.",
  },
  {
    nombre: "Patricia Roppa",
    cargo: "Presidenta Internacional",
    detalle: "Laica, elegida por la Asamblea General (Perú).",
  },
  {
    nombre: "Sor Anna Wiwiek, DC",
    cargo: "Consejera General de las Hijas de la Caridad",
    detalle: "Representa a las Hijas de la Caridad en el Consejo (Indonesia).",
  },
];

// Voluntarios del Secretariado (uno por idioma oficial). Para mostrar su foto,
// coloca la imagen en /public/images/jmv-mundo/voluntarios/ y pon la ruta en `img`.
const VOLUNTARIOS = [
  { nombre: "Karla S. Loor", idioma: "Español", iniciales: "KL", img: "" },
  { nombre: "Timothy Kuenzel", idioma: "Inglés", iniciales: "TK", img: "" },
  { nombre: "Elissa Alchidiac", idioma: "Francés", iniciales: "EA", img: "" },
  { nombre: "Lassana N'djai", idioma: "Portugués", iniciales: "LN", img: "" },
];

const ORGANOS = [
  {
    icon: Crown,
    titulo: "Director General",
    texto:
      "Es el Superior General de la Congregación de la Misión y de las Hijas de la Caridad, que vela por la fidelidad al carisma vicenciano.",
  },
  {
    icon: CalendarClock,
    titulo: "Asamblea General",
    texto:
      "Máximo órgano de gobierno; reúne a delegados de todo el mundo cada pocos años. La primera se celebró en Roma, en agosto del año 2000.",
  },
  {
    icon: Users,
    titulo: "Consejo Internacional",
    texto:
      "Lo forman el Director General, el Subdirector, una Consejera de las Hijas de la Caridad, la Presidenta laica y los consejeros continentales.",
  },
  {
    icon: Building2,
    titulo: "Secretariado Internacional",
    texto:
      "Centraliza la información y promueve la comunicación entre los países miembros, acompañando la vida de la asociación.",
  },
];

export default function JmvMundoGobierno() {
  return (
    <section
      id="gobierno-internacional"
      className="relative overflow-hidden bg-gradient-to-br from-jmv-blue-dark via-blue-800 to-blue-700 py-20"
    >
      <div className="absolute left-20 top-10 h-72 w-72 rounded-full bg-jmv-gold/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-white/5 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={50}>
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-md">
              <Building2 className="mr-2 h-5 w-5 text-jmv-gold" />
              Gobierno Internacional
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Consejo y <span className="text-jmv-gold">Secretariado</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-white/80">
              Para su dinamismo y dirección, la JMV cuenta con un Director
              General, una Asamblea General, un Consejo Internacional y un
              Secretariado Internacional.
            </p>
          </div>
        </ScrollReveal>

        {/* Banner */}
        <ScrollReveal direction="up" delay={60}>
          <div className="relative mb-16 h-64 overflow-hidden rounded-3xl border border-white/20 shadow-2xl sm:h-80">
            <Image
              src="/images/gallery/asamblea_2024.jpg"
              alt="Asamblea de la Juventud Mariana Vicenciana"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jmv-blue-dark/85 via-jmv-blue-dark/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <p className="max-w-xl text-lg font-medium text-white sm:text-xl">
                Delegados de todo el mundo se reúnen en la Asamblea General, el
                máximo órgano de gobierno de la JMV.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Órganos de gobierno */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ORGANOS.map((org, index) => {
            const Icon = org.icon;
            return (
              <ScrollReveal key={org.titulo} direction="up" delay={80 + index * 40}>
                <div className="h-full rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jmv-gold/20 text-jmv-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">
                    {org.titulo}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/75">
                    {org.texto}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Miembros principales del Consejo */}
        <ScrollReveal direction="up" delay={100}>
          <h3 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
            Liderazgo del <span className="text-jmv-gold">Consejo Internacional</span>
          </h3>
        </ScrollReveal>
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {CONSEJO.map((m, index) => (
            <ScrollReveal key={m.nombre} direction="up" delay={120 + index * 50}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-md">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-jmv-gold to-jmv-gold-dark">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white">{m.nombre}</h4>
                <p className="mb-2 font-medium text-jmv-gold">{m.cargo}</p>
                <p className="text-sm text-white/70">{m.detalle}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Secretariado Internacional */}
        <ScrollReveal direction="up" delay={150}>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <h3 className="mb-6 flex items-center text-2xl font-bold text-white">
              <Building2 className="mr-3 h-7 w-7 text-jmv-gold" />
              Secretariado Internacional
            </h3>

            <figure className="mb-8">
              <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl sm:h-96">
                <Image
                  src="/images/gallery/secretariado.png"
                  alt="Equipo del Secretariado Internacional de la JMV"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1100px"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="mt-3 text-center text-sm text-white/60">
                El equipo del Secretariado Internacional de la JMV.
              </figcaption>
            </figure>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-6 leading-relaxed text-white/80">
                  Su misión es centralizar la información de la asociación y
                  promover la comunicación entre los países miembros. Lo integran
                  el Subdirector General, la Delegada Internacional y un equipo de
                  jóvenes voluntarios, uno por cada idioma oficial de la JMV.
                </p>
                <figure className="mb-6 flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/20">
                    <Image
                      src="/images/historia/jmv_padre_maloney.png"
                      alt="P. Robert Maloney, CM"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-sm text-white/75">
                    El <span className="font-semibold text-white">P. Robert Maloney, CM</span>{" "}
                    estableció el Secretariado Internacional en Madrid en 1999.
                  </figcaption>
                </figure>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-white/80">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold" />
                    <span>
                      Sede en <strong>Madrid (España)</strong> desde 1999;
                      trasladada a <strong>Manila (Filipinas)</strong> en 2022.
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-white/80">
                    <Languages className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold" />
                    <span>
                      Idiomas oficiales: español, inglés, francés y portugués.
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-white/80">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold" />
                    <a
                      href="https://jmvinter.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-jmv-gold/50 underline-offset-4 hover:text-jmv-gold"
                    >
                      jmvinter.org
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h4 className="mb-4 text-lg font-semibold text-white">
                  Equipo del Secretariado
                </h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <span className="font-medium text-white">
                      P. Francisco Magnaye Jr., CM
                    </span>
                    <span className="shrink-0 text-jmv-gold">Subdirector</span>
                  </li>
                  <li className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <span className="font-medium text-white">
                      Sor Isabel Higueras, DC
                    </span>
                    <span className="shrink-0 text-jmv-gold">
                      Delegada Internacional
                    </span>
                  </li>
                </ul>

                <h5 className="mb-3 mt-5 text-sm font-semibold text-white">
                  Voluntarios por idioma
                </h5>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {VOLUNTARIOS.map((v) => (
                    <div
                      key={v.nombre}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="relative mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-jmv-gold/30 to-jmv-red/30">
                        {v.img ? (
                          <Image
                            src={v.img}
                            alt={v.nombre}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-base font-bold text-white">
                            {v.iniciales}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium leading-tight text-white">
                        {v.nombre}
                      </span>
                      <span className="text-[11px] text-jmv-gold">
                        {v.idioma}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
