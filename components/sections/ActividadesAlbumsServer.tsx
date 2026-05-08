"use server";

import ActivitiesAlbumsClient from "./ActivitiesAlbumsClient";
import { ssrFetch } from "@/lib/helpers/apiBase";
import type {
  ActivityCatalogItem,
  ActivityItem,
  PaginatedResponse,
} from "@/types/activity-management";

export default async function ActividadesAlbumsServer() {
  let activities: ActivityItem[] = [];
  let pillars: ActivityCatalogItem[] = [];
  let types: ActivityCatalogItem[] = [];

  const [activitiesRes, pillarsRes, typesRes] = await Promise.all([
    ssrFetch("/activities/public", {
      revalidate: 300,
      tags: ["activities_public"],
    }),
    ssrFetch("/activity-pillars", {
      revalidate: 600,
      tags: ["activity_pillars_public"],
    }),
    ssrFetch("/activity-types", {
      revalidate: 600,
      tags: ["activity_types_public"],
    }),
  ]);

  if (activitiesRes) {
    try {
      const data =
        (await activitiesRes.json()) as PaginatedResponse<ActivityItem>;
      activities = data.items || [];
    } catch {
      activities = [];
    }
  }

  if (pillarsRes) {
    try {
      pillars = ((await pillarsRes.json()) as ActivityCatalogItem[]).filter(
        (item) => item.active
      );
    } catch {
      pillars = [];
    }
  }

  if (typesRes) {
    try {
      types = ((await typesRes.json()) as ActivityCatalogItem[]).filter(
        (item) => item.active
      );
    } catch {
      types = [];
    }
  }

  return (
    <ActivitiesAlbumsClient
      activities={activities}
      pillars={pillars}
      types={types}
    />
  );
}
