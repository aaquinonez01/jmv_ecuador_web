"use server";

import { createApi } from "@/config/axios.config";

export async function getSubtypesByActivityType(activityTypeId: string) {
  const api = createApi();
  const { data } = await api.get(
    `/category-post/activity-types/${activityTypeId}/subtypes`
  );
  return (data?.subtypes ?? data ?? []) as Array<{
    id: string;
    name: string;
    slug: string;
    order: number;
  }>;
}
