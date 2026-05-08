"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import { ssrFetch } from "@/lib/helpers/apiBase";
import ApostoladoPilarView from "@/components/sections/ApostoladoPilarView";

export default async function ApostoladoPilarServer() {
  let cards: Array<{
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    ubicacion?: string;
    beneficiarios?: number;
  }> = [];

  const res = await ssrFetch("/site-images?section=pilares_apostolado", {
    revalidate: 600,
    tags: ["pilares_apostolado"],
  });
  if (res) {
    try {
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
  }

  return <ApostoladoPilarView items={cards} />;
}
