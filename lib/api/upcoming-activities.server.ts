import { ssrFetch } from "@/lib/helpers/apiBase";
import type {
  PaginatedResponse,
  UpcomingActivityItem,
} from "@/types/activity-management";

export async function fetchHomeUpcomingActivities(): Promise<
  UpcomingActivityItem[]
> {
  const res = await ssrFetch("/upcoming-activities/home", {
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
