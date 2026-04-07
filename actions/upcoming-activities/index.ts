import { getAxiosClient } from "@/config/axios.config";
import type {
  PaginatedResponse,
  UpcomingActivityItem,
  UpcomingActivityPayload,
} from "@/types/activity-management";

function appendText(
  formData: FormData,
  key: string,
  value?: string | number | boolean | null
) {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
}

function buildUpcomingActivityFormData(payload: UpcomingActivityPayload): FormData {
  const formData = new FormData();

  appendText(formData, "title", payload.title);
  appendText(formData, "description", payload.description);
  appendText(formData, "summary", payload.summary);
  appendText(formData, "location", payload.location);
  appendText(formData, "startDate", payload.startDate);
  appendText(formData, "endDate", payload.endDate);
  appendText(formData, "maxRegistrationDate", payload.maxRegistrationDate);
  appendText(formData, "externalUrl", payload.externalUrl);
  appendText(formData, "participantsLabel", payload.participantsLabel);
  appendText(formData, "registrationStatus", payload.registrationStatus);
  appendText(formData, "countdownTargetType", payload.countdownTargetType);
  appendText(formData, "pillarId", payload.pillarId);
  appendText(formData, "typeId", payload.typeId);
  appendText(formData, "published", payload.published);
  appendText(formData, "featuredInHome", payload.featuredInHome);
  appendText(formData, "showInHome", payload.showInHome);
  appendText(formData, "displayOrder", payload.displayOrder);

  if (payload.coverImage) {
    formData.append("coverImage", payload.coverImage);
  }

  if (payload.documents?.length) {
    formData.append(
      "documentTypes",
      payload.documents.map((item) => item.documentType || "otro").join(",")
    );
    payload.documents.forEach((item) => {
      formData.append("documents", item.file);
    });
  }

  return formData;
}

export async function getUpcomingActivitiesAPI(params?: {
  published?: boolean;
  showInHome?: boolean;
  pillarId?: string;
  typeId?: string;
  search?: string;
}): Promise<PaginatedResponse<UpcomingActivityItem>> {
  const api = getAxiosClient();
  const { data } = await api.get("/upcoming-activities", { params });
  return data as PaginatedResponse<UpcomingActivityItem>;
}

export async function getPublicUpcomingActivitiesAPI(params?: {
  pillarId?: string;
  typeId?: string;
  search?: string;
}): Promise<PaginatedResponse<UpcomingActivityItem>> {
  const api = getAxiosClient();
  const { data } = await api.get("/upcoming-activities/public", { params });
  return data as PaginatedResponse<UpcomingActivityItem>;
}

export async function getHomeUpcomingActivitiesAPI(): Promise<
  PaginatedResponse<UpcomingActivityItem>
> {
  const api = getAxiosClient();
  const { data } = await api.get("/upcoming-activities/home");
  return data as PaginatedResponse<UpcomingActivityItem>;
}

export async function createUpcomingActivityAPI(
  payload: UpcomingActivityPayload
): Promise<UpcomingActivityItem> {
  const api = getAxiosClient();
  const { data } = await api.post(
    "/upcoming-activities",
    buildUpcomingActivityFormData(payload)
  );
  return data as UpcomingActivityItem;
}

export async function updateUpcomingActivityAPI(
  id: string,
  payload: Partial<UpcomingActivityPayload>
): Promise<UpcomingActivityItem> {
  const api = getAxiosClient();
  const { data } = await api.patch(
    `/upcoming-activities/${id}`,
    buildUpcomingActivityFormData(payload as UpcomingActivityPayload)
  );
  return data as UpcomingActivityItem;
}

export async function deleteUpcomingActivityAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/upcoming-activities/${id}`);
  return data as { message: string };
}
