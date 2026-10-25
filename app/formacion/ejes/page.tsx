import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import EjesClient from "./EjesClient";

export const metadata: Metadata = {
  title: "Ejes formativos",
  description:
    "Los cinco ejes formativos de JMV Ecuador: humano, cristocéntrico, mariano, vicenciano y eclesial, que orientan la formación integral de cada joven.",
  alternates: { canonical: "/formacion/ejes" },
};

export default function EjesFormativosPage() {
  return (
    <>
      <PageHero
        eyebrow="Formación integral"
        title="Cinco ejes formativos"
        motto="Cinco dimensiones para crecer en todas las áreas de la vida."
        description="Desde lo humano hasta lo espiritual, siguiendo el carisma vicenciano: así orientamos la formación de cada joven dentro del pilar de formación."
        image={{ src: "/images/gallery/adoracion_santisimo.jpeg" }}
        motif="stars"
        breadcrumbs={[
          { label: "Formación", href: "/formacion" },
          { label: "Ejes formativos" },
        ]}
        actions={[{ label: "Comenzar el recorrido", href: "#ejes", icon: ChevronDown }]}
      />
      <EjesClient />
      <SigueExplorando items={["biblioteca", "santos", "unete"]} />
    </>
  );
}
