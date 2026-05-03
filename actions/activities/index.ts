import { getAxiosClient } from "@/config/axios.config";
import type {
  ActivityItem,
  ActivityPayload,
  PaginatedResponse,
} from "@/types/activity-management";
import { triggerRevalidate } from "../revalidate/trigger";

const ACTIVITIES_REVALIDATE = {
  tags: ["activities_public", "activities_public_home"],
  paths: ["/actividades", "/"],
};

function appendText(
  formData: FormData,
  key: string,
  value?: string | number | boolean | null
) {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
}

function buildActivityFormData(payload: ActivityPayload): FormData {
  const formData = new FormData();

  appendText(formData, "title", payload.title);
  appendText(formData, "description", payload.description);
  appendText(formData, "summary", payload.summary);
  appendText(formData, "location", payload.location);
  appendText(formData, "participantsLabel", payload.participantsLabel);
  appendText(formData, "startDate", payload.startDate);
  appendText(formData, "endDate", payload.endDate);
  appendText(formData, "pillarId", payload.pillarId);
  appendText(formData, "typeId", payload.typeId);
  appendText(formData, "published", payload.published);
  appendText(formData, "featured", payload.featured);
  appendText(
    formData,
    "showInActivitiesPage",
    payload.showInActivitiesPage
  );
  appendText(formData, "displayOrder", payload.displayOrder);

  if (payload.coverImage) {
    formData.append("coverImage", payload.coverImage);
  }

  payload.gallery?.forEach((file) => {
    formData.append("gallery", file);
  });

  return formData;
}

export async function getActivitiesAPI(params?: {
  published?: boolean;
  pillarId?: string;
  typeId?: string;
  search?: string;
}): Promise<PaginatedResponse<ActivityItem>> {
  const api = getAxiosClient();
  const { data } = await api.get("/activities", { params });
  return data as PaginatedResponse<ActivityItem>;
}

export async function getPublicActivitiesAPI(params?: {
  pillarId?: string;
  typeId?: string;
  search?: string;
}): Promise<PaginatedResponse<ActivityItem>> {
  const api = getAxiosClient();
  const { data } = await api.get("/activities/public", { params });
  return data as PaginatedResponse<ActivityItem>;
}

export async function createActivityAPI(
  payload: ActivityPayload
): Promise<ActivityItem> {
  const api = getAxiosClient();
  const { data } = await api.post("/activities", buildActivityFormData(payload));
  await triggerRevalidate(ACTIVITIES_REVALIDATE);
  return data as ActivityItem;
}

export async function updateActivityAPI(
  id: string,
  payload: Partial<ActivityPayload>
): Promise<ActivityItem> {
  const api = getAxiosClient();
  const { data } = await api.patch(
    `/activities/${id}`,
    buildActivityFormData(payload as ActivityPayload)
  );
  await triggerRevalidate(ACTIVITIES_REVALIDATE);
  return data as ActivityItem;
}

export async function deleteActivityAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/activities/${id}`);
  await triggerRevalidate(ACTIVITIES_REVALIDATE);
  return data as { message: string };
}
