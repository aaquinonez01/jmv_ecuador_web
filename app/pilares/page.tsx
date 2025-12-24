import PilaresHeroServer from "@/components/sections/PilaresHeroServer";
import ApostoladoPilarServer from "@/components/sections/ApostoladoPilarServer";
import EspiritualidadPilar from "@/components/sections/EspiritualidadPilar";
import ComunidadJuvenilPilar from "@/components/sections/ComunidadJuvenilPilar";
import FormacionPilar from "@/components/sections/FormacionPilar";

export default function PilaresPage() {
  return (
    <>
      <PilaresHeroServer />
      <ApostoladoPilarServer />
      <EspiritualidadPilar />
      <ComunidadJuvenilPilar />
      <FormacionPilar />
    </>
  );
}
