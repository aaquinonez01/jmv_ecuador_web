import { getAxiosClient } from "@/config/axios.config";
import type { AdminImageFormData, AdminImage } from "@/types/admin/image";
import { triggerRevalidate } from "../revalidate/trigger";

export async function uploadAdminImage(
  data: AdminImageFormData
): Promise<AdminImage> {
  const form = new FormData();
  form.append("section", data.section);
  if (data.subsection) form.append("subsection", data.subsection);
  form.append("alt", data.alt);
  if (data.title) form.append("title", data.title);
  if (data.description) form.append("description", data.description);
  if (data.eventData) form.append("eventData", JSON.stringify(data.eventData));
  if (data.personData) form.append("personData", JSON.stringify(data.personData));
  if (data.groupId) form.append("groupId", data.groupId);
  form.append("file", data.file);
  const api = getAxiosClient();
  const { data: created } = await api.post("/site-images", form);
  await triggerRevalidate({
    tags: ["galeria_actividades"],
    paths: ["/actividades"],
  });
  return created as AdminImage;
}
