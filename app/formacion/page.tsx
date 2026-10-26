import type { Metadata } from "next";
import { BookOpen, Star } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import FormacionPilar from "@/components/sections/FormacionPilar";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import BibliotecaCta from "@/components/sections/formacion/BibliotecaCta";
import { fetchSlots } from "@/lib/api/site-images.server";

export const metadata: Metadata = {
  title: "Formación",
  description:
    "La formación en JMV Ecuador: ejes formativos, santos vicencianos, la biblioteca y el pilar de formación para crecer como persona, cristiano y vicenciano.",
  alternates: { canonical: "/formacion" },
};

export default async function FormacionPage() {
  const s = await fetchSlots(["formacion.hero", "ejes.hero", "santos.hero", "pilares.hero"] as const);
  // Cada tarjeta muestra la cabecera de su destino
  const fotos = {
    ejes: s["ejes.hero"][0],
    santos: s["santos.hero"][0],
    pilar: s["pilares.hero"][0],
  };
  // Que la cabecera no repita una foto que ya está en las tarjetas (con las fotos
  // de respaldo comparten alguna); si todas se repiten, se usan igual.
  const enTarjetas = new Set(Object.values(fotos).map((f) => f?.src));
  const propias = s["formacion.hero"].filter((f) => !enTarjetas.has(f.src));
  const hero = propias.length > 0 ? propias : s["formacion.hero"];

  return (
    <>
      <HeroMedia
        images={hero}
        eyebrow="Uno de los cuatro pilares"
        title="Formación"
        lead="Hasta que Cristo sea formado en ti."
        actions={[
          { label: "Ejes formativos", href: "/formacion/ejes", icon: BookOpen },
          { label: "Santos vicencianos", href: "/formacion/santos", icon: Star },
        ]}
        breadcrumbs={[{ label: "Formación" }]}
        carouselLabel="Fotos de formación"
      />
      <FormacionPilar fotos={fotos} />
      <BibliotecaCta className="bg-section-blue pb-16 sm:pb-20" />
      <SigueExplorando items={["ejes", "santos", "unete"]} />
    </>
  );
}
