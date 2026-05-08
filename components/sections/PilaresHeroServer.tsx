"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { ssrFetch } from "@/lib/helpers/apiBase";
import PilaresHero from "./PilaresHero";

export default async function PilaresHeroServer() {
  let url = "/images/pilares/pilares-hero.jpg";
  const res = await ssrFetch(
    "/site-images?section=hero_backgrounds&subsection=pilares",
    { revalidate: 1800, tags: ["hero_backgrounds_pilares"] }
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
  return <PilaresHero backgroundUrl={url} />;
}
