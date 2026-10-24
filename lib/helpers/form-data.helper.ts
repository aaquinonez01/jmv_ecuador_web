/**
 * Helper para construir FormData para crear posts
 * Maneja la conversión de datos del formulario y archivos a formato multipart/form-data
 */

export interface CreatePostData {
  content: string;
  title: string;
  scope: string;
  activityType: string;
  subtype?: string;
  typePost: "moments" | "documents";
  files: File[];
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Valida las fotos antes de enviarlas (son opcionales: 0 a 10)
 */
export function validatePostFiles(files: File[]): {
  isValid: boolean;
  error?: string;
} {
  if (files.length > 10) {
    return { isValid: false, error: "Puedes subir hasta 10 fotos por publicación." };
  }

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `«${file.name}» no es una foto válida (usa JPG, PNG, WebP o GIF).`,
      };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: `«${file.name}» pesa más de 10 MB.` };
    }
  }

  return { isValid: true };
}

/**
 * Construye un FormData para enviar al backend
 */
export function buildPostFormData(data: CreatePostData): FormData {
  const formData = new FormData();

  formData.append("content", data.content);
  formData.append("title", data.title);
  formData.append("scope", data.scope);
  formData.append("activityType", data.activityType);
  if (data.subtype) formData.append("subtype", data.subtype);
  formData.append("typePost", data.typePost);

  // El backend espera el campo 'images' con múltiples archivos
  data.files.forEach((file) => formData.append("images", file));

  return formData;
}
