// Puntos JMV y miembros de la app móvil (backend: /points)

export const MEMBER_STATUS = {
  none: { label: "Sin solicitud", className: "bg-slate-100 text-slate-600" },
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-800" },
  verified: { label: "Verificado", className: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Rechazado", className: "bg-red-100 text-red-700" },
} as const;
export type MemberStatus = keyof typeof MEMBER_STATUS;

export interface Member {
  id: string;
  fullName: string;
  displayName?: string | null;
  email: string;
  profilePicture?: string | null;
  level?: "infancia" | "prejuvenil" | "juvenil" | null;
  memberStatus: MemberStatus;
  memberRequestedAt?: string | null;
  memberVerifiedAt?: string | null;
  pointsBalance: number;
  comunidad: { id: string; nombre: string; zona: string | null } | null;
}

export interface MembersPage {
  items: Member[];
  total: number;
  page: number;
  pageSize: number;
  pending: number;
}

export interface PointsTransaction {
  id: string;
  amount: number;
  reason: string;
  description: string;
  createdAt: string;
}

export interface MemberTransactions {
  member: Member;
  transactions: PointsTransaction[];
  page: number;
  hasMore: boolean;
}

export interface PointsRule {
  key: string;
  label: string;
  hint?: string | null;
  points: number;
  displayOrder: number;
}
