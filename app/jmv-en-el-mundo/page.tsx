import JmvMundoHero from "@/components/sections/jmv-mundo/JmvMundoHero";
import JmvMundoCarisma from "@/components/sections/jmv-mundo/JmvMundoCarisma";
import JmvMundoGobierno from "@/components/sections/jmv-mundo/JmvMundoGobierno";
import JmvMundoRegiones from "@/components/sections/jmv-mundo/JmvMundoRegiones";

export const metadata = {
  title: "JMV en el Mundo | JMV Ecuador",
  description:
    "Conoce la Juventud Mariana Vicenciana a nivel internacional: su historia desde 1830 (Medalla Milagrosa), el Consejo y Secretariado Internacional, su presencia en más de 78 países y la Región Andina a la que pertenece JMV Ecuador.",
};

export default function JmvEnElMundoPage() {
  return (
    <>
      <JmvMundoHero />
      <JmvMundoCarisma />
      <JmvMundoGobierno />
      <JmvMundoRegiones />
    </>
  );
}
