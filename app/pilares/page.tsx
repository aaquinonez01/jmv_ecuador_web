import PilaresHeroServer from "@/components/sections/PilaresHeroServer";
import PilaresInteractivo from "@/components/sections/PilaresInteractivo";

export const metadata = {
  title: "Los Pilares de JMV | JMV Ecuador",
  description:
    "Conoce los cuatro pilares de JMV: Comunidad Juvenil, Espiritualidad, Apostolado y Formación.",
};

export default function PilaresPage() {
  return (
    <>
      <PilaresHeroServer />
      <PilaresInteractivo />
    </>
  );
}
