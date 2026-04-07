import { getAxiosClient } from "@/config/axios.config";
import type {
  ActivityCatalogItem,
  ActivityCatalogPayload,
} from "@/types/activity-management";

export async function getActivityPillarsAPI(): Promise<ActivityCatalogItem[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/activity-pillars");
  return data as ActivityCatalogItem[];
}

export async function createActivityPillarAPI(
  payload: ActivityCatalogPayload
): Promise<ActivityCatalogItem> {
  const api = getAxiosClient();
  const { data } = await api.post("/activity-pillars", payload);
  return data as ActivityCatalogItem;
}

export async function updateActivityPillarAPI(
  id: string,
  payload: Partial<ActivityCatalogPayload>
): Promise<ActivityCatalogItem> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/activity-pillars/${id}`, payload);
  return data as ActivityCatalogItem;
}

export async function deleteActivityPillarAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/activity-pillars/${id}`);
  return data as { message: string };
}
