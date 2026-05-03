export type TipoCargoConsejo =
  | "coordinador"
  | "vicecoordinador"
  | "secretario"
  | "tesorero"
  | "vocal";

export interface ConsejoMember {
  id: string;
  nombre: string;
  cargo: string;
  tipoCargo: TipoCargoConsejo;
  edad?: number | null;
  comunidad?: string | null;
  santoFavorito?: string | null;
  citaBiblica?: string | null;
  imageUrl?: string | null;
  descripcion?: string | null;
  email?: string | null;
  telefono?: string | null;
  fechaPosesion?: string | null;
  fechaFinCargo?: string | null;
  displayOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsejoPeriod {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string | null;
  active: boolean;
  miembros: ConsejoMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsejoMemberPayload {
  nombre: string;
  cargo: string;
  tipoCargo: TipoCargoConsejo;
  edad?: number | string | null;
  comunidad?: string | null;
  santoFavorito?: string | null;
  citaBiblica?: string | null;
  descripcion?: string | null;
  email?: string | null;
  telefono?: string | null;
  fechaPosesion?: string | null;
  fechaFinCargo?: string | null;
  displayOrder?: number | string | null;
  active?: boolean | string | null;
  image?: File | null;
}

export interface ConsejoPeriodPayload {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string | null;
  active?: boolean | string | null;
}

export type TipoAsesor = "asesor" | "asesora";

export interface Asesor {
  id: string;
  tipo: TipoAsesor;
  nombre: string;
  cargo: string;
  comunidad?: string | null;
  santoFavorito?: string | null;
  citaBiblica?: string | null;
  imageUrl?: string | null;
  descripcion?: string | null;
  email?: string | null;
  telefono?: string | null;
  fechaInicio: string;
  fechaFin: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AsesorPayload {
  tipo: TipoAsesor;
  nombre: string;
  cargo: string;
  comunidad?: string | null;
  santoFavorito?: string | null;
  citaBiblica?: string | null;
  descripcion?: string | null;
  email?: string | null;
  telefono?: string | null;
  fechaInicio: string;
  fechaFin: string;
  active?: boolean | string | null;
  image?: File | null;
}

export type TipoAnnouncement =
  | "nuevo_consejo"
  | "nuevo_asesor"
  | "nueva_vocalia"
  | "general";

export interface HomeAnnouncement {
  id: string;
  titulo: string;
  subtitulo?: string | null;
  mensaje: string;
  tipo: TipoAnnouncement;
  imageUrl?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  fechaPublicacion: string;
  fechaExpiracion?: string | null;
  displayOrder: number;
  featuredInHome: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeAnnouncementPayload {
  titulo: string;
  subtitulo?: string | null;
  mensaje: string;
  tipo?: TipoAnnouncement | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  fechaPublicacion?: string | null;
  fechaExpiracion?: string | null;
  displayOrder?: number | string | null;
  featuredInHome?: boolean | string | null;
  active?: boolean | string | null;
  image?: File | null;
}
