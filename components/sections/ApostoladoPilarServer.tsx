"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import ApostoladoPilarView from "@/components/sections/ApostoladoPilarView";

export default async function ApostoladoPilarServer() {
  const base = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");
  let cards: Array<{
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    ubicacion?: string;
    beneficiarios?: number;
  }> = [];
  try {
    const res = await fetch(`${base}/site-images?section=pilares_apostolado`, {
      next: { revalidate: 600, tags: ["pilares_apostolado"] },
    });
    const images = (await res.json()) as Array<{
      id: string;
      url: string;
      alt: string;
      title?: string;
      description?: string;
      metadata?: { location?: string; beneficiaries?: number };
    }>;
    cards = images.map((img) => ({
      id: img.id,
      titulo: img.title || img.alt,
      descripcion: img.description || "",
      imagen: getOptimizedUrl(img.url, { w: 1200, q: "auto:good" }),
      ubicacion: (img as any)?.eventData?.location || "—",
      beneficiarios: (img as any)?.eventData?.status ? undefined : undefined,
    }));
  } catch {
    cards = [];
  }
  return <ApostoladoPilarView items={cards} />;
}
