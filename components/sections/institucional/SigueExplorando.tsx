import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Globe2,
  Heart,
  History,
  Library,
  Network,
  ScrollText,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// Recorrido sugerido por las páginas institucionales:
// Quiénes somos → Historia → Pilares → Formación → Únete
const DESTINOS = {
  "quienes-somos": {
    href: "/quienes-somos",
    label: "Quiénes somos",
    description: "Misión, visión y el carisma que nos une.",
    icon: Heart,
  },
  historia: {
    href: "/quienes-somos/historia",
    label: "Nuestra historia",
    description: "De la rue du Bac, en París, hasta Quito.",
    icon: History,
  },
  estatutos: {
    href: "/quienes-somos/estatutos",
    label: "Nuestros estatutos",
    description: "Quiénes somos y cómo nos organizamos, artículo por artículo.",
    icon: ScrollText,
  },
  pilares: {
    href: "/pilares",
    label: "Los cuatro pilares",
    description: "Comunidad, espiritualidad, apostolado y formación.",
    icon: Sparkles,
  },
  formacion: {
    href: "/formacion",
    label: "Formación",
    description: "Cómo crecemos como personas, cristianos y vicencianos.",
    icon: BookOpen,
  },
  biblioteca: {
    href: "/biblioteca",
    label: "Biblioteca JMV",
    description: "Libros y guías de formación para leer desde el celular.",
    icon: Library,
  },
  ejes: {
    href: "/formacion/ejes",
    label: "Ejes formativos",
    description: "Humano, cristocéntrico, mariano, vicenciano y eclesial.",
    icon: BookOpen,
  },
  santos: {
    href: "/formacion/santos",
    label: "Santos vicencianos",
    description: "Testigos que inspiran nuestro caminar.",
    icon: Star,
  },
  estructura: {
    href: "/estructura",
    label: "Estructura en Ecuador",
    description: "Consejo Nacional, zonas y grupos locales.",
    icon: Network,
  },
  mundo: {
    href: "/jmv-en-el-mundo",
    label: "JMV en el mundo",
    description: "Una familia presente en los cinco continentes.",
    icon: Globe2,
  },
  unete: {
    href: "/unete",
    label: "Únete a JMV",
    description: "Encuentra un grupo cerca de ti y da el primer paso.",
    icon: Users,
  },
} satisfies Record<
  string,
  { href: string; label: string; description: string; icon: LucideIcon }
>;

export type DestinoInstitucional = keyof typeof DESTINOS;

interface Props {
  /** Destinos en orden; el primero se destaca como siguiente paso */
  items: DestinoInstitucional[];
  title?: string;
}

export default function SigueExplorando({ items, title = "Sigue explorando" }: Props) {
  return (
    <section
      aria-labelledby="sigue-explorando-titulo"
      className="bg-jmv-ink py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="sigue-explorando-titulo"
          title={title}
          align="left"
          className="mb-8 sm:mb-8"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((key, i) => {
            const d = DESTINOS[key];
            const Icon = d.icon;
            const destacado = i === 0;
            return (
              <li key={key}>
                <Link
                  href={d.href}
                  className={`group flex h-full items-start gap-4 rounded-2xl border p-5 transition-colors ${
                    destacado
                      ? "border-jmv-gold-text/60 bg-jmv-gold-text/10 hover:bg-jmv-gold-text/15"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-jmv-gold-text">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    {destacado && (
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-jmv-gold-text">
                        Siguiente paso
                      </span>
                    )}
                    <span className="flex items-center gap-2 text-lg font-semibold text-white">
                      {d.label}
                      <ArrowRight
                        className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                      {d.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
