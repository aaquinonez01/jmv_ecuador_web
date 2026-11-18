// Fiestas del Año Vicenciano en la web (novena / triduo / día)

import type { FiestaSymbolInfo } from "./symbol";

export type DayState = "locked" | "open" | "soon";
export type FiestaMode = "novena" | "triduo" | "dia";
export type Reaction = "pray" | "heart" | "fire";
export type PhotoStatus = "pending" | "approved" | "rejected";

export interface FiestaDaySummary {
  dayNumber: number;
  label: string;
  date: string;
  piece: string;
  /** Símbolo por capas: nombre e imagen de lo que se gana este día */
  pieceName?: string | null;
  layerImage?: string | null;
  state: DayState;
  isToday: boolean;
  title: string | null;
  questionCount: number;
  hasPurpose: boolean;
}

export interface FiestaPublic {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  intro: string | null;
  feastDate: string;
  /** Qué se arma al completar los días (si falta, es la Medalla) */
  symbol?: FiestaSymbolInfo | null;
  today: string;
  participants: number;
  comunidades: number;
  days: FiestaDaySummary[];
}

export interface FiestaDayContent {
  dailyPrayers: string | null;
  dayNumber: number;
  label: string;
  date: string;
  isToday: boolean;
  title: string;
  piece: string;
  pieceName?: string | null;
  theme: string | null;
  prayer: string | null;
  purpose: string | null;
  source: string | null;
  questions: { id: string; prompt: string; options: string[] }[];
}

export interface DayResult {
  answered: boolean;
  correct?: number;
  total?: number;
  points?: number;
  onTime?: boolean;
  purposeDone: boolean;
  questions?: {
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string | null;
    yours: number | null;
  }[];
}

export interface FiestaMe {
  user: { id: string; name: string; isLead: boolean; isAdmin?: boolean };
  comunidad: { id: string; nombre: string } | null;
  mode: FiestaMode | null;
  totalPoints: number;
  days: {
    dayNumber: number;
    answered: boolean;
    correct: number;
    total: number;
    purposeDone: boolean;
    points: number;
  }[];
}

export interface FiestaRanking {
  muralBonus: number;
  people: { name: string; comunidad: string | null; points: number; days: number }[];
  comunidades: {
    id: string;
    nombre: string;
    zona: string | null;
    participants: number;
    average: number;
    muralDays: number;
    score: number;
  }[];
}

export interface FiestaPhoto {
  id: string;
  url: string;
  caption: string | null;
  createdAt: string;
  dayNumber: number;
  label: string;
  comunidad: string;
  reactions: Partial<Record<Reaction, number>>;
}

export interface MyCommunity {
  comunidad: { id: string; nombre: string } | null;
  isLead?: boolean;
  mode?: FiestaMode | null;
  perDay?: { dayNumber: number; participants: number }[];
  photos?: { id: string; url: string; caption: string | null; status: PhotoStatus; dayNumber: number }[];
  maxPhotosPerDay?: number;
  /** El admin activó subir fotos antes de que empiecen los días */
  earlyPhotos?: boolean;
  /** Cuándo puede subir fotos esta comunidad */
  upload?: {
    usesModes: boolean;
    /** Días de su modalidad */
    allowed: number[];
    /** Días a los que se puede subir ahora mismo */
    open: number[];
    /** Horario diario (hora de Ecuador), si lo hay */
    hours: { from: number; to: number } | null;
    /** Permiso especial del administrador, hasta esta hora */
    specialUntil: string | null;
    /** Por qué ahora no se puede subir */
    notice: string | null;
  };
}

/** 20 → "8 de la noche", 24 → "12 de la noche" */
export function hourLabel(h: number): string {
  if (h === 0 || h === 24) return "12 de la noche";
  if (h === 12) return "12 del día";
  if (h < 12) return `${h} de la mañana`;
  return h < 19 ? `${h - 12} de la tarde` : `${h - 12} de la noche`;
}

export const MODES: { id: FiestaMode; label: string; hint: string }[] = [
  { id: "novena", label: "Novena", hint: "Nueve días de oración" },
  { id: "triduo", label: "Triduo", hint: "Los tres días antes" },
  { id: "dia", label: "Solo el día", hint: "Celebramos la fiesta" },
];

export const REACTIONS: { id: Reaction; emoji: string; label: string }[] = [
  { id: "pray", emoji: "🙏", label: "Oramos contigo" },
  { id: "heart", emoji: "💙", label: "Nos encanta" },
  { id: "fire", emoji: "🔥", label: "¡Qué fuego!" },
];
