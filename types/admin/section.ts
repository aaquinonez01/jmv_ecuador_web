/**
 * Tipos para las secciones de imágenes
 */

import { ImageSection } from "./image";

export interface Subsection {
  id: string;
  name: string;
  imageCount: number;
}

export interface Section {
  id: ImageSection | string;
  name: string;
  description: string;
  icon: string; // emoji o nombre de icono
  totalImages: number;
  maxImages?: number; // límite máximo de imágenes (opcional)
  hasSubsections: boolean;
  subsections?: Subsection[];
  uploadedImages?: number; // cantidad de imágenes ya subidas
}

export interface SectionStats {
  total: number;
  uploaded: number;
  pending: number;
  percentage: number;
}
