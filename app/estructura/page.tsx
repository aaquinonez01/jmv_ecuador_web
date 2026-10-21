import EstructuraHero from "@/components/sections/EstructuraHero";
import Organigrama from "@/components/sections/Organigrama";

// ISR: ver app/page.tsx.
export const revalidate = 3600;

export default function EstructuraPage() {
  return (
    <>
      <EstructuraHero />
      <Organigrama />
    </>
  );
}
