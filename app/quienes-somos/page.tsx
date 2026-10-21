import { Suspense } from "react";
import QuienesSomosHero from "@/components/sections/QuienesSomosHero";
import MisionVision from "@/components/sections/MisionVision";
import CarismaVicenciano from "@/components/sections/CarismaVicenciano";
import TestimoniosQuienesSomos from "@/components/sections/TestimoniosQuienesSomos";
import UneteCTASection from "@/components/sections/UneteCTASection";
import TestimonialsSkeleton from "@/components/sections/skeletons/TestimonialsSkeleton";

// ISR: ver app/page.tsx.
export const revalidate = 3600;

export default function QuienesSomosPage() {
  return (
    <>
      <QuienesSomosHero />
      <MisionVision />
      <CarismaVicenciano />
      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimoniosQuienesSomos />
      </Suspense>
      <UneteCTASection />
    </>
  );
}
