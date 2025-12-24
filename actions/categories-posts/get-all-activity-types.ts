"use server";

import { createApi } from "@/config/axios.config";

export async function getAllActivityTypes() {
  const api = createApi();
  const { data } = await api.get("/category-post/activity-types");
  return (data?.activityTypes ?? data ?? []) as Array<{
    id: string;
    name: string;
    slug: string;
    order: number;
  }>;
}
