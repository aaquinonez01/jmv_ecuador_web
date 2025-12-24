import { getAxiosClient } from "@/config/axios.config";
import type { AdminImageUpdateData, AdminImage } from "@/types/admin/image";
import { triggerRevalidate } from "../revalidate/trigger";

export async function updateAdminImage(
  id: string,
  payload: AdminImageUpdateData
): Promise<AdminImage> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/site-images/${id}`, payload);
  await triggerRevalidate({
    tags: ["galeria_actividades"],
    paths: ["/actividades"],
  });
  return data as AdminImage;
}
