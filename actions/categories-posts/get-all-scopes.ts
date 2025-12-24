"use server";

import { createApi } from "@/config/axios.config";

export async function getAllScopes() {
  const api = createApi();
  const { data } = await api.get("/category-post/scopes");
  return (data?.scopes ?? data ?? []) as Array<{
    id: string;
    name: string;
    slug: string;
    order: number;
  }>;
}
