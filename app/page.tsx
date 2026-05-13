import { Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection";
import HomeAnnouncementBanner from "@/components/sections/HomeAnnouncementBanner";
import ProximasActividades from "@/components/sections/ProximasActividades";
import ActivitiesGalleryServer from "@/components/sections/ActivitiesGalleryServer";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import GallerySkeleton from "@/components/sections/skeletons/GallerySkeleton";
import TestimonialsSkeleton from "@/components/sections/skeletons/TestimonialsSkeleton";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<div className="h-12" aria-hidden />}>
        <HomeAnnouncementBanner />
      </Suspense>
      <Suspense
        fallback={
          <section
            className="py-16 sm:py-20 bg-gradient-to-br from-jmv-blue-dark via-jmv-blue to-blue-900"
            aria-hidden
          />
        }
      >
        <ProximasActividades />
      </Suspense>
      <Suspense fallback={<GallerySkeleton />}>
        <ActivitiesGalleryServer />
      </Suspense>
      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimonialsSection />
      </Suspense>
      <CTASection />
    </>
  );
}
