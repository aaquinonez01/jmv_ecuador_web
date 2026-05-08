"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { ssrFetch } from "@/lib/helpers/apiBase";
import QuienesSomosHero from "./QuienesSomosHero";

export default async function QuienesSomosHeroServer() {
  let url = "/images/quienes-somos/jmv-community.jpg";
  const res = await ssrFetch(
    "/site-images?section=hero_backgrounds&subsection=quienes-somos",
    { revalidate: 1800, tags: ["hero_backgrounds_quienes"] }
  );
  if (res) {
    try {
      const images = await res.json();
      url = getOptimizedUrl(images[0]?.url || url, { w: 1920, q: "auto:good" });
    } catch {
      url = getOptimizedUrl(url, { w: 1920, q: "auto:good" });
    }
  } else {
    url = getOptimizedUrl(url, { w: 1920, q: "auto:good" });
  }
  return <QuienesSomosHero backgroundUrl={url} />;
}
