import EstructuraHero from "@/components/sections/EstructuraHero";
import ConsejoNacional from "@/components/sections/ConsejoNacional";
import AsesoresNacionales from "@/components/sections/AsesoresNacionales";
import ConsejoZonales from "@/components/sections/ConsejoZonales";

export default function EstructuraPage() {
  return (
    <>
      <EstructuraHero />
      <ConsejoNacional />
      <AsesoresNacionales />
      {/* <ConsejoZonales /> */}
    </>
  );
}
