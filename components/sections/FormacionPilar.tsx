import { BookOpen, Compass, GraduationCap, Star, Users, type LucideIcon } from "lucide-react";
import PhotoCard from "@/components/media/PhotoCard";
import ReadMore from "@/components/media/ReadMore";
import type { SlotPhoto } from "@/lib/site-images";
import SectionHeading from "../ui/SectionHeading";

export type RecorridoId = "ejes" | "santos" | "pilar";

const recorridos = [
  {
    id: "ejes",
    href: "/formacion/ejes",
    icon: BookOpen,
    titulo: "Ejes formativos",
    texto: "Humano, cristocéntrico, mariano, vicenciano y eclesial: cinco dimensiones para crecer.",
  },
  {
    id: "santos",
    href: "/formacion/santos",
    icon: Star,
    titulo: "Santos vicencianos",
    texto: "San Vicente, Santa Luisa, Santa Catalina y otros testigos. Con frases para compartir.",
  },
  {
    id: "pilar",
    href: "/pilares#formacion",
    icon: GraduationCap,
    titulo: "La formación como pilar",
    texto: "Una de las cuatro patas de la silla, con la comunidad, la espiritualidad y el apostolado.",
  },
] as const satisfies readonly { id: RecorridoId; href: string; icon: LucideIcon; titulo: string; texto: string }[];

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
// Las fotos de las tarjetas son las cabeceras de cada destino (espacios de foto).
export default function FormacionPilar({ fotos }: { fotos: Partial<Record<RecorridoId, SlotPhoto>> }) {
  return (
    <>
      <section
        id="recorridos"
        aria-labelledby="formacion-recorridos"
        className="scroll-mt-20 bg-gradient-to-b from-section-a to-section-blue py-14 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="formacion-recorridos"
            eyebrow="Itinerario formativo"
            title="Crecer como persona, cristiano y vicenciano"
            className="mb-3 sm:mb-5"
          />
          <ReadMore lines={3} className="mx-auto mb-8 max-w-3xl text-center sm:mb-12" buttonClassName="mx-auto flex">
            <p className="text-lg leading-relaxed text-fg-muted">
              Como el barro en manos del alfarero, cada joven crece en su fe, en su humanidad y en su compromiso con
              los pobres. En las Juventudes Marianas Vicencianas la formación no es un curso aislado: es un camino
              para madurar en Cristo (Ef 4, 13) y transformar el mundo desde el servicio a los pobres.
            </p>
          </ReadMore>

          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {recorridos.map((r) => {
              const foto = fotos[r.id];
              if (!foto) return null;
              return (
                <li key={r.href} className="last:sm:col-span-2 last:lg:col-span-1">
                  <PhotoCard
                    variant="overlay"
                    aspect="3/2"
                    image={foto}
                    title={r.titulo}
                    text={r.texto}
                    icon={r.icon}
                    href={r.href}
                    sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"
                    className="h-full sm:aspect-[4/3] lg:aspect-[4/5]"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="formacion-espacios" className="bg-section-blue pb-14 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="formacion-espacios" className="mb-5 text-2xl font-bold text-fg sm:mb-6 sm:text-3xl">
            ¿Dónde y cómo nos formamos?
          </h2>
          <ul className="grid gap-3 sm:gap-5 md:grid-cols-3">
            {espacios.map((e) => {
              const Icon = e.icon;
              return (
                <li
                  key={e.titulo}
                  className="flex gap-4 rounded-2xl border border-fg/15 bg-surface p-4 shadow-card dark:bg-jmv-ink/50 sm:block sm:p-6"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 sm:mb-3 sm:h-auto sm:w-auto sm:justify-start sm:bg-transparent">
                    <Icon className="h-6 w-6 text-accent-gold" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-fg">{e.titulo}</h3>
                    <p className="mt-1 leading-relaxed text-fg-muted sm:mt-2">{e.texto}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
