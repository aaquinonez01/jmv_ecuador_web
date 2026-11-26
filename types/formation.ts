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

export const SONG_CATEGORIES = ["Entrada", "Ofertorio", "Comunión", "Salida", "Partes de la misa", "Marianos", "Vicencianos", "Adoración", "Alabanza", "Espíritu Santo", "Animación", "Vía crucis", "Villancicos", "Juveniles"] as const;
export type SongCategory = (typeof SONG_CATEGORIES)[number];

export interface SongPayload {
  title: string;
  author?: string;
  category: SongCategory;
  /** Letra; los acordes van entre corchetes: [Do]Santo */
  lyrics: string;
  songKey?: string;
  videoUrl?: string;
  displayOrder?: number;
  published?: boolean;
}

export interface Song extends Omit<SongPayload, "author" | "songKey" | "videoUrl"> {
  id: string;
  author?: string | null;
  songKey?: string | null;
  videoUrl?: string | null;
  displayOrder: number;
  published: boolean;
}

/** Cómo se guía una enseñanza con "Hazlo ahora" en la app */
export const TEACHING_GUIDES = [
  { id: "pasos", name: "Paso a paso (un paso por pantalla)" },
  { id: "rosario", name: "Rosario guiado (misterios y cuenta de avemarías)" },
  { id: "none", name: "Solo lectura (sin Hazlo ahora)" },
] as const;
export type TeachingGuide = (typeof TEACHING_GUIDES)[number]["id"];

export interface TeachingStep {
  title: string;
  text: string;
}

export interface TeachingPayload {
  title: string;
  summary: string;
  needs: string[];
  steps: TeachingStep[];
  groupSteps: TeachingStep[];
  source?: string;
  guide: TeachingGuide;
  icon?: string;
  displayOrder?: number;
  published?: boolean;
}

export interface Teaching extends Omit<TeachingPayload, "source" | "icon"> {
  id: string;
  source?: string | null;
  icon?: string | null;
  displayOrder: number;
  published: boolean;
}

/** Los cinco ejes formativos, a los que pertenece cada tema */
export const THEME_AXES = [
  { id: "humano", name: "Humano" },
  { id: "cristocentrico", name: "Cristocéntrico" },
  { id: "mariano", name: "Mariano" },
  { id: "vicenciano", name: "Vicenciano" },
  { id: "eclesial", name: "Eclesial" },
] as const;
export type ThemeAxis = (typeof THEME_AXES)[number]["id"];

/** De dónde viene una cita de "Quiero profundizar en…" */
export const QUOTE_KINDS = [
  { id: "biblia", name: "La Biblia" },
  { id: "iglesia", name: "La Iglesia (Catecismo, papas)" },
  { id: "padres", name: "Padres de la Iglesia y santos" },
  { id: "vicenciana", name: "Familia Vicenciana" },
  { id: "profesional", name: "Profesionales (psicología de inspiración católica)" },
  { id: "otro", name: "Otra fuente" },
] as const;
export type QuoteKind = (typeof QUOTE_KINDS)[number]["id"];

/** Categorías de Gira y Aprende (las del servidor) */
export const GAME_CATEGORY_NAMES: Record<string, string> = {
  biblia: "Biblia",
  maria: "María",
  vicenciana: "Familia Vicenciana",
  historia_jmv: "Historia de JMV",
  iglesia: "Iglesia",
  santos_mision: "Santos y misión",
};

export interface ThemeQuote {
  kind: QuoteKind;
  text: string;
  reference: string;
}

export interface ThemePayload {
  slug: string;
  name: string;
  axis: ThemeAxis;
  gameCategory?: string;
  summary?: string;
  quotes: ThemeQuote[];
  displayOrder?: number;
  published?: boolean;
}

export interface Theme extends Omit<ThemePayload, "gameCategory" | "summary"> {
  id: string;
  gameCategory?: string | null;
  summary?: string | null;
  displayOrder: number;
  published: boolean;
}

/** "¿Cómo estás hoy?": estado de ánimo con su palabra */
export interface MoodPayload {
  name: string;
  icon?: string;
  word: string;
  reference: string;
  prayer?: string;
  displayOrder?: number;
  published?: boolean;
}

export interface Mood extends Omit<MoodPayload, "icon" | "prayer"> {
  id: string;
  icon?: string | null;
  prayer?: string | null;
  displayOrder: number;
  published: boolean;
}
