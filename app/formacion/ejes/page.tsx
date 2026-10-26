import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import { fetchSlotImages } from "@/lib/api/site-images.server";
import EjesClient from "./EjesClient";

export const metadata: Metadata = {
  title: "Ejes formativos",
  description:
    "Los cinco ejes formativos de JMV Ecuador: humano, cristocéntrico, mariano, vicenciano y eclesial, que orientan la formación integral de cada joven.",
  alternates: { canonical: "/formacion/ejes" },
};

export default async function EjesFormativosPage() {
  const hero = await fetchSlotImages("ejes.hero");

  return (
    <>
      <HeroMedia
        images={hero}
        eyebrow="Formación integral"
        title="Cinco ejes formativos"
        lead="Cinco dimensiones para crecer en todas las áreas de la vida."
        actions={[
          { label: "Comenzar el recorrido", href: "#ejes", icon: ChevronDown },
        ]}
        breadcrumbs={[
          { label: "Formación", href: "/formacion" },
          { label: "Ejes formativos" },
        ]}
        carouselLabel="Fotos de los ejes formativos"
      />
      <EjesClient />
      <SigueExplorando items={["biblioteca", "santos", "unete"]} />
    </>
  );
}
