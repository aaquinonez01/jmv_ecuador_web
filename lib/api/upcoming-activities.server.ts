import { ssrFetch } from "@/lib/helpers/apiBase";
import type {
  PaginatedResponse,
  UpcomingActivityItem,
} from "@/types/activity-management";

async function fetchUpcoming(path: string): Promise<UpcomingActivityItem[]> {
  const res = await ssrFetch(path, {
    revalidate: 300,
    tags: ["upcoming_home"],
  });
  if (!res) return [];
  try {
    const data = (await res.json()) as PaginatedResponse<UpcomingActivityItem>;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export function fetchHomeUpcomingActivities() {
  return fetchUpcoming("/upcoming-activities/home");
}

/** Todas las próximas actividades publicadas (para /actividades) */
export function fetchPublicUpcomingActivities() {
  return fetchUpcoming("/upcoming-activities/public?limit=30");
}

const DAY = 24 * 60 * 60 * 1000;

/** Quita borradores y eventos que ya terminaron (con un día de margen) */
export function onlyPublicUpcoming(items: UpcomingActivityItem[], now = Date.now()) {
  return items.filter((item) => {
    if (item.registrationStatus === "draft") return false;
    const ref = item.endDate ?? item.startDate;
    if (!ref) return true;
    const time = new Date(ref).getTime();
    return Number.isNaN(time) || time >= now - DAY;
  });
}
