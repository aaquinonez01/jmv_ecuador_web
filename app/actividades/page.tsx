import ActividadesHero from "@/components/sections/ActividadesHero";
import { getImagesBySectionAPI } from "@/actions/admin-images/get-by-section";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import ActividadesAlbumsServer from "@/components/sections/ActividadesAlbumsServer";
export const revalidate = 300;

export default async function ActividadesPage() {
  const base = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");
  let url = "";
  try {
    const res = await fetch(
      `${base}/site-images?section=hero_backgrounds&subsection=actividades`,
      {
        next: { revalidate: 1800, tags: ["hero_backgrounds_actividades"] },
      }
    );
    const imgs = await res.json();
    url = getOptimizedUrl(imgs[0]?.url || "", { w: 2560, q: "auto:best" });
  } catch {
    url = getOptimizedUrl("/images/hero/hero.jpg", { w: 2560, q: "auto:best" });
  }
  return (
    <>
      <ActividadesHero heroUrl={url} />
      <ActividadesAlbumsServer />
    </>
  );
}

export const metadata = {
  title: "Actividades - JMV Ecuador",
  description:
    "Descubre las experiencias más significativas de nuestros jóvenes: retiros nacionales, encuentros, campamentos, asambleas y misiones que transforman vidas.",
  keywords:
    "actividades JMV, retiros, encuentros, campamentos, misiones, galería, jóvenes vicencianos Ecuador",
};
