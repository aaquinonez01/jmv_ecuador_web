import { getAxiosClient } from "@/config/axios.config";
import { ActivityCategory } from "./get";
import { triggerRevalidate } from "../revalidate/trigger";

export async function updateActivityCategoryAPI(id: string, body: Partial<ActivityCategory>): Promise<ActivityCategory> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/activity-categories/${id}`, body);
  await triggerRevalidate({
    tags: ["activity_categories", "galeria_actividades"],
    paths: ["/actividades"],
  });
  return data as ActivityCategory;
}
