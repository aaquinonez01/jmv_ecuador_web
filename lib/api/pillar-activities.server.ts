import { ssrFetch } from "@/lib/helpers/apiBase";
import { fetchPublicUpcomingActivities, onlyPublicUpcoming } from "@/lib/api/upcoming-activities.server";
import { formatDate } from "@/lib/format";
import type { ActivityItem, PaginatedResponse } from "@/types/activity-management";
import { PILLAR_SLUGS, type PillarActivity, type PillarKey } from "./pillar-activities";

const MAX_PER_PILLAR = 4;

function dateRange(start?: string | null, end?: string | null) {
  if (!start) return null;
  const s = formatDate(start, { day: "numeric", month: "short", year: "numeric" });
  if (!end) return s;
  const e = formatDate(end, { day: "numeric", month: "short", year: "numeric" });
  return e === s ? s : `${formatDate(start, { day: "numeric", month: "short" })} – ${e}`;
}

async function fetchAlbums(): Promise<ActivityItem[]> {
  try {
    const res = await ssrFetch("/activities/public?limit=60&offset=0", {
      revalidate: 3600,
      tags: ["activities_public"],
    });
    if (!res) return [];
    const data = (await res.json()) as PaginatedResponse<ActivityItem>;
    return data.items ?? [];
  } catch {
    return [];
  }
}

/**
 * Actividades de cada pilar: primero las próximas, luego los álbumes de las
 * realizadas (las más recientes), hasta 4 por pilar. Si la API falla, listas vacías.
 */
export async function fetchActivitiesByPillar(): Promise<Record<PillarKey, PillarActivity[]>> {
  const [upcomingRaw, albums] = await Promise.all([
    fetchPublicUpcomingActivities().catch(() => []),
    fetchAlbums(),
  ]);
  const upcoming = onlyPublicUpcoming(upcomingRaw);

  const result = { comunidad: [], espiritualidad: [], apostolado: [], formacion: [] } as Record<
    PillarKey,
    PillarActivity[]
  >;

  for (const key of Object.keys(PILLAR_SLUGS) as PillarKey[]) {
    const slug = PILLAR_SLUGS[key];
    const proximas: PillarActivity[] = upcoming
      .filter((a) => a.pillar?.slug === slug)
      .map((a) => ({
        key: `proxima-${a.id}`,
        kind: "proxima",
        title: a.title,
        dateLabel: dateRange(a.startDate, a.endDate),
        coverUrl: a.coverImageUrl ?? null,
        href: "/actividades#proximas",
      }));
    const realizadas: PillarActivity[] = albums
      .filter((a) => a.pillar?.slug === slug)
      .sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""))
      .map((a) => ({
        key: `realizada-${a.id}`,
        kind: "realizada",
        title: a.title,
        dateLabel: dateRange(a.startDate, a.endDate),
        coverUrl: a.coverImageUrl ?? null,
        href: `/actividades?pilar=${slug}#realizadas`,
      }));
    result[key] = [...proximas, ...realizadas].slice(0, MAX_PER_PILLAR);
  }
  return result;
}
