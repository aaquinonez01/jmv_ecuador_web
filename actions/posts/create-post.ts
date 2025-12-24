import { getAxiosClient } from "@/config/axios.config";
import {
  buildPostFormData,
  validatePostFiles,
  type CreatePostData,
} from "@/lib/helpers/form-data.helper";

export interface CreatePostResponse {
  id: string;
  title?: string;
  content: string;
  typePost: string;
  createdAt: string;
  updatedAt: string;
  images: Array<{ id: string; url: string }>;
  scope?: { id: string; name: string };
  activityType?: { id: string; name: string };
  subtype?: { id: string; name: string };
  user: {
    id: string;
    fullName: string;
    email: string;
    profilePicture?: string | null;
    role: string;
  };
}

/**
 * Crea un nuevo post con imágenes
 * @param data - Datos del post incluyendo archivos
 * @returns Post creado con toda la información
 */
export async function createPost(
  data: CreatePostData
): Promise<CreatePostResponse> {
  try {
    // Validar archivos antes de enviar
    const validation = validatePostFiles(data.files);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Construir FormData
    const formData = buildPostFormData(data);

    // Hacer request al backend
    const api = getAxiosClient();
    const response = await api.post<CreatePostResponse>("/posts", formData);

    return response.data;
  } catch (error: any) {
    console.error("Error creating post:", error);

    // Manejar errores específicos
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      if (status === 401) {
        throw new Error("Debes iniciar sesión para crear publicaciones");
      }

      if (status === 400) {
        throw new Error(message || "Datos inválidos. Verifica el formulario");
      }

      if (status === 413) {
        throw new Error("Uno o más archivos son demasiado grandes (máx 10MB)");
      }

      if (status === 500) {
        throw new Error(
          "Error del servidor al crear la publicación. Intenta nuevamente"
        );
      }

      throw new Error(
        message || `Error al crear la publicación (${status})`
      );
    }

    // Error de red o timeout
    if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión"
      );
    }

    // Otro tipo de error
    throw new Error(
      error.message || "Error desconocido al crear la publicación"
    );
  }
}
