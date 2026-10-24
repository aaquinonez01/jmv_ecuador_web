import { Suspense } from "react";
import type { Metadata } from "next";
import { History, Target } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import MisionVision from "@/components/sections/MisionVision";
import CarismaVicenciano from "@/components/sections/CarismaVicenciano";
import TestimoniosQuienesSomos from "@/components/sections/TestimoniosQuienesSomos";
import TestimonialsSkeleton from "@/components/sections/skeletons/TestimonialsSkeleton";
import SigueExplorando from "@/components/sections/institucional/SigueExplorando";
import { SITE, yearsSinceFoundation } from "@/lib/site";

// ISR: ver app/page.tsx.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Juventudes Marianas Vicencianas Ecuador: jóvenes de 15 a 30 años que viven la fe, la formación y el servicio a los pobres con el carisma de San Vicente de Paúl y la Medalla Milagrosa.",
  alternates: { canonical: "/quienes-somos" },
};

export default function QuienesSomosPage() {
  return (
    <>
      <PageHero
        eyebrow={SITE.fullName}
        title="Quiénes somos"
        motto="Una familia de jóvenes que vive el carisma vicenciano en el servicio, la fe y el compromiso con los más pobres."
        description={`Desde ${SITE.foundedYear}, hace ${yearsSinceFoundation()} años, acompañamos a jóvenes de todo el Ecuador a seguir a Jesús al estilo de San Vicente de Paúl, de la mano de María.`}
        image={{
          src: "/images/gallery/encuentro_nacional_2025.jpg",
          position: "center 45%",
        }}
        motif="hearts"
        breadcrumbs={[{ label: "Quiénes somos" }]}
        actions={[
          { label: "Misión y visión", href: "#mision", icon: Target },
          { label: "Nuestra historia", href: "/quienes-somos/historia", icon: History },
        ]}
      />
      <MisionVision />
      <CarismaVicenciano />
      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimoniosQuienesSomos />
      </Suspense>
      <SigueExplorando items={["historia", "pilares", "estructura", "mundo", "unete"]} />
    </>
  );
}
