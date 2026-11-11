import { getAxiosClient } from "@/config/axios.config";
import type { GameQuestion, GameQuestionPayload, GameQuestionsPage, QuestionStatus } from "@/types/game";

// Banco de preguntas de Gira y Aprende (solo administradores)

const api = () => getAxiosClient();

export async function getGameQuestionsAPI(params: { category?: string; status?: string; search?: string; page?: number }) {
  const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== undefined));
  return (await api().get<GameQuestionsPage>("/game/admin/questions", { params: query })).data;
}

export const createGameQuestionAPI = async (p: GameQuestionPayload) =>
  (await api().post<GameQuestion>("/game/admin/questions", p)).data;

export const updateGameQuestionAPI = async (id: string, p: GameQuestionPayload) =>
  (await api().put<GameQuestion>(`/game/admin/questions/${id}`, p)).data;

export const setGameQuestionStatusAPI = async (id: string, status: QuestionStatus) =>
  (await api().patch(`/game/admin/questions/${id}/status`, { status })).data;

export const deleteGameQuestionAPI = async (id: string) => {
  await api().delete(`/game/admin/questions/${id}`);
};
