import Link from "next/link";
import { ArrowRight, BookOpen, Compass, GraduationCap, Star, Users } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const EJES = ["Humano", "Cristocéntrico", "Mariano", "Vicenciano", "Eclesial"];

const recorridos = [
  {
    href: "/formacion/ejes",
    icon: BookOpen,
    titulo: "Ejes formativos",
    texto:
      "Cinco dimensiones que orientan la formación de cada joven: humana, cristocéntrica, mariana, vicenciana y eclesial.",
    chips: EJES,
    cta: "Explorar los ejes",
  },
  {
    href: "/formacion/santos",
    icon: Star,
    titulo: "Santos vicencianos",
    texto:
      "San Vicente, Santa Luisa, Santa Catalina y otros testigos que dieron su vida por Cristo en los pobres. Con frases para compartir.",
    cta: "Conocer a los santos",
  },
  {
    href: "/pilares#formacion",
    icon: GraduationCap,
    titulo: "La formación como pilar",
    texto:
      "La formación es una de las cuatro patas de la silla, junto con la comunidad, la espiritualidad y el apostolado.",
    cta: "Ver los cuatro pilares",
  },
];

const espacios = [
  {
    icon: Users,
    titulo: "En el grupo",
    texto: "Catequesis, encuentros y retiros con tu comunidad local, a tu ritmo y según la etapa del grupo.",
  },
  {
    icon: Compass,
    titulo: "Con acompañamiento",
    texto: "Tu Proyecto Personal de Vida y un acompañante espiritual que camina contigo.",
  },
  {
    icon: GraduationCap,
    titulo: "Hacia una vocación",
    texto: "La formación desemboca en un compromiso: como laico, consagrado, misionero seglar u otras instancias de la Iglesia.",
  },
];

// Índice de formación: conecta los ejes, los santos y el pilar de formación.
export default function FormacionPilar() {
  return (
    <>
      <section
        aria-labelledby="formacion-recorridos"
        className="bg-gradient-to-b from-section-a to-section-blue py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="formacion-recorridos"
            eyebrow="Itinerario formativo"
            title="Crecer como persona, cristiano y vicenciano"
            description="En las Juventudes Marianas Vicencianas la formación no es un curso aislado: es un camino para madurar en Cristo (Ef 4, 13) y transformar el mundo desde el servicio a los pobres."
          />

          <ul className="grid gap-5 md:grid-cols-3">
            {recorridos.map((r) => {
              const Icon = r.icon;
              return (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="group flex h-full flex-col rounded-2xl border border-fg/15 bg-surface p-6 shadow-card transition-colors hover:border-accent-gold/60 hover:bg-surface-2"
                  >
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jmv-gold text-jmv-ink">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="text-xl font-bold text-fg">{r.titulo}</h3>
                    <p className="mt-2 leading-relaxed text-fg-muted">{r.texto}</p>
                    {r.chips && (
                      <span className="mt-4 flex flex-wrap gap-1.5">
                        {r.chips.map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-line-strong px-2.5 py-0.5 text-xs font-medium text-fg-muted dark:text-slate-200"
                          >
                            {c}
                          </span>
                        ))}
                      </span>
                    )}
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 font-semibold text-accent-gold">
                      {r.cta}
                      <ArrowRight
                        className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="formacion-espacios" className="bg-section-blue pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="formacion-espacios" className="mb-6 text-2xl font-bold text-fg sm:text-3xl">
            ¿Dónde y cómo nos formamos?
          </h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {espacios.map((e) => {
              const Icon = e.icon;
              return (
                <li key={e.titulo} className="rounded-2xl border border-fg/15 bg-surface p-6 shadow-card dark:bg-jmv-ink/50">
                  <Icon className="mb-3 h-6 w-6 text-accent-gold" aria-hidden />
                  <h3 className="text-lg font-bold text-fg">{e.titulo}</h3>
                  <p className="mt-2 leading-relaxed text-fg-muted">{e.texto}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
