"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import ProximasActividades from "./ProximasActividades";

export default async function ProximasActividadesServer() {
  const base = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api").replace(/\/+$/, "");
  let url = "";
  try {
    const res = await fetch(`${base}/site-images?section=proximas_actividades`, {
      next: { revalidate: 900, tags: ["proximas_actividades"] },
    });
    const images = await res.json();
    url = getOptimizedUrl(images[0]?.url || "", { w: 1920, q: "auto:best" });
  } catch {
    url = getOptimizedUrl("/images/hero/hero.jpg", { w: 1920, q: "auto:best" });
  }
  return <ProximasActividades featuredImageUrl={url} />;
}
