import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import SantosClient from "./SantosClient";

export const metadata: Metadata = {
  title: "Santos vicencianos",
  description:
    "San Vicente de Paúl, Santa Luisa de Marillac, Santa Catalina Labouré y otros testigos del carisma vicenciano que inspiran a JMV Ecuador. Con frases para compartir.",
  alternates: { canonical: "/formacion/santos" },
};

export default function SantosVicencianosPage() {
  return (
    <>
      <PageHero
        eyebrow="Familia Vicenciana"
        title="Santos vicencianos"
        motto="Los santos no son superhombres: son hombres y mujeres que dejaron actuar a Dios en sus vidas."
        description="Conoce a quienes inspiran nuestro caminar: santos, beatos y testigos del carisma vicenciano que dieron su vida por Cristo en los pobres y por la Iglesia."
        image={{ src: "/images/historia/catalina.jpg", alt: "", position: "center 25%" }}
        motif="monogram"
        breadcrumbs={[
          { label: "Formación", href: "/formacion" },
          { label: "Santos vicencianos" },
        ]}
        actions={[{ label: "Comenzar el recorrido", href: "#santos", icon: ChevronDown }]}
      />
      <SantosClient />
      <SigueExplorando items={["ejes", "quienes-somos", "unete"]} />
    </>
  );
}
