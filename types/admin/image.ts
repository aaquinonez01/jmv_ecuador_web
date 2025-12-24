/**
 * Tipos para la gestión de imágenes en el panel administrativo
 */

export enum ImageSection {
  // FASE 1 - PRIORITARIAS
  HERO_BACKGROUNDS = "hero_backgrounds",
  GALERIA_ACTIVIDADES = "galeria_actividades",
  PROXIMAS_ACTIVIDADES = "proximas_actividades",
  PILARES_APOSTOLADO = "pilares_apostolado",
  PILARES_ESPIRITUALIDAD = "pilares_espiritualidad",
  PILARES_COMUNIDAD = "pilares_comunidad",
  PILARES_FORMACION = "pilares_formacion",

  // FASE 2 - FUTURAS (para expansión)
  // TESTIMONIOS = "testimonios",
  // HISTORIA_TIMELINE = "historia_timeline",
  // CONSEJO_NACIONAL = "consejo_nacional",
  // SANTOS_CARISMA = "santos_carisma",
  // ALIANZAS = "alianzas",
  // ACTIVIDADES_DETALLADAS = "actividades_detalladas",
}

export interface ImageMetadata {
  size: number; // tamaño en bytes
  width: number; // ancho en píxeles
  height: number; // alto en píxeles
  format: string; // jpg, png, webp
  uploadedAt: string; // ISO date string
  uploadedBy: string; // nombre del usuario admin
  groupId?: string;
}

export interface EventData {
  date?: string;
  location?: string;
  status?: string;
}

export interface PersonData {
  name?: string;
  role?: string;
  zone?: string;
}

export interface AdminImage {
  id: string;
  section: ImageSection | string;
  subsection?: string;
  filename: string;
  url: string; // URL de la imagen (puede ser base64 temporal o ruta)
  alt: string;
  title?: string;
  description?: string;
  orden: number;
  activo: boolean;
  metadata: ImageMetadata;
  // Campos específicos por tipo
  eventData?: EventData;
  personData?: PersonData;
}

export interface AdminImageFormData {
  section: string;
  subsection?: string;
  file: File;
  alt: string;
  title?: string;
  description?: string;
  eventData?: EventData;
  personData?: PersonData;
  groupId?: string;
}

export interface AdminImageUpdateData {
  alt?: string;
  title?: string;
  description?: string;
  orden?: number;
  activo?: boolean;
  section?: string;
  subsection?: string;
  eventData?: EventData;
  personData?: PersonData;
}
