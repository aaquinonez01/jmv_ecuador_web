import { getAxiosClient } from "@/config/axios.config";

export async function reorderAdminImages(
  section: string,
  ids: string[],
  subsection?: string
): Promise<void> {
  const api = getAxiosClient();
  await api.patch(`/site-images/reorder`, {
    section,
    subsection,
    ids,
  });
}

