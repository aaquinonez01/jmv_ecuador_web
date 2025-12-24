"use server";

import { createApi } from "@/config/axios.config";
import type { AdminImage } from "@/types/admin/image";

export async function getImagesBySectionAPI(
  section: string,
  subsection?: string
): Promise<AdminImage[]> {
  const api = createApi();
  const params = new URLSearchParams();
  params.append("section", section);
  if (subsection) params.append("subsection", subsection);
  const { data } = await api.get(`/site-images?${params.toString()}`);
  return data as AdminImage[];
}

