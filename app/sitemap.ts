import type { MetadataRoute } from "next";
import { fetchCalendarDates } from "@/lib/api/calendar.server";
import { calendarHref } from "@/lib/calendario";

const BASE = "https://jmvecuador.org";

const routes = [
  "",
  "/actividades",
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
  const dates = await fetchCalendarDates().catch(() => []);
  for (const item of dates) {
    pages.push({
      url: `${BASE}${calendarHref(item.slug)}`,
      ...(item.updatedAt ? { lastModified: new Date(item.updatedAt) } : {}),
    });
  }
  return pages;
}
