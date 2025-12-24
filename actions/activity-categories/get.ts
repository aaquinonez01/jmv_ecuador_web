import { getAxiosClient } from "@/config/axios.config";

export interface ActivityCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  active: boolean;
}

export async function getActivityCategoriesAPI(): Promise<ActivityCategory[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/activity-categories");
  return data as ActivityCategory[];
}

