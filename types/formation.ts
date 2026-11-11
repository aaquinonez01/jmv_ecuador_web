// Encuentros de formación de la app (backend: /formation)

export const FORMATION_STEPS = [
  { id: "integracion", name: "1. Integración" },
  { id: "admision", name: "2. Admisión" },
  { id: "promesa", name: "3. Promesa" },
  { id: "consagracion", name: "4. Consagración Mariana" },
  { id: "desembocadura", name: "5. Desembocadura" },
] as const;
export type FormationStep = (typeof FORMATION_STEPS)[number]["id"];

export const FORMATION_PILLARS = [
  { id: "comunidad", name: "Comunidad juvenil" },
  { id: "espiritualidad", name: "Espiritualidad" },
  { id: "apostolado", name: "Apostolado" },
  { id: "formacion", name: "Formación" },
] as const;
export type FormationPillar = (typeof FORMATION_PILLARS)[number]["id"];

export interface FormationQuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface FormationEncounterPayload {
  title: string;
  summary?: string;
  step: FormationStep;
  pillar?: FormationPillar | null;
  displayOrder?: number;
  durationMinutes?: number;
  coverImageUrl?: string | null;
  contemplar: { passageRef?: string; passageText?: string; prayer?: string };
  vivir: { cards: { title?: string; body: string }[]; videoUrl?: string; documentSlug?: string };
  servir: { commitment: string };
  reflectionQuestions: string[];
  quiz: FormationQuizQuestion[];
  source?: string;
  published?: boolean;
}

export interface FormationEncounter extends FormationEncounterPayload {
  id: string;
  displayOrder: number;
  durationMinutes: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  /** Jóvenes que ya lo marcaron como vivido (solo en el listado del admin) */
  completions?: number;
}
