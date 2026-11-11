// Gira y Aprende (juego de la app móvil; backend: /game)

export const GAME_CATEGORIES = [
  { id: "biblia", name: "Biblia", color: "#b3262a" },
  { id: "maria", name: "María", color: "#1D4E8A" },
  { id: "vicenciana", name: "Familia Vicenciana", color: "#c47f00" },
  { id: "historia_jmv", name: "Historia de JMV", color: "#0e7c86" },
  { id: "iglesia", name: "Iglesia y Catecismo", color: "#5b3f9a" },
  { id: "santos_mision", name: "Santos y Misión", color: "#2f7d32" },
] as const;
export type GameCategory = (typeof GAME_CATEGORIES)[number]["id"];

export const QUESTION_STATUS = {
  approved: { label: "Aprobada", className: "bg-emerald-100 text-emerald-800" },
  pending: { label: "Por revisar", className: "bg-amber-100 text-amber-800" },
  rejected: { label: "Rechazada", className: "bg-red-100 text-red-700" },
} as const;
export type QuestionStatus = keyof typeof QUESTION_STATUS;

export const DIFFICULTIES = [
  { id: "1", name: "Fácil" },
  { id: "2", name: "Media" },
  { id: "3", name: "Difícil" },
];

export interface GameQuestionPayload {
  category: GameCategory;
  levels: ("infancia" | "prejuvenil" | "juvenil")[];
  difficulty: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  source?: string;
  status?: QuestionStatus;
}

export interface GameQuestion extends Omit<GameQuestionPayload, "explanation" | "source"> {
  id: string;
  explanation: string | null;
  source: string | null;
  status: QuestionStatus;
  proposedBy: string | null;
  updatedAt: string;
}

export interface GameQuestionsPage {
  items: GameQuestion[];
  total: number;
  page: number;
  pageSize: number;
  counts: { category: GameCategory; status: QuestionStatus; n: number }[];
}
