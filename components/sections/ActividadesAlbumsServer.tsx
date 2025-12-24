"use server";

import { getOptimizedUrl } from "@/lib/helpers/cloudinary";
import ActivitiesAlbumsClient from "./ActivitiesAlbumsClient";
import type { ActivityCategory } from "@/actions/activity-categories/get";
import type { AdminImage } from "@/types/admin/image";

export default async function ActividadesAlbumsServer() {
  const base = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");
  let images: AdminImage[] = [];
  let cats: ActivityCategory[] = [];
  try {
    const [imagesRes, catsRes] = await Promise.all([
      fetch(`${base}/site-images?section=galeria_actividades`, {
        next: { revalidate: 300, tags: ["galeria_actividades"] },
      }),
      fetch(`${base}/activity-categories`, {
        next: { revalidate: 600, tags: ["activity_categories"] },
      }),
    ]);
    images = await imagesRes.json();
    cats = await catsRes.json();
  } catch {
    images = [];
    cats = [];
  }
  const catMap = new Map<string, string>();
  cats.forEach((c) => catMap.set(c.slug, c.name));
  const groups = new Map<
    string,
    { title: string; desc?: string; coverUrl: string; imgs: typeof images }
  >();
  for (const img of images) {
    const key = img.metadata?.groupId || `${img.title || img.alt || img.id}`;
    const url = getOptimizedUrl(img.url, { w: 1600, q: "auto:good" });
    if (!groups.has(key)) {
      groups.set(key, {
        title: img.title || img.alt,
        desc: img.description,
        coverUrl: url,
        imgs: [img],
      });
    } else {
      groups.get(key)!.imgs.push(img);
    }
  }
  const albums = Array.from(groups.entries()).map(([id, g]) => ({
    id,
    title: g.title || "Actividad",
    description: g.desc,
    coverUrl: g.coverUrl,
    count: g.imgs.length,
    categorySlug: g.imgs[0]?.subsection || null,
    categoryName: g.imgs[0]?.subsection
      ? catMap.get(g.imgs[0].subsection) || g.imgs[0].subsection
      : null,
    images: g.imgs.map((i) => ({
      id: i.id,
      url: getOptimizedUrl(i.url, { w: 1600, q: "auto:good" }),
      alt: i.alt,
    })),
  }));
  const categories = cats
    .filter((c) => c.active)
    .map((c) => ({ slug: c.slug, name: c.name }));
  return <ActivitiesAlbumsClient albums={albums} categories={categories} />;
}
