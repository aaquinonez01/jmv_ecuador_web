// Biblioteca JMV: libros, documentos y guías de formación subidos desde el admin.

/** pdf: archivo subido al servidor; enlace: página web o Drive; video: YouTube u otro */
export type LibraryKind = "pdf" | "enlace" | "video";

export type LibraryType = "libro" | "documento" | "guia" | "oracion" | "otro";

/** Los cinco ejes de /formacion/ejes */
export type LibraryAxis = "humano" | "cristocentrico" | "mariano" | "vicenciano" | "eclesial";

export type LibraryStage = "aspirante" | "promesa" | "consagrado" | "animador" | "todos";

/** publico: cualquiera; miembros: hay que iniciar sesión para abrir el archivo */
export type LibraryVisibility = "publico" | "miembros";

export interface LibraryDocument {
  id: string;
  slug: string;
  title: string;
  author?: string | null;
  /** 1-2 frases para la tarjeta */
  summary: string;
  description?: string | null;
  kind: LibraryKind;
  type: LibraryType;
  axis?: LibraryAxis | null;
  stage: LibraryStage;
  tags: string[];
  visibility: LibraryVisibility;
  /** Portada (Cloudinary). Para PDFs el admin la genera de la primera página */
  coverUrl?: string | null;
  /** Para kind "enlace" y "video" */
  externalUrl?: string | null;
  /** Para kind "pdf": URL pública del archivo en la API (GET /library/documents/:id/file) */
  fileUrl?: string | null;
  fileSize?: number | null;
  pageCount?: number | null;
  readingMinutes?: number | null;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  views: number;
  downloads: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Ruta de formación: lecturas en orden */
export interface LibraryCollection {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  published: boolean;
  displayOrder: number;
  /** Ordenados por posición */
  documents: LibraryDocument[];
  createdAt?: string;
  updatedAt?: string;
}
