import { getAxiosClient } from "@/config/axios.config";
import {
  buildPostFormData,
  validatePostFiles,
  type CreatePostData,
} from "@/lib/helpers/form-data.helper";

/**
 * Crea un post (las fotos son opcionales; el backend acepta 0 a 10).
 * Se ejecuta en el navegador: usa el token guardado por getAxiosClient.
 * Lanza Error con un mensaje listo para mostrar a la persona.
 */
export async function createPost(data: CreatePostData): Promise<void> {
  const validation = validatePostFiles(data.files);
  if (!validation.isValid) throw new Error(validation.error);

  try {
    await getAxiosClient().post("/posts", buildPostFormData(data));
  } catch (error: any) {
    const status: number | undefined = error?.response?.status;
    const message = error?.response?.data?.message;

    if (!error?.response && error?.request) {
      throw new Error(
        "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo."
      );
    }
    if (status === 401 || status === 403) {
      throw new Error("Tu sesión terminó. Vuelve a iniciar sesión para publicar.");
    }
    if (status === 413) {
      throw new Error("Una o más fotos pesan demasiado (máximo 10 MB cada una).");
    }
    if (status === 400) {
      const detail = Array.isArray(message) ? message.join(". ") : message;
      throw new Error(
        detail
          ? `Revisa los datos de la publicación: ${detail}`
          : "Revisa los datos de la publicación e inténtalo de nuevo."
      );
    }
    throw new Error(
      "No pudimos publicar en este momento. Inténtalo de nuevo en unos minutos."
    );
  }
}
