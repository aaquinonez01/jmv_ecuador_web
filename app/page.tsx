import HeroServer from "@/components/sections/HeroServer";
import HomeAnnouncementBanner from "@/components/sections/HomeAnnouncementBanner";
import ProximasActividades from "@/components/sections/ProximasActividades";
import ActivitiesGalleryServer from "@/components/sections/ActivitiesGalleryServer";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroServer />
      <HomeAnnouncementBanner />
      <ProximasActividades />
      <ActivitiesGalleryServer />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
