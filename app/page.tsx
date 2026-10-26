import { Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection";
import HomeAnnouncementBanner from "@/components/sections/HomeAnnouncementBanner";
import ProximaFiesta from "@/components/calendario/ProximaFiesta";
import ProximasActividades from "@/components/sections/ProximasActividades";
import HomeGallery from "@/components/sections/HomeGallery";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import TestimonialsSkeleton from "@/components/sections/skeletons/TestimonialsSkeleton";

// ISR: HTML cacheado; se regenera en segundo plano o al instante cuando el
// backend llama a /api/revalidate tras un cambio en el admin.
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={null}>
        <HomeAnnouncementBanner />
      </Suspense>
      <Suspense fallback={null}>
        <ProximaFiesta />
      </Suspense>
      <Suspense
        fallback={
          <section
            className="py-16 sm:py-20 bg-gradient-to-br from-page via-section-blue to-section-b dark:from-jmv-ink dark:via-[#0C2D69] dark:to-[#0C4EA6]"
            aria-hidden
          />
        }
      >
        <ProximasActividades />
      </Suspense>
      <Suspense fallback={<section aria-hidden className="min-h-[60svh] bg-page" />}>
        <HomeGallery />
      </Suspense>
      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimonialsSection showInvite={false} />
      </Suspense>
      <CTASection />
    </>
  );
}
