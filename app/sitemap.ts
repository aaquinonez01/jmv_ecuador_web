import type { MetadataRoute } from "next";
import { fetchCalendarDates } from "@/lib/api/calendar.server";
import { calendarHref } from "@/lib/calendario";
import { fetchLibraryCollections, fetchLibraryDocuments } from "@/lib/api/library.server";
import { collectionHref, libraryHref } from "@/lib/biblioteca";

const BASE = "https://jmvecuador.org";

// Se regenera cada hora para sumar las fechas del Año Vicenciano y la biblioteca
export const revalidate = 3600;

const routes = [
  "",
  "/actividades",
  "/biblioteca",
  "/blog",
  "/calendario",
  "/contacto",
  "/estructura",
  "/formacion",
  "/formacion/ejes",
  "/formacion/santos",
  "/jmv-en-el-mundo",
  "/pilares",
  "/quienes-somos",
  "/quienes-somos/historia",
  "/unete",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = routes.map((path) => ({ url: `${BASE}${path}` }));

  // Si el backend falla, el sitemap sale igual con las páginas fijas
  const [dates, documents, collections] = await Promise.all([
    fetchCalendarDates().catch(() => []),
    fetchLibraryDocuments().catch(() => []),
    fetchLibraryCollections().catch(() => []),
  ]);
  for (const item of dates) {
    pages.push({
      url: `${BASE}${calendarHref(item.slug)}`,
      ...(item.updatedAt ? { lastModified: new Date(item.updatedAt) } : {}),
    });
  }
  for (const doc of documents) {
    pages.push({
      url: `${BASE}${libraryHref(doc.slug)}`,
      ...(doc.updatedAt ? { lastModified: new Date(doc.updatedAt) } : {}),
    });
  }
  for (const collection of collections) {
    pages.push({ url: `${BASE}${collectionHref(collection.slug)}` });
  }
  return pages;
}
