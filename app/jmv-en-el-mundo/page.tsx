import type { Metadata } from "next";
import { ArrowRight, Network } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import JmvMundoCarisma from "@/components/sections/jmv-mundo/JmvMundoCarisma";
import JmvMundoGobierno from "@/components/sections/jmv-mundo/JmvMundoGobierno";
import JmvMundoRegiones from "@/components/sections/jmv-mundo/JmvMundoRegiones";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import { fetchSlotImages } from "@/lib/api/site-images.server";

export const metadata: Metadata = {
  title: "JMV en el mundo",
  description:
    "Las Juventudes Marianas Vicencianas en el mundo: su origen en 1830 con la Medalla Milagrosa, el Consejo y el Secretariado Internacional, su presencia en los cinco continentes y la Región Andina a la que pertenece JMV Ecuador.",
  alternates: { canonical: "/jmv-en-el-mundo" },
};

export default async function JmvEnElMundoPage() {
  const hero = await fetchSlotImages("jmv-mundo.hero");

  return (
    <>
      <HeroMedia
        images={hero}
        eyebrow="Una familia internacional"
        title="JMV en el mundo"
        lead="Comprometidos con los jóvenes, el mundo, la Iglesia y los pobres."
        actions={[
          { label: "Conoce su gobierno", href: "#gobierno-internacional", icon: ArrowRight },
          { label: "Estructura en Ecuador", href: "/estructura", icon: Network },
        ]}
        breadcrumbs={[{ label: "JMV en el mundo" }]}
        carouselLabel="Fotos de JMV en el mundo"
      />
      <JmvMundoCarisma />
      <JmvMundoGobierno />
      <JmvMundoRegiones />
      <SigueExplorando items={["historia", "estructura", "unete"]} />
    </>
  );
}
