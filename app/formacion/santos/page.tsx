import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import { fetchSlots } from "@/lib/api/site-images.server";
import SantosClient from "./SantosClient";

export const metadata: Metadata = {
  title: "Santos vicencianos",
  description:
    "San Vicente de Paúl, Santa Luisa de Marillac, Santa Catalina Labouré y otros testigos del carisma vicenciano que inspiran a JMV Ecuador. Con frases para compartir.",
  alternates: { canonical: "/formacion/santos" },
};

// ISR: las fotos son administrables (tag site_images).
export const revalidate = 1800;

export default async function SantosVicencianosPage() {
  const s = await fetchSlots([
    "santos.hero",
    "santos.san-vicente",
    "santos.santa-luisa",
    "santos.santa-catalina",
    "santos.sor-rosalia",
    "santos.san-justino",
    "santos.federico-ozanam",
  ] as const);
  const retratos = {
    "san-vicente": s["santos.san-vicente"][0],
    "santa-luisa": s["santos.santa-luisa"][0],
    "santa-catalina": s["santos.santa-catalina"][0],
    "sor-rosalia": s["santos.sor-rosalia"][0],
    "san-justino": s["santos.san-justino"][0],
    "federico-ozanam": s["santos.federico-ozanam"][0],
  };

  return (
    <>
      <HeroMedia
        images={s["santos.hero"]}
        eyebrow="Familia Vicenciana"
        title="Santos vicencianos"
        lead="Hombres y mujeres que dejaron actuar a Dios en sus vidas."
        actions={[{ label: "Conócelos", href: "#santos", icon: ChevronDown }]}
        breadcrumbs={[
          { label: "Formación", href: "/formacion" },
          { label: "Santos vicencianos" },
        ]}
        carouselLabel="Imágenes de los santos vicencianos"
      />
      <SantosClient retratos={retratos} />
      <SigueExplorando items={["ejes", "quienes-somos", "unete"]} />
    </>
  );
}
