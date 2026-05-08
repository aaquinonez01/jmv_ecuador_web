import { Suspense } from "react";
import ActividadesHero from "@/components/sections/ActividadesHero";
import ActividadesAlbumsServer from "@/components/sections/ActividadesAlbumsServer";
import GallerySkeleton from "@/components/sections/skeletons/GallerySkeleton";

export const metadata = {
  title: "Actividades - JMV Ecuador",
  description:
    "Descubre las experiencias más significativas de nuestros jóvenes: retiros nacionales, encuentros, campamentos, asambleas y misiones que transforman vidas.",
  keywords:
    "actividades JMV, retiros, encuentros, campamentos, misiones, galería, jóvenes vicencianos Ecuador",
};

export default function ActividadesPage() {
  return (
    <>
      <ActividadesHero />
      <Suspense fallback={<GallerySkeleton />}>
        <ActividadesAlbumsServer />
      </Suspense>
    </>
  );
}
