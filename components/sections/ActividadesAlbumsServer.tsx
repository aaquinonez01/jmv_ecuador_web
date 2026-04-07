"use server";

import ActivitiesAlbumsClient from "./ActivitiesAlbumsClient";
import type {
  ActivityCatalogItem,
  ActivityItem,
  PaginatedResponse,
} from "@/types/activity-management";

export default async function ActividadesAlbumsServer() {
  const base = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3002/api"
  ).replace(/\/+$/, "");

  let activities: ActivityItem[] = [];
  let pillars: ActivityCatalogItem[] = [];
  let types: ActivityCatalogItem[] = [];

  try {
    const [activitiesRes, pillarsRes, typesRes] = await Promise.all([
      fetch(`${base}/activities/public`, {
        next: { revalidate: 300, tags: ["activities_public"] },
      }),
      fetch(`${base}/activity-pillars`, {
        next: { revalidate: 600, tags: ["activity_pillars_public"] },
      }),
      fetch(`${base}/activity-types`, {
        next: { revalidate: 600, tags: ["activity_types_public"] },
      }),
    ]);

    if (!activitiesRes.ok || !pillarsRes.ok || !typesRes.ok) {
      throw new Error("No se pudo cargar actividades públicas");
    }

    const activitiesData =
      (await activitiesRes.json()) as PaginatedResponse<ActivityItem>;
    activities = activitiesData.items || [];
    pillars = ((await pillarsRes.json()) as ActivityCatalogItem[]).filter(
      (item) => item.active
    );
    types = ((await typesRes.json()) as ActivityCatalogItem[]).filter(
      (item) => item.active
    );
  } catch {
    activities = [];
    pillars = [];
    types = [];
  }

  return (
    <ActivitiesAlbumsClient
      activities={activities}
      pillars={pillars}
      types={types}
    />
  );
}
