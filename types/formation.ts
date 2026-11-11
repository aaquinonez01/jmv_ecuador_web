// Formación de la app móvil (backend: /formation)

export const FORMATION_AXES = [
  { id: "humano", name: "Eje humano", color: "#0e7c86" },
  { id: "cristocentrico", name: "Eje cristocéntrico", color: "#b3262a" },
  { id: "mariano", name: "Eje mariano", color: "#1D4E8A" },
  { id: "vicenciano", name: "Eje vicenciano", color: "#c47f00" },
  { id: "eclesial", name: "Eje eclesial", color: "#5b3f9a" },
] as const;
export type FormationAxis = (typeof FORMATION_AXES)[number]["id"];

// Secciones por edad (Estatutos, Art. 8)
export const FORMATION_LEVELS = [
  { id: "infancia", name: "Infancia Misionera", ages: "9 a 11 años" },
  { id: "prejuvenil", name: "Prejuveniles", ages: "12 a 15 años" },
  { id: "juvenil", name: "Jóvenes", ages: "16 a 35 años" },
] as const;
export type FormationLevel = (typeof FORMATION_LEVELS)[number]["id"];

export const REFERENCE_TYPES = [
  { id: "biblica", name: "Cita bíblica" },
  { id: "libro", name: "Libro" },
  { id: "documento", name: "Encíclica o documento" },
  { id: "otro", name: "Otro" },
] as const;
export type ReferenceType = (typeof REFERENCE_TYPES)[number]["id"];

export interface TopicReference {
  type: ReferenceType;
  title: string;
  detail?: string;
  url?: string;
}

export interface FormationTopicPayload {
  title: string;
  summary?: string;
  axis: FormationAxis;
  levels: FormationLevel[];
  subtopics: string[];
  references: TopicReference[];
  displayOrder?: number;
  published?: boolean;
}

export interface FormationTopic extends FormationTopicPayload {
  id: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const MATERIAL_TYPES = [
  { id: "diapositivas", name: "Diapositivas" },
  { id: "pdf", name: "PDF / documento" },
  { id: "video", name: "Video o grabación" },
  { id: "enlace", name: "Enlace" },
] as const;
export type MaterialType = (typeof MATERIAL_TYPES)[number]["id"];

export interface TrainingMaterial {
  title: string;
  type: MaterialType;
  url?: string;
  /** PDF subido al servidor */
  fileName?: string;
}

export interface NationalTrainingPayload {
  title: string;
  speaker?: string;
  startsAt: string;
  description?: string;
  meetingUrl?: string;
  recordingUrl?: string;
  materials: TrainingMaterial[];
  published?: boolean;
}

export interface NationalTraining extends NationalTrainingPayload {
  id: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PRAYER_CATEGORIES = ["JMV", "Marianas", "Vicencianas", "Misioneras", "Para el día"] as const;
export type PrayerCategory = (typeof PRAYER_CATEGORIES)[number];

export interface PrayerPayload {
  title: string;
  category: PrayerCategory;
  text: string;
  source?: string;
  displayOrder?: number;
  published?: boolean;
}

export interface Prayer extends PrayerPayload {
  id: string;
  displayOrder: number;
  published: boolean;
}
