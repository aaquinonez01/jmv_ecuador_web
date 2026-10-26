import { Suspense } from "react";
import type { Metadata } from "next";
import { History, Target } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import MisionVision from "@/components/sections/MisionVision";
import CarismaVicenciano from "@/components/sections/CarismaVicenciano";
import TestimoniosQuienesSomos from "@/components/sections/TestimoniosQuienesSomos";
import TestimonialsSkeleton from "@/components/sections/skeletons/TestimonialsSkeleton";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import EstatutosTeaser from "@/components/estatutos/EstatutosTeaser";
import { fetchSlots } from "@/lib/api/site-images.server";
import { SITE, yearsSinceFoundation } from "@/lib/site";

// ISR: ver app/page.tsx.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Juventudes Marianas Vicencianas Ecuador: jóvenes de 15 a 30 años que viven la fe, la formación y el servicio a los pobres con el carisma de San Vicente de Paúl y la Medalla Milagrosa.",
  alternates: { canonical: "/quienes-somos" },
};

export default async function QuienesSomosPage() {
  const fotos = await fetchSlots(["quienes-somos.hero", "quienes-somos.mision", "quienes-somos.carisma"] as const);

  return (
    <>
      <HeroMedia
        images={fotos["quienes-somos.hero"]}
        carouselLabel="Fotos de Quiénes somos"
        eyebrow={SITE.name}
        title="Quiénes somos"
        lead="Una familia de jóvenes que vive el carisma vicenciano al servicio de los más pobres."
        breadcrumbs={[{ label: "Quiénes somos" }]}
        actions={[
          { label: "Misión y visión", href: "#mision", icon: Target },
          { label: "Nuestra historia", href: "/quienes-somos/historia", icon: History },
        ]}
      />
      <MisionVision
        photo={fotos["quienes-somos.mision"][0]}
        intro={`Desde ${SITE.foundedYear}, hace ${yearsSinceFoundation()} años, acompañamos a jóvenes de todo el Ecuador a seguir a Jesús al estilo de San Vicente de Paúl, de la mano de María.`}
      />
      <CarismaVicenciano catalinaPhoto={fotos["quienes-somos.carisma"][0]} />
      <EstatutosTeaser />
      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimoniosQuienesSomos />
      </Suspense>
      <SigueExplorando items={["historia", "estatutos", "pilares", "estructura", "mundo", "unete"]} />
    </>
  );
}
