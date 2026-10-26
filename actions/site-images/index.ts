import { getAxiosClient } from "@/config/axios.config";

// Fotos de los "espacios de foto" (lib/site-images.ts), desde /admin/imagenes.
// La revalidación de la web la hace el backend tras cada cambio
// (tag 'site_images' + la ruta de la página del espacio).

export interface AdminSiteImage {
  id: string;
  section: string;
  subsection?: string | null;
  url: string;
  alt: string;
  orden: number;
  activo: boolean;
  filename: string;
  createdAt: string;
  metadata?: { size?: number; uploadedAt?: string; uploadedBy?: string } | null;
}

/** Todas las fotos subidas, de todos los espacios */
export async function getAllSiteImagesAPI(): Promise<AdminSiteImage[]> {
  const { data } = await getAxiosClient().get("/site-images/all");
  return Array.isArray(data) ? (data as AdminSiteImage[]) : [];
}

export async function uploadSiteImageAPI(
  section: string,
  file: File,
  alt: string,
  onProgress?: (fraction: number) => void,
): Promise<AdminSiteImage> {
  const form = new FormData();
  form.append("section", section);
  form.append("alt", alt);
  form.append("file", file);
  const { data } = await getAxiosClient().post("/site-images", form, {
    onUploadProgress: (event) => {
      if (onProgress && event.total) onProgress(event.loaded / event.total);
    },
  });
  return data as AdminSiteImage;
}

export async function updateSiteImageAPI(id: string, payload: { alt?: string; activo?: boolean }): Promise<AdminSiteImage> {
  const { data } = await getAxiosClient().patch(`/site-images/${id}`, payload);
  return data as AdminSiteImage;
}

export async function reorderSiteImagesAPI(section: string, ids: string[]): Promise<void> {
  await getAxiosClient().patch("/site-images/reorder", { section, ids });
}

export async function deleteSiteImageAPI(id: string): Promise<void> {
  await getAxiosClient().delete(`/site-images/${id}`);
}

export function siteImagesErrorMessage(error: unknown, fallback: string) {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })?.response;
  const message = response?.data?.message;
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string" && message) return message;
  if (response?.status === 413) return "La imagen pesa demasiado (máximo 10 MB).";
  if (response?.status === 401 || response?.status === 403) return "Tu sesión expiró. Vuelve a iniciar sesión.";
  return fallback;
}
