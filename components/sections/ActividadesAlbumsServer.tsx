import ActivitiesAlbumsClient from "./ActivitiesAlbumsClient";
import { ssrFetch } from "@/lib/helpers/apiBase";
import type {
  ActivityCatalogItem,
  ActivityItem,
  PaginatedResponse,
} from "@/types/activity-management";

const ALBUMS_PAGE_SIZE = 12;

async function readCatalog(path: string, tag: string) {
  try {
    const res = await ssrFetch(path, { revalidate: 86400, tags: [tag] });
    if (!res) return [];
    return ((await res.json()) as ActivityCatalogItem[]).filter((item) => item.active);
  } catch {
    return [];
  }
}

// Primera página de álbumes en el servidor; los filtros y "Cargar más" piden
// las siguientes al backend desde el navegador (GET /activities/public).
export default async function ActividadesAlbumsServer() {
  let initial: PaginatedResponse<ActivityItem> | null = null;

  const [activitiesRes, pillars, types] = await Promise.all([
    ssrFetch(`/activities/public?limit=${ALBUMS_PAGE_SIZE}&offset=0`, {
      revalidate: 86400,
      tags: ["activities_public"],
    }).catch(() => null),
    readCatalog("/activity-pillars", "activity_pillars_public"),
    readCatalog("/activity-types", "activity_types_public"),
  ]);

  if (activitiesRes) {
    try {
      const data = (await activitiesRes.json()) as PaginatedResponse<ActivityItem>;
      initial = { total: data.total ?? data.items?.length ?? 0, items: data.items ?? [] };
    } catch {
      initial = null;
    }
  }

  return (
    <ActivitiesAlbumsClient
      initial={initial}
      pageSize={ALBUMS_PAGE_SIZE}
      pillars={pillars}
      types={types}
    />
  );
}
