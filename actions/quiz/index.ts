import { getAxiosClient } from "@/config/axios.config";
import type {
  CreateQuizSessionPayload,
  QuizPayload,
  QuizSessionDetail,
  QuizSessionSnapshot,
  QuizSessionStatus,
  QuizSessionSummary,
  QuizTemplate,
} from "@/types/quiz-management";

interface SessionFilters {
  status?: QuizSessionStatus;
  quizId?: string;
  limit?: number;
  offset?: number;
}

export async function createQuizAPI(payload: QuizPayload): Promise<QuizTemplate> {
  const api = getAxiosClient();
  const { data } = await api.post("/quizzes", payload);
  return data as QuizTemplate;
}

export async function getQuizzesAPI(): Promise<QuizTemplate[]> {
  const api = getAxiosClient();
  const { data } = await api.get("/quizzes");
  return data as QuizTemplate[];
}

export async function getQuizByIdAPI(id: string): Promise<QuizTemplate> {
  const api = getAxiosClient();
  const { data } = await api.get(`/quizzes/${id}`);
  return data as QuizTemplate;
}

export async function updateQuizAPI(
  id: string,
  payload: Partial<QuizPayload>
): Promise<QuizTemplate> {
  const api = getAxiosClient();
  const { data } = await api.patch(`/quizzes/${id}`, payload);
  return data as QuizTemplate;
}

export async function deactivateQuizAPI(
  id: string
): Promise<{ message: string }> {
  const api = getAxiosClient();
  const { data } = await api.delete(`/quizzes/${id}`);
  return data as { message: string };
}

export async function createQuizSessionAPI(
  quizId: string,
  payload: CreateQuizSessionPayload = {}
): Promise<QuizSessionSummary> {
  const api = getAxiosClient();
  const { data } = await api.post(`/quizzes/${quizId}/sessions`, payload);
  return data as QuizSessionSummary;
}

export async function startQuizSessionAPI(
  sessionId: string
): Promise<QuizSessionSummary> {
  const api = getAxiosClient();
  const { data } = await api.post(`/quiz-sessions/${sessionId}/start`);
  return data as QuizSessionSummary;
}

export async function cancelQuizSessionAPI(
  sessionId: string
): Promise<QuizSessionSummary> {
  const api = getAxiosClient();
  const { data } = await api.post(`/quiz-sessions/${sessionId}/cancel`);
  return data as QuizSessionSummary;
}

export async function deleteQuizSessionAPI(
  sessionId: string
): Promise<{ message: string; id: string }> {
  const api = getAxiosClient();
  const { data } = await api.delete(`/quiz-sessions/${sessionId}`);
  return data as { message: string; id: string };
}

export async function getQuizSessionsAPI(filters: SessionFilters = {}): Promise<{
  total: number;
  items: QuizSessionSummary[];
}> {
  const api = getAxiosClient();
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.quizId) params.set("quizId", filters.quizId);
  if (typeof filters.limit === "number") params.set("limit", String(filters.limit));
  if (typeof filters.offset === "number")
    params.set("offset", String(filters.offset));

  const query = params.toString();
  const { data } = await api.get(`/quiz-sessions${query ? `?${query}` : ""}`);
  return data as { total: number; items: QuizSessionSummary[] };
}

export async function getQuizSessionDetailAPI(
  sessionId: string
): Promise<QuizSessionDetail> {
  const api = getAxiosClient();
  const { data } = await api.get(`/quiz-sessions/${sessionId}`);
  return data as QuizSessionDetail;
}

export async function getQuizSessionStateAPI(
  sessionId: string
): Promise<QuizSessionSnapshot> {
  const api = getAxiosClient();
  const { data } = await api.get(`/quiz-sessions/${sessionId}/state`);
  return data as QuizSessionSnapshot;
}
