import ActividadesHero from "@/components/sections/ActividadesHero";
import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { ssrFetch } from "@/lib/helpers/apiBase";
import ActividadesAlbumsServer from "@/components/sections/ActividadesAlbumsServer";
export const revalidate = 300;

export default async function ActividadesPage() {
  let url = getOptimizedUrl("/images/hero/hero.jpg", {
    w: 1920,
    q: "auto:good",
  });
  const res = await ssrFetch(
    "/site-images?section=hero_backgrounds&subsection=actividades",
    { revalidate: 1800, tags: ["hero_backgrounds_actividades"] },
  );
  if (res) {
    try {
      const imgs = await res.json();
      if (imgs?.[0]?.url) {
        url = getOptimizedUrl(imgs[0].url, { w: 1920, q: "auto:good" });
      }
    } catch {
      // keep fallback
    }
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
