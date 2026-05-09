import { Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection";
import HomeAnnouncementBanner from "@/components/sections/HomeAnnouncementBanner";
import ProximasActividades from "@/components/sections/ProximasActividades";
import ActivitiesGalleryServer from "@/components/sections/ActivitiesGalleryServer";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import GallerySkeleton from "@/components/sections/skeletons/GallerySkeleton";
import TestimonialsSkeleton from "@/components/sections/skeletons/TestimonialsSkeleton";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HomeAnnouncementBanner />
      <ProximasActividades />
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
