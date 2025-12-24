import QuieneSomosHeroServer from "@/components/sections/QuienesSomosHeroServer";
import MisionVision from "@/components/sections/MisionVision";
import CarismaVicenciano from "@/components/sections/CarismaVicenciano";
import TestimoniosQuienesSomos from "@/components/sections/TestimoniosQuienesSomos";
import ReconocimientosSection from "@/components/sections/ReconocimientosSection";
import UneteCTASection from "@/components/sections/UneteCTASection";

export default function QuienesSomosPage() {
  return (
    <>
      <QuieneSomosHeroServer />
      <MisionVision />
      <CarismaVicenciano />
      <TestimoniosQuienesSomos />
      <UneteCTASection />
    </>
  );
}
