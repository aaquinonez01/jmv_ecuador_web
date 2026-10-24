import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GraduationCap, HandHeart, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import PilaresInteractivo from "@/components/sections/PilaresInteractivo";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";

export const metadata: Metadata = {
  title: "Los cuatro pilares",
  description:
    "Conoce los cuatro pilares de JMV: comunidad juvenil, espiritualidad, apostolado y formación, las cuatro patas de la silla que sostienen nuestra casa.",
  alternates: { canonical: "/pilares" },
};

// Mismo orden que las pestañas de PilaresInteractivo
const ATAJOS = [
  { id: "comunidad", label: "Comunidad", icon: Users },
  { id: "espiritualidad", label: "Espiritualidad", icon: BookOpen },
  { id: "apostolado", label: "Apostolado", icon: HandHeart },
  { id: "formacion", label: "Formación", icon: GraduationCap },
];

export default function PilaresPage() {
  return (
    <>
      <PageHero
        eyebrow="Cómo vivimos JMV"
        title="Nuestros cuatro pilares"
        motto="Las cuatro patas de la silla que sostienen a cada joven vicenciano."
        description="Comunidad, espiritualidad, apostolado y formación no se viven por separado: juntos nos ayudan a crecer como personas, como cristianos y como servidores de los pobres."
        image={{ src: "/images/events/evento_campamento.jpg", position: "center 60%" }}
        motif="stars"
        breadcrumbs={[{ label: "Pilares" }]}
      >
        <nav aria-label="Ir a un pilar" className="mt-8">
          <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            {ATAJOS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <Link
                  href={`#${id}`}
                  className="flex min-h-12 items-center gap-2 rounded-xl border border-white/25 bg-jmv-ink/60 px-4 font-medium text-white hover:bg-white hover:text-jmv-blue"
                >
                  <Icon className="h-5 w-5 text-jmv-gold-text" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <PilaresInteractivo />
      <SigueExplorando items={["formacion", "santos", "unete"]} />
    </>
  );
}
