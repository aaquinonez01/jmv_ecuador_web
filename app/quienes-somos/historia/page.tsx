import HistoriaPageHero from "@/components/sections/HistoriaPageHero";
import HistoriaTimeline from "@/components/sections/HistoriaTimeline";
import TestimoniosQuienesSomos from "@/components/sections/TestimoniosQuienesSomos";

export const dynamic = "force-dynamic";

export default function HistoriaPage() {
  return (
    <>
      <HistoriaPageHero />
      <HistoriaTimeline />
      <TestimoniosQuienesSomos />
    </>
  );
}
