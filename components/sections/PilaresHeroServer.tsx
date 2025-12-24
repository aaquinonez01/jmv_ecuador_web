"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import PilaresHero from "./PilaresHero";

export default async function PilaresHeroServer() {
  const base = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api").replace(/\/+$/, "");
  let url = "/images/pilares/pilares-hero.jpg";
  try {
    const res = await fetch(`${base}/site-images?section=hero_backgrounds&subsection=pilares`, {
      next: { revalidate: 1800, tags: ["hero_backgrounds_pilares"] },
    });
    const images = await res.json();
    url = getOptimizedUrl(images[0]?.url || url, { w: 2560, q: "auto:best" });
  } catch {
    url = getOptimizedUrl(url, { w: 2560, q: "auto:best" });
  }
  return <PilaresHero backgroundUrl={url} />;
}
