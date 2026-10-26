import type { Metadata } from "next";
import { BookOpen, ChevronDown, GraduationCap, HandHeart, Users } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import PhotoCard from "@/components/media/PhotoCard";
import PilaresInteractivo, { type PilarId } from "@/components/sections/PilaresInteractivo";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import { fetchSlots } from "@/lib/api/site-images.server";

export const metadata: Metadata = {
  title: "Los cuatro pilares",
  description:
    "Conoce los cuatro pilares de JMV: comunidad juvenil, espiritualidad, apostolado y formación, las cuatro patas de la silla que sostienen nuestra casa.",
  alternates: { canonical: "/pilares" },
};

// Mismo orden que las pestañas de PilaresInteractivo
const ATAJOS = [
  { id: "comunidad", label: "Comunidad", text: "La pedagogía del encuentro", icon: Users },
  { id: "espiritualidad", label: "Espiritualidad", text: "Encuentro con Cristo vivo", icon: BookOpen },
  { id: "apostolado", label: "Apostolado", text: "Servir como el buen samaritano", icon: HandHeart },
  { id: "formacion", label: "Formación", text: "Hasta que Cristo sea formado en ti", icon: GraduationCap },
] as const satisfies readonly { id: PilarId; label: string; text: string; icon: unknown }[];

// ISR: las fotos son administrables (tag site_images).
export const revalidate = 1800;

export default async function PilaresPage() {
  const s = await fetchSlots([
    "pilares.hero",
    "pilares.comunidad",
    "pilares.espiritualidad",
    "pilares.apostolado",
    "pilares.formacion",
  ] as const);
  const fotos = {
    comunidad: s["pilares.comunidad"][0],
    espiritualidad: s["pilares.espiritualidad"][0],
    apostolado: s["pilares.apostolado"][0],
    formacion: s["pilares.formacion"][0],
  } satisfies Record<PilarId, unknown>;

  return (
    <>
      <HeroMedia
        images={s["pilares.hero"]}
        eyebrow="Cómo vivimos JMV"
        title="Nuestros cuatro pilares"
        lead="Las cuatro patas de la silla que sostienen a cada joven vicenciano."
        actions={[
          { label: "Conoce los pilares", href: "#pilares-fotos", icon: ChevronDown },
          { label: "Únete", href: "/unete" },
        ]}
        breadcrumbs={[{ label: "Pilares" }]}
        carouselLabel="Fotos de los pilares de JMV"
      />

      {/* Un vistazo con foto a cada pilar; cada tarjeta abre su pestaña más abajo */}
      <section
        id="pilares-fotos"
        aria-labelledby="pilares-fotos-titulo"
        className="scroll-mt-20 bg-page pt-12 pb-4 sm:pt-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="pilares-fotos-titulo" className="text-2xl font-bold text-fg text-balance sm:text-3xl">
            Cuatro pilares, una sola casa
          </h2>
          <p className="mt-2 max-w-2xl text-fg-muted sm:text-lg">
            No se viven por separado: juntos nos ayudan a crecer como personas, como cristianos y como servidores
            de los pobres.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {ATAJOS.map(({ id, label, text, icon }) => {
              const foto = fotos[id];
              if (!foto) return null;
              return (
                <li key={id}>
                  <PhotoCard
                    variant="overlay"
                    image={foto}
                    title={label}
                    text={text}
                    icon={icon}
                    href={`#${id}`}
                    linkLabel={`Pilar ${label}: ${text}`}
                    sizes="(min-width: 1024px) 280px, 50vw"
                    className="p-3.5 sm:p-5 [&_h3]:text-lg sm:[&_h3]:text-xl"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <PilaresInteractivo fotos={fotos} />
      <SigueExplorando items={["formacion", "santos", "unete"]} />
    </>
  );
}
