import HeroServer from "@/components/sections/HeroServer";
import ProximasActividadesServer from "@/components/sections/ProximasActividadesServer";
import ActivitiesGalleryServer from "@/components/sections/ActivitiesGalleryServer";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroServer />
      <ProximasActividadesServer />
      <ActivitiesGalleryServer />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
