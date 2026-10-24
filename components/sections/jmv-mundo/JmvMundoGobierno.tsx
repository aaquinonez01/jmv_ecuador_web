import Image from "next/image";
import {
  Building2,
  Crown,
  Users,
  CalendarClock,
  ExternalLink,
  MapPin,
  Languages,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

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
      aria-labelledby="gobierno-titulo"
      className="scroll-mt-24 bg-[#132f55] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="gobierno-titulo"
          eyebrow="Gobierno internacional"
          title="Consejo y Secretariado"
          description="Para su dinamismo y dirección, la JMV cuenta con un Director General, una Asamblea General, un Consejo Internacional y un Secretariado Internacional."
        />

        <ul className="mb-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ORGANOS.map((org) => {
            const Icon = org.icon;
            return (
              <li key={org.titulo} className="h-full rounded-2xl border border-white/15 bg-white/5 p-6">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-jmv-gold-text">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mb-2 text-lg font-bold text-white">{org.titulo}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{org.texto}</p>
              </li>
            );
          })}
        </ul>

        <h3 className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">
          Liderazgo del Consejo Internacional
        </h3>
        <ul className="mb-14 grid gap-5 md:grid-cols-3">
          {CONSEJO.map((m) => (
            <li
              key={m.nombre}
              className="flex h-full flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-6 text-center"
            >
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-jmv-gold text-jmv-ink">
                <Crown className="h-7 w-7" aria-hidden />
              </span>
              <h4 className="text-lg font-bold text-white">{m.nombre}</h4>
              <p className="mb-2 font-medium text-jmv-gold-text">{m.cargo}</p>
              <p className="text-sm text-slate-300">{m.detalle}</p>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
          <h3 className="mb-6 flex items-center text-2xl font-bold text-white">
            <Building2 className="mr-3 h-7 w-7 text-jmv-gold-text" aria-hidden />
            Secretariado Internacional
          </h3>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-6 leading-relaxed text-slate-200">
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
                    loading="lazy"
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-sm text-slate-200">
                  El <span className="font-semibold text-white">P. Robert Maloney, CM</span>{" "}
                  estableció el Secretariado Internacional en Madrid en 1999.
                </figcaption>
              </figure>
              <ul className="space-y-3 text-slate-200">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
                  <span>
                    Sede en <strong>Madrid (España)</strong> desde 1999; trasladada a{" "}
                    <strong>Manila (Filipinas)</strong> en 2022.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Languages className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
                  <span>Idiomas oficiales: español, inglés, francés y portugués.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-jmv-gold-text" aria-hidden />
                  <a
                    href="https://jmvinter.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-jmv-gold-text/60 underline-offset-4 hover:text-white"
                  >
                    jmvinter.org
                    <span className="sr-only"> (sitio internacional, se abre en una pestaña nueva)</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-white/10 bg-jmv-ink/50 p-6">
              <h4 className="mb-4 text-lg font-semibold text-white">Equipo del Secretariado</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <span className="font-medium text-white">P. Francisco Magnaye Jr., CM</span>
                  <span className="text-jmv-gold-text">Subdirector</span>
                </li>
                <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <span className="font-medium text-white">Sor Isabel Higueras, DC</span>
                  <span className="text-jmv-gold-text">Delegada Internacional</span>
                </li>
              </ul>

              <h5 className="mb-3 mt-5 text-sm font-semibold text-white">Voluntarios por idioma</h5>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {VOLUNTARIOS.map((v) => (
                  <li key={v.nombre} className="flex flex-col items-center text-center">
                    <span className="relative mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-jmv-blue">
                      {v.img ? (
                        <Image src={v.img} alt="" fill loading="lazy" sizes="64px" className="object-cover" />
                      ) : (
                        <span aria-hidden className="text-base font-bold text-white">
                          {v.iniciales}
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-medium leading-tight text-white">{v.nombre}</span>
                    <span className="text-xs text-jmv-gold-text">{v.idioma}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
