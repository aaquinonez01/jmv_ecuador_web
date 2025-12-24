import { getAxiosClient } from "@/config/axios.config";
import { triggerRevalidate } from "../revalidate/trigger";

export async function deleteAdminImage(id: string): Promise<void> {
  const api = getAxiosClient();
  await api.delete(`/site-images/${id}`);
  await triggerRevalidate({
    tags: ["galeria_actividades"],
    paths: ["/actividades"],
  });
}
