/**
 * Helper para construir FormData para crear posts
 * Maneja la conversión de datos del formulario y archivos a formato multipart/form-data
 */

export interface CreatePostData {
  content: string;
  title?: string;
  scope: string;
  activityType: string;
  subtype?: string;
  typePost: "moments" | "documents";
  files: File[];
}

/**
 * Valida los archivos antes de enviarlos
 * @param files - Array de archivos a validar
 * @returns Objeto con validación y mensaje de error si aplica
 */
export function validatePostFiles(files: File[]): {
  isValid: boolean;
  error?: string;
} {
  // Validar cantidad de archivos
  if (files.length === 0) {
    return { isValid: false, error: "Debes seleccionar al menos una imagen" };
  }

  if (files.length > 10) {
    return {
      isValid: false,
      error: "Máximo 10 archivos permitidos. Por favor reduce la cantidad.",
    };
  }

  // Tipos MIME permitidos (solo imágenes)
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  // Tamaño máximo por archivo: 10MB
  const maxFileSize = 10 * 1024 * 1024; // 10MB en bytes

  // Validar cada archivo
  for (const file of files) {
    // Validar tipo
    if (!allowedMimeTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `El archivo "${file.name}" no es una imagen válida. Solo se permiten: JPEG, PNG, WebP, GIF`,
      };
    }

    // Validar tamaño
    if (file.size > maxFileSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        isValid: false,
        error: `El archivo "${file.name}" (${sizeMB}MB) excede el límite de 10MB`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Construye un FormData para enviar al backend
 * @param data - Datos del post incluyendo archivos
 * @returns FormData listo para enviar
 */
export function buildPostFormData(data: CreatePostData): FormData {
  const formData = new FormData();

  // Agregar campos de texto
  formData.append("content", data.content);

  if (data.title) {
    formData.append("title", data.title);
  }

  formData.append("scope", data.scope);
  formData.append("activityType", data.activityType);

  if (data.subtype) {
    formData.append("subtype", data.subtype);
  }

  formData.append("typePost", data.typePost);

  // Agregar archivos
  // El backend espera el campo 'images' con múltiples archivos
  data.files.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
}

/**
 * Formatea el tamaño de un archivo para mostrarlo al usuario
 * @param bytes - Tamaño en bytes
 * @returns String formateado (ej: "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
