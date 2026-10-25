"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Crown,
  Globe,
  Heart,
  MessageCircle,
  Quote,
  Share2,
  Shield,
  Star,
} from "lucide-react";
import { useTabs } from "@/components/sections/institucional/useTabs";
import { buttonVariants } from "@/components/ui/button-variants";
import { whatsappShareLink } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";

interface Santo {
  id: string;
  nombre: string;
  titulo: string;
  fechas: string;
  icono: typeof Crown;
  descripcion: string;
  cita: string;
  legado: string[];
  virtudes: string[];
}

const santosVicencianos: Santo[] = [
  {
    id: "san-vicente",
    nombre: "San Vicente de Paúl",
    titulo: "Padre y Apóstol de la Caridad",
    fechas: "1581 — 1660",
    icono: Crown,
    descripcion:
      "Sacerdote francés, fundador de la Congregación de la Misión y, junto con Santa Luisa de Marillac, de las Hijas de la Caridad. Dedicó su vida al servicio de los pobres y a la formación del clero. Su carisma transformó la Iglesia y dio origen a toda la Familia Vicenciana.",
    cita: '"La caridad es inventiva hasta el infinito."',
    legado: [
      "Fundador de la Congregación de la Misión (Padres Paúles)",
      "Cofundador de las Hijas de la Caridad junto a Santa Luisa",
      "Promotor de las Damas de la Caridad y las Conferencias",
      "Reformador del clero a través de retiros y seminarios",
      "Defensor de los expósitos, galeotes y víctimas de la guerra",
      "Patrono universal de las obras caritativas",
    ],
    virtudes: [
      "Sencillez en el trato y la palabra",
      "Humildad como fundamento de toda virtud",
      "Mansedumbre frente a la adversidad",
      "Mortificación en el propio servicio",
      "Celo apostólico por las almas y los pobres",
    ],
  },
  {
    id: "santa-luisa",
    nombre: "Santa Luisa de Marillac",
    titulo: "Cofundadora de las Hijas de la Caridad",
    fechas: "1591 — 1660",
    icono: Heart,
    descripcion:
      "Mujer de profunda vida interior y formación intelectual. Bajo la dirección de San Vicente de Paúl, organizó y formó a las primeras Hijas de la Caridad como una nueva forma de vida consagrada al servicio de los más pobres en hospitales, escuelas y barrios.",
    cita:
      '"Servid a los pobres con alegría, ellos son nuestros amos y señores."',
    legado: [
      "Primera Superiora de las Hijas de la Caridad",
      "Organizadora de la atención a enfermos en hospitales",
      "Pionera en la educación de niñas pobres en Francia",
      "Modelo de mujer laica, esposa, madre y consagrada",
      "Patrona de los trabajadores sociales (proclamada en 1960)",
    ],
    virtudes: [
      "Caridad concreta y práctica con los más pobres",
      "Discernimiento y prudencia en el gobierno",
      "Vida de oración profundamente trinitaria",
      "Fortaleza ante la enfermedad y el sufrimiento",
      "Maternidad espiritual hacia sus hermanas",
    ],
  },
  {
    id: "santa-catalina",
    nombre: "Santa Catalina Labouré",
    titulo: "Vidente de la Medalla Milagrosa",
    fechas: "1806 — 1876",
    icono: Star,
    descripcion:
      "Hija de la Caridad francesa a quien la Virgen María se apareció en la Capilla de la rue du Bac en París en 1830. De estas apariciones nació la Medalla Milagrosa, signo de la maternal protección de María. Vivió escondida 46 años trabajando con los ancianos, fiel y silenciosa.",
    cita: '"¡Oh María sin pecado concebida, rogad por nosotros que recurrimos a vos!"',
    legado: [
      "Vidente de las apariciones de la Virgen Inmaculada (1830)",
      'Origen de la Medalla Milagrosa, "regalo de María al mundo"',
      "Inspiradora de la JMV (Juventudes Marianas Vicencianas)",
      "Servidora silenciosa de ancianos durante 46 años",
      "Cuerpo incorrupto venerado en la rue du Bac, París",
    ],
    virtudes: [
      "Humildad escondida, sin buscar protagonismo",
      "Obediencia heroica a sus superiores",
      "Devoción mariana profunda y filial",
      "Sencillez en lo cotidiano del servicio",
      "Fidelidad silenciosa a la misión recibida",
    ],
  },
  {
    id: "sor-rosalia",
    nombre: "Beata Sor Rosalía Rendu",
    titulo: "Madre de los Pobres de París",
    fechas: "1786 — 1856",
    icono: Shield,
    descripcion:
      "Hija de la Caridad que dedicó más de 50 años al servicio de los pobres del barrio Mouffetard de París. Inspiró a Federico Ozanam y a los primeros miembros de las Conferencias de San Vicente de Paúl. Su mirada compasiva atravesaba clases sociales y guerras civiles.",
    cita:
      '"Nunca ha sido tan necesario ser bueno como ahora, para hacer amar a Dios."',
    legado: [
      "Atendió a los pobres del barrio Mouffetard 54 años",
      "Mentora de Federico Ozanam y la Sociedad de S. Vicente de Paúl",
      "Mediadora de paz durante las revoluciones de 1830 y 1848",
      "Fundadora de dispensarios, escuelas y casas de ancianos",
      "Beatificada por San Juan Pablo II el 9 de noviembre de 2003",
    ],
    virtudes: [
      "Compasión universal sin distinción de credo o partido",
      "Coraje en medio de barricadas y conflictos sociales",
      "Maternidad espiritual con jóvenes apóstoles",
      "Discreción y eficacia en la organización del servicio",
      "Amor preferencial por los más abandonados",
    ],
  },
  {
    id: "san-justino",
    nombre: "San Justino de Jacobis",
    titulo: "Apóstol de Etiopía",
    fechas: "1800 — 1860",
    icono: Globe,
    descripcion:
      "Sacerdote vicentino italiano, misionero en Etiopía, donde impulsó la unidad con la Iglesia Católica respetando los ritos y la cultura locales. Fue ordenado obispo y vivió la persecución y el destierro con paz evangélica. Modelo de inculturación misionera.",
    cita:
      '"Yo prefiero ser pequeño en Cristo, antes que grande sin Él."',
    legado: [
      "Pionero del diálogo con la Iglesia copta de Etiopía",
      "Fundador del Colegio de la Inmaculada en Adwa",
      "Modelo de inculturación misionera y respeto litúrgico",
      "Padeció persecución, cárcel y exilio por la fe",
      "Canonizado por Pablo VI en 1975",
    ],
    virtudes: [
      "Celo apostólico universal y respetuoso",
      "Paciencia heroica ante la persecución",
      "Sencillez y pobreza evangélica",
      "Espíritu ecuménico antes de tiempo",
      "Confianza filial en la Providencia",
    ],
  },
  {
    id: "federico-ozanam",
    nombre: "Beato Federico Ozanam",
    titulo: "Fundador de las Conferencias de S. Vicente de Paúl",
    fechas: "1813 — 1853",
    icono: BookOpen,
    descripcion:
      "Laico francés, profesor de la Sorbona, esposo y padre de familia. A los 20 años fundó con un grupo de estudiantes la Sociedad de San Vicente de Paúl, llevando el pan y la fe a las familias pobres de París. Modelo de laico apóstol y de inteligencia puesta al servicio de la caridad.",
    cita:
      '"El que ayuda a los pobres da más al amor que al dolor."',
    legado: [
      "Cofundador de la Sociedad de San Vicente de Paúl (1833)",
      "Pionero del catolicismo social en el siglo XIX",
      "Profesor universitario, periodista e investigador literario",
      "Modelo de matrimonio cristiano y de paternidad responsable",
      "Beatificado por San Juan Pablo II en 1997",
    ],
    virtudes: [
      "Caridad encarnada en la visita a los pobres",
      "Inteligencia al servicio de la fe y la justicia",
      "Coherencia entre vida pública, familiar y espiritual",
      "Espíritu de comunidad y trabajo en equipo",
      "Esperanza activa frente a las heridas de la sociedad",
    ],
  },
];

const sinSuscripcion = () => () => {};

const URL_SANTOS = `${SITE.url}/formacion/santos`;

function textoParaCompartir(santo: Santo) {
  return `${santo.cita}\n— ${santo.nombre}`;
}

// Tarjeta "frase para compartir": WhatsApp o el menú nativo del teléfono
function FraseParaCompartir({ santo }: { santo: Santo }) {
  const [estado, setEstado] = useState<"" | "copiado" | "error">("");
  // useSyncExternalStore evita el desajuste de hidratación (en el servidor no hay navigator)
  const puedeCompartir = useSyncExternalStore(
    sinSuscripcion,
    () => typeof navigator.share === "function",
    () => false,
  );

  const compartir = async () => {
    const text = textoParaCompartir(santo);
    try {
      if (puedeCompartir) {
        await navigator.share({ title: santo.nombre, text, url: URL_SANTOS });
      } else {
        await navigator.clipboard.writeText(`${text}\n${URL_SANTOS}`);
        setEstado("copiado");
      }
    } catch (err) {
      // Cancelar el menú de compartir no es un error
      if ((err as Error)?.name !== "AbortError") setEstado("error");
    }
  };

  return (
    <figure data-tone="dark" className="rounded-2xl border border-accent-gold/40 bg-gradient-to-br from-jmv-blue to-jmv-ink p-6 sm:p-8">
      <figcaption className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-gold">
        Frase para compartir
      </figcaption>
      <Quote className="mb-3 h-8 w-8 text-accent-gold" aria-hidden />
      <blockquote className="font-display text-2xl italic leading-snug text-white sm:text-3xl">
        <p>{santo.cita}</p>
      </blockquote>
      <p className="mt-3 font-semibold text-slate-100">— {santo.nombre}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={whatsappShareLink(textoParaCompartir(santo), URL_SANTOS)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "gold" })}
        >
          <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
          Compartir en WhatsApp
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        <button type="button" onClick={compartir} className={buttonVariants({ variant: "outlineLight" })}>
          {puedeCompartir ? (
            <>
              <Share2 className="mr-2 h-5 w-5" aria-hidden />
              Más opciones
            </>
          ) : estado === "copiado" ? (
            <>
              <Check className="mr-2 h-5 w-5" aria-hidden />
              Frase copiada
            </>
          ) : (
            <>
              <Copy className="mr-2 h-5 w-5" aria-hidden />
              Copiar frase
            </>
          )}
        </button>
      </div>
      <p className="mt-2 min-h-5 text-sm text-slate-200" role="status">
        {estado === "copiado" && "Copiamos la frase para que la pegues en tu estado."}
        {estado === "error" && "No pudimos compartir la frase. Inténtalo de nuevo."}
      </p>
    </figure>
  );
}

export default function SantosClient() {
  const { active, select, getTabProps, getPanelProps } = useTabs(santosVicencianos.length, "santo");
  const total = santosVicencianos.length;
  const anterior = santosVicencianos[(active - 1 + total) % total];
  const siguiente = santosVicencianos[(active + 1) % total];

  return (
    <section
      id="santos"
      aria-labelledby="santos-titulo"
      className="scroll-mt-24 bg-gradient-to-b from-section-a to-section-blue py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="santos-titulo" className="sr-only">
          Santos y beatos de la Familia Vicenciana
        </h2>

        <div
          role="tablist"
          aria-label="Santos vicencianos"
          className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {santosVicencianos.map((s, index) => {
            const Icono = s.icono;
            const selected = active === index;
            return (
              <button
                key={s.id}
                {...getTabProps(index)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors sm:px-5 ${
                  selected
                    ? "border-jmv-gold bg-jmv-gold text-jmv-ink"
                    : "border-line-strong bg-surface text-fg shadow-card hover:bg-surface-2 dark:hover:bg-white/15"
                }`}
              >
                <Icono className="h-4 w-4" aria-hidden />
                {s.nombre}
              </button>
            );
          })}
        </div>

        {santosVicencianos.map((santo, index) => {
          const Icono = santo.icono;
          return (
            <article
              key={santo.id}
              {...getPanelProps(index)}
              className="rounded-2xl border border-fg/15 bg-surface p-6 text-fg shadow-card sm:p-8 lg:p-12"
            >
              <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-2">
                  <Icono className="h-8 w-8 text-accent-gold" aria-hidden />
                </span>
                <div className="flex-1">
                  <h3 className="mb-1 text-2xl font-bold sm:text-3xl lg:text-4xl">{santo.nombre}</h3>
                  <p className="mb-1 text-base font-semibold text-accent-gold sm:text-lg">{santo.titulo}</p>
                  <p className="mb-3 text-sm text-fg-muted">{santo.fechas}</p>
                  <p className="text-base leading-relaxed text-fg-muted sm:text-lg">{santo.descripcion}</p>
                </div>
              </div>

              <div className="mb-8">
                <FraseParaCompartir santo={santo} />
              </div>

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <div>
                  <h4 className="mb-4 text-xl font-bold text-accent-gold sm:text-2xl">Legado</h4>
                  <ul className="space-y-3">
                    {santo.legado.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-gold" />
                        <span className="leading-relaxed text-fg-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-4 text-xl font-bold text-accent-gold sm:text-2xl">Virtudes que nos inspiran</h4>
                  <ul className="space-y-3">
                    {santo.virtudes.map((virtud) => (
                      <li key={virtud} className="rounded-xl border border-line bg-surface-2 p-4 leading-relaxed dark:bg-white/5 text-fg-muted">
                        {virtud}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}

        <nav aria-label="Navegar entre santos" className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => select(active - 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-fg shadow-card hover:bg-surface-2 dark:hover:bg-white/15 sm:px-6"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
            Anterior
            <span className="sr-only">: {anterior.nombre}</span>
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
            <span className="sr-only">: {siguiente.nombre}</span>
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
        </nav>
      </div>
    </section>
  );
}
