import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarDays, Camera } from "lucide-react";
import HeroMedia from "@/components/media/HeroMedia";
import ProximasActividades from "@/components/sections/ProximasActividades";
import ActividadesAlbumsServer from "@/components/sections/ActividadesAlbumsServer";
import GallerySkeleton from "@/components/sections/skeletons/GallerySkeleton";
import { fetchSlotImages } from "@/lib/api/site-images.server";

export const metadata: Metadata = {
  title: "Actividades",
  description:
    "Agenda de próximas actividades de JMV Ecuador y álbumes de retiros, encuentros, campamentos, asambleas y misiones. Agrega las fechas a tu calendario.",
  keywords:
    "actividades JMV, agenda, retiros, encuentros, campamentos, misiones, galería, jóvenes vicencianos Ecuador",
  alternates: { canonical: "/actividades" },
};

// ISR: ver app/page.tsx.
export const revalidate = 3600;

const sectionNav = [
  { href: "#proximas", label: "Próximas", icon: CalendarDays },
  { href: "#realizadas", label: "Realizadas", icon: Camera },
];

export default async function ActividadesPage() {
  const heroImages = await fetchSlotImages("actividades.hero");

  return (
    <>
      <HeroMedia
        images={heroImages}
        eyebrow="Actividades"
        title="Vivencias que transforman"
        lead="Mira lo que se viene y revive, en fotos, lo que ya compartimos."
        breadcrumbs={[{ label: "Actividades" }]}
        carouselLabel="Fotos de actividades de JMV"
        actions={[
          { label: "Ver próximas actividades", href: "#proximas", icon: CalendarDays },
          { label: "Ver actividades realizadas", href: "#realizadas", icon: Camera },
        ]}
      />

      <nav
        aria-label="Secciones de actividades"
        className="sticky top-16 z-30 border-b border-line bg-page/95 backdrop-blur sm:top-20"
      >
        <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {sectionNav.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
              >
                <Icon className="h-4 w-4 text-accent-gold" aria-hidden />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Suspense
        fallback={
          <section id="proximas" aria-busy="true" className="min-h-[50vh] bg-page py-16 sm:py-20">
            <p className="sr-only">Cargando próximas actividades…</p>
          </section>
        }
      >
        <ProximasActividades variant="page" />
      </Suspense>
      <Suspense fallback={<GallerySkeleton />}>
        <ActividadesAlbumsServer />
      </Suspense>
    </>
  );
}
