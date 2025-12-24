import { getAxiosClient } from "@/config/axios.config";
import { triggerRevalidate } from "../revalidate/trigger";

export async function deleteActivityCategoryAPI(id: string): Promise<{ message: string }> {
  const api = getAxiosClient();
  const { data } = await api.delete(`/activity-categories/${id}`);
  await triggerRevalidate({
    tags: ["activity_categories", "galeria_actividades"],
    paths: ["/actividades"],
  });
  return data as { message: string };
}
