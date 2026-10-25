import { ssrFetch } from "@/lib/helpers/apiBase";
import type { LibraryCollection, LibraryDocument } from "@/types/library";

// El backend invalida este tag al crear, editar o borrar en el admin.
export const LIBRARY_TAG = "library";

async function getJson<T>(path: string): Promise<T | null> {
  const res = await ssrFetch(path, { revalidate: 1800, tags: [LIBRARY_TAG] });
  if (!res) return null;
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Documentos publicados (incluye los de solo miembros, sin su archivo) */
export async function fetchLibraryDocuments(): Promise<LibraryDocument[]> {
  const data = await getJson<{ items?: LibraryDocument[] }>("/library/documents/public");
  return data?.items ?? [];
}

export function fetchLibraryDocument(slug: string) {
  return getJson<LibraryDocument>(`/library/documents/public/${encodeURIComponent(slug)}`);
}

/** Rutas de formación publicadas, con sus documentos publicados en orden */
export async function fetchLibraryCollections(): Promise<LibraryCollection[]> {
  const data = await getJson<{ items?: LibraryCollection[] }>("/library/collections/public");
  return data?.items ?? [];
}

export function fetchLibraryCollection(slug: string) {
  return getJson<LibraryCollection>(`/library/collections/public/${encodeURIComponent(slug)}`);
}
