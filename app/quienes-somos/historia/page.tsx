import HistoriaPageHero from "@/components/sections/HistoriaPageHero";
import HistoriaTimeline from "@/components/sections/HistoriaTimeline";
import TestimoniosQuienesSomos from "@/components/sections/TestimoniosQuienesSomos";

// ISR: ver app/page.tsx.
export const revalidate = 3600;

export default function HistoriaPage() {
  return (
    <>
      <HistoriaPageHero />
      <HistoriaTimeline />
      <TestimoniosQuienesSomos />
    </>
  );
}
