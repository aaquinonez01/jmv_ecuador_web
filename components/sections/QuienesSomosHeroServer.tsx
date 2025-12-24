"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import QuienesSomosHero from "./QuienesSomosHero";

export default async function QuienesSomosHeroServer() {
  const base = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");
  let url = "/images/quienes-somos/jmv-community.jpg";
  try {
    const res = await fetch(
      `${base}/site-images?section=hero_backgrounds&subsection=quienes-somos`,
      {
        next: { revalidate: 1800, tags: ["hero_backgrounds_quienes"] },
      }
    );
    const images = await res.json();
    url = getOptimizedUrl(images[0]?.url || url, {
      w: 2560,
      q: "auto:best",
    });
  } catch {
    url = getOptimizedUrl(url, { w: 2560, q: "auto:best" });
  }
  return <QuienesSomosHero backgroundUrl={url} />;
}
