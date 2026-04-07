import { getAxiosClient } from "@/config/axios.config";
import type {
  ActivityCatalogItem,
  ActivityCatalogPayload,
} from "@/types/activity-management";

export async function getActivityTypesAPI(): Promise<ActivityCatalogItem[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/activity-types");
  return data as ActivityCatalogItem[];
}

export async function createActivityTypeAPI(
  payload: ActivityCatalogPayload
): Promise<ActivityCatalogItem> {
  const api = getAxiosClient();
  const { data } = await api.post("/activity-types", payload);
  return data as ActivityCatalogItem;
}

export async function updateActivityTypeAPI(
  id: string,
  payload: Partial<ActivityCatalogPayload>
): Promise<ActivityCatalogItem> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/activity-types/${id}`, payload);
  return data as ActivityCatalogItem;
}

export async function deleteActivityTypeAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/activity-types/${id}`);
  return data as { message: string };
}
