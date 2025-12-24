"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import ActivitiesAlbumsClient from "./ActivitiesAlbumsClient";
import type { AdminImage } from "@/types/admin/image";

export default async function ActivitiesGalleryServer() {
  const base = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api").replace(/\/+$/, "");
  let images: AdminImage[] = [];
  try {
    const res = await fetch(`${base}/site-images?section=galeria_actividades`, {
      next: { revalidate: 300, tags: ["galeria_actividades"] },
    });
    images = await res.json();
  } catch {
    images = [];
  }
  const groups = new Map<string, { title: string; desc?: string; coverUrl: string; imgs: typeof images }>();
  for (const img of images) {
    const key = img.metadata?.groupId || `${img.title || img.alt || img.id}`;
    const url = getOptimizedUrl(img.url, { w: 1600, q: 'auto:good' });
    if (!groups.has(key)) {
      groups.set(key, { title: img.title || img.alt, desc: img.description, coverUrl: url, imgs: [img] });
    } else {
      groups.get(key)!.imgs.push(img);
    }
  }
  const albums = Array.from(groups.entries()).map(([id, g]) => ({
    id,
    title: g.title || 'Actividad',
    description: g.desc,
    coverUrl: g.coverUrl,
    count: g.imgs.length,
    images: g.imgs.map((i) => ({ id: i.id, url: getOptimizedUrl(i.url, { w: 1600, q: 'auto:good' }), alt: i.alt })),
  }));
  return <ActivitiesAlbumsClient albums={albums} />;
}
