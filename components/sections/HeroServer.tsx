"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { ssrFetch } from "@/lib/helpers/apiBase";
import HeroSection from "./HeroSection";

export default async function HeroServer() {
  let url = "/images/hero/hero.jpg";
  const res = await ssrFetch(
    "/site-images?section=hero_backgrounds&subsection=home",
    { revalidate: 1800, tags: ["hero_backgrounds_home"] }
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
  return <HeroSection backgroundUrl={url} />;
}
