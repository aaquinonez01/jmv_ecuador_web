import { getAxiosClient } from "@/config/axios.config";
import type {
  LibraryAxis,
  LibraryCollection,
  LibraryDocument,
  LibraryKind,
  LibraryStage,
  LibraryType,
  LibraryVisibility,
} from "@/types/library";

/** Límite del backend para el PDF */
export const LIBRARY_MAX_FILE_BYTES = 50 * 1024 * 1024;

export interface LibraryDocumentPayload {
  slug?: string;
  title: string;
  author?: string;
  summary: string;
  description?: string;
  kind: LibraryKind;
  type: LibraryType;
  /** "" o null quita el eje */
  axis?: LibraryAxis | "" | null;
  stage: LibraryStage;
  tags?: string[];
  visibility: LibraryVisibility;
  externalUrl?: string;
  pageCount?: number | null;
  readingMinutes?: number | null;
  featured?: boolean;
  published?: boolean;
  displayOrder?: number | null;
  file?: File | Blob | null;
  cover?: File | Blob | null;
  removeFile?: boolean;
  removeCover?: boolean;
}

export interface LibraryCollectionPayload {
  slug?: string;
  title: string;
  description?: string;
  published?: boolean;
  displayOrder?: number | null;
  documentIds: string[];
  cover?: File | Blob | null;
  removeCover?: boolean;
}

/** 0-100; solo cuenta la subida (la respuesta del servidor es inmediata) */
export type UploadProgress = (percent: number) => void;

// Igual que en calendar-dates: "" se convierte en null en el backend para que
// un campo opcional que se vacía se borre de verdad.
function append(formData: FormData, key: string, value: unknown) {
  if (value === undefined) return;
  if (Array.isArray(value)) {
    formData.append(key, JSON.stringify(value));
    return;
  }
  formData.append(key, value === null ? "" : String(value));
}

function fileName(blob: File | Blob, fallback: string) {
  return blob instanceof File ? blob.name : fallback;
}

function buildDocumentFormData(payload: Partial<LibraryDocumentPayload>) {
  const formData = new FormData();
  const { file, cover, removeFile, removeCover, ...fields } = payload;
  for (const [key, value] of Object.entries(fields)) append(formData, key, value);
  if (file) formData.append("file", file, fileName(file, "documento.pdf"));
  if (cover) formData.append("cover", cover, fileName(cover, "portada.jpg"));
  if (removeFile) formData.append("removeFile", "true");
  if (removeCover) formData.append("removeCover", "true");
  return formData;
}

// Sin portada nueva se envía JSON (documentIds llega como arreglo real);
// con portada, multipart con documentIds en JSON.
function buildCollectionBody(payload: Partial<LibraryCollectionPayload>) {
  if (!payload.cover) {
    const { cover: _cover, removeCover, ...fields } = payload;
    return removeCover ? { ...fields, removeCover: true } : fields;
  }
  const formData = new FormData();
  const { cover, removeCover, ...fields } = payload;
  for (const [key, value] of Object.entries(fields)) append(formData, key, value);
  if (cover) formData.append("cover", cover, fileName(cover, "portada.jpg"));
  if (removeCover) formData.append("removeCover", "true");
  return formData;
}

function progressHandler(onProgress?: UploadProgress) {
  if (!onProgress) return undefined;
  return (event: { loaded: number; total?: number }) => {
    if (event.total) onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
  };
}

// ---------- Documentos ----------

export async function getLibraryDocumentsAPI(): Promise<{ items: LibraryDocument[] }> {
  const api = getAxiosClient();
  const { data } = await api.get("/library/documents");
  return Array.isArray(data) ? { items: data } : (data as { items: LibraryDocument[] });
}

export async function createLibraryDocumentAPI(
  payload: LibraryDocumentPayload,
  onProgress?: UploadProgress
): Promise<LibraryDocument> {
  const api = getAxiosClient();
  const { data } = await api.post("/library/documents", buildDocumentFormData(payload), {
    onUploadProgress: progressHandler(onProgress),
  });
  return data as LibraryDocument;
}

export async function updateLibraryDocumentAPI(
  id: string,
  payload: Partial<LibraryDocumentPayload>,
  onProgress?: UploadProgress
): Promise<LibraryDocument> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/library/documents/${id}`, buildDocumentFormData(payload), {
    onUploadProgress: progressHandler(onProgress),
  });
  return data as LibraryDocument;
}

export async function deleteLibraryDocumentAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/library/documents/${id}`);
  return data as { message: string };
}

/** Descarga el PDF con el token del admin (sirve también para los de solo miembros) */
export async function fetchLibraryFileAPI(id: string): Promise<ArrayBuffer> {
  const api = getAxiosClient();
  const { data } = await api.get(`/library/documents/${id}/file`, { responseType: "arraybuffer" });
  return data as ArrayBuffer;
}

// ---------- Rutas de formación ----------

export async function getLibraryCollectionsAPI(): Promise<{ items: LibraryCollection[] }> {
  const api = getAxiosClient();
  const { data } = await api.get("/library/collections");
  return Array.isArray(data) ? { items: data } : (data as { items: LibraryCollection[] });
}

export async function createLibraryCollectionAPI(
  payload: LibraryCollectionPayload
): Promise<LibraryCollection> {
  const api = getAxiosClient();
  const { data } = await api.post("/library/collections", buildCollectionBody(payload));
  return data as LibraryCollection;
}

export async function updateLibraryCollectionAPI(
  id: string,
  payload: Partial<LibraryCollectionPayload>
): Promise<LibraryCollection> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/library/collections/${id}`, buildCollectionBody(payload));
  return data as LibraryCollection;
}

export async function deleteLibraryCollectionAPI(id: string) {
  const api = getAxiosClient();
  const { data } = await api.delete(`/library/collections/${id}`);
  return data as { message: string };
}

/** Mensaje claro para el admin a partir del error de axios */
export function libraryErrorMessage(error: unknown, fallback: string) {
  const err = error as {
    code?: string;
    message?: string;
    response?: { status?: number; data?: { message?: unknown } };
  };
  if (!err?.response) {
    if (err?.code === "ERR_NETWORK" || (typeof navigator !== "undefined" && !navigator.onLine)) {
      return "Sin conexión con el servidor. Revisa tu internet e inténtalo de nuevo.";
    }
    return fallback;
  }
  const status = err.response.status;
  if (status === 413) return "El archivo es muy grande. El máximo es 50 MB.";
  if (status === 401 || status === 403) return "Tu sesión expiró. Vuelve a iniciar sesión.";
  const message = err.response.data?.message;
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string" && message) return message;
  return fallback;
}
