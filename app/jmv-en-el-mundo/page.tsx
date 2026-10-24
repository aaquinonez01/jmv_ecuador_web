import type { Metadata } from "next";
import { ArrowRight, Network } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import JmvMundoCarisma from "@/components/sections/jmv-mundo/JmvMundoCarisma";
import JmvMundoGobierno from "@/components/sections/jmv-mundo/JmvMundoGobierno";
import JmvMundoRegiones from "@/components/sections/jmv-mundo/JmvMundoRegiones";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";

export const metadata: Metadata = {
  title: "JMV en el mundo",
  description:
    "Las Juventudes Marianas Vicencianas en el mundo: su origen en 1830 con la Medalla Milagrosa, el Consejo y el Secretariado Internacional, su presencia en los cinco continentes y la Región Andina a la que pertenece JMV Ecuador.",
  alternates: { canonical: "/jmv-en-el-mundo" },
};

export default function JmvEnElMundoPage() {
  return (
    <>
      <PageHero
        eyebrow="Una familia internacional"
        title="JMV en el mundo"
        motto="Comprometidos con los jóvenes, el mundo, la Iglesia y los pobres."
        description="Las Juventudes Marianas Vicencianas son una asociación internacional de la Familia de San Vicente de Paúl. Nacieron de las apariciones de la Virgen de la Medalla Milagrosa en 1830 y hoy están presentes en los cinco continentes. JMV Ecuador es parte de esta gran familia."
        image={{ src: "/images/gallery/secretariado.jpg", position: "center 30%" }}
        motif="stars"
        breadcrumbs={[{ label: "JMV en el mundo" }]}
        actions={[
          { label: "Conoce su gobierno", href: "#gobierno-internacional", icon: ArrowRight },
          { label: "Estructura en Ecuador", href: "/estructura", icon: Network },
        ]}
      />
      <JmvMundoCarisma />
      <JmvMundoGobierno />
      <JmvMundoRegiones />
      <SigueExplorando items={["historia", "estructura", "unete"]} />
    </>
  );
}
