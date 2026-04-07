import { getAxiosClient } from "@/config/axios.config";
import type {
  PaginatedResponse,
  TestimonialItem,
  TestimonialPayload,
} from "@/types/activity-management";

function appendText(
  formData: FormData,
  key: string,
  value?: string | number | boolean | null
) {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
}

function buildTestimonialFormData(payload: TestimonialPayload): FormData {
  const formData = new FormData();

  appendText(formData, "name", payload.name);
  appendText(formData, "role", payload.role);
  appendText(formData, "location", payload.location);
  appendText(formData, "quote", payload.quote);
  appendText(formData, "rating", payload.rating);
  appendText(formData, "active", payload.active);
  appendText(formData, "displayOrder", payload.displayOrder);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
}

export async function getTestimonialsAPI(params?: {
  active?: boolean;
  search?: string;
}): Promise<PaginatedResponse<TestimonialItem>> {
  const api = getAxiosClient();
  const { data } = await api.get("/testimonials", { params });
  return data as PaginatedResponse<TestimonialItem>;
}

export async function getPublicTestimonialsAPI(params?: {
  limit?: number;
}): Promise<PaginatedResponse<TestimonialItem>> {
  const api = getAxiosClient();
  const { data } = await api.get("/testimonials/public", { params });
  return data as PaginatedResponse<TestimonialItem>;
}

export async function createTestimonialAPI(
  payload: TestimonialPayload
): Promise<TestimonialItem> {
  const api = getAxiosClient();
  const { data } = await api.post(
    "/testimonials",
    buildTestimonialFormData(payload)
  );
  return data as TestimonialItem;
}

export async function updateTestimonialAPI(
  id: string,
  payload: Partial<TestimonialPayload>
): Promise<TestimonialItem> {
  const api = getAxiosClient();
  const { data } = await api.patch(
    `/testimonials/${id}`,
    buildTestimonialFormData(payload as TestimonialPayload)
  );
  return data as TestimonialItem;
}

export async function deleteTestimonialAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/testimonials/${id}`);
  return data as { message: string };
}
