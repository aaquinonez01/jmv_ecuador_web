import { getAxiosClient } from "@/config/axios.config";
import type { Member, MembersPage, MemberStatus, MemberTransactions, PointsRule } from "@/types/points";

// Miembros y Puntos JMV de la app móvil (solo administradores)

const api = () => getAxiosClient();

export async function getMembersAPI(params: { status?: MemberStatus | ""; search?: string; page?: number }) {
  const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== undefined));
  return (await api().get<MembersPage>("/points/admin/members", { params: query })).data;
}

export const reviewMemberAPI = async (id: string, body: { status: "verified" | "rejected" | "none"; level?: string; comunidadId?: string }) =>
  (await api().patch<Member>(`/points/admin/members/${id}`, body)).data;

export const getMemberTransactionsAPI = async (id: string, page = 1) =>
  (await api().get<MemberTransactions>(`/points/admin/members/${id}/transactions`, { params: { page } })).data;

export const adjustPointsAPI = async (id: string, amount: number, description: string) =>
  (await api().post<{ applied: number; member: Member }>(`/points/admin/members/${id}/adjust`, { amount, description })).data;

export interface CreateMemberPayload {
  fullName: string;
  displayName?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  birthDate?: string;
  comunidadId?: string;
  level?: string;
  verified?: boolean;
}

export const createMemberAPI = async (p: CreateMemberPayload) =>
  (await api().post<{ member: Member; password: string; generated: boolean }>("/points/admin/members", p)).data;

export const resetMemberPasswordAPI = async (id: string, password?: string) =>
  (await api().post<{ password: string; generated: boolean }>(`/points/admin/members/${id}/password`, password ? { password } : {})).data;

export const getPointsRulesAPI = async () => (await api().get<PointsRule[]>("/points/admin/rules")).data;

export const updatePointsRulesAPI = async (rules: { key: string; points: number }[]) =>
  (await api().put<PointsRule[]>("/points/admin/rules", { rules })).data;
