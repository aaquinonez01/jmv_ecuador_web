"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
  cancelQuizSessionAPI,
  createQuizAPI,
  createQuizSessionAPI,
  deleteQuizSessionAPI,
  deactivateQuizAPI,
  getQuizSessionDetailAPI,
  getQuizSessionsAPI,
  getQuizzesAPI,
  updateQuizAPI,
} from "@/actions/quiz";
import { getToken } from "@/lib/auth/token";
import { useToast } from "@/lib/hooks/useToast";
import Button from "@/components/admin/ui/Button";
import InputField from "@/components/admin/ui/InputField";
import Modal from "@/components/admin/ui/Modal";
import PageHeader from "@/components/admin/layout/PageHeader";
import type {
  PresenceUpdatedEvent,
  QuestionClosedEvent,
  QuestionStartedEvent,
  QuizPayload,
  QuizSessionDetail,
  QuizSessionSnapshot,
  QuizSessionStatus,
  QuizSessionSummary,
  QuizTemplate,
  SessionFinishedEvent,
} from "@/types/quiz-management";
import {
  Ban,
  Brain,
  CircleDot,
  HelpCircle,
  Pencil,
  Plus,
  Radio,
  RefreshCcw,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";

type AdminTab = "bank" | "live";

interface QuestionForm {
  prompt: string;
  explanation: string;
  options: [string, string, string, string];
  correctIndex: number;
}

interface QuizFormState {
  title: string;
  emoji: string;
  category: string;
  difficulty: string;
  color: string;
  gradColorA: string;
  gradColorB: string;
  maxPlayers: string;
  secondsPerQuestion: string;
  active: boolean;
  questions: QuestionForm[];
}

const defaultQuestion = (): QuestionForm => ({
  prompt: "",
  explanation: "",
  options: ["", "", "", ""],
  correctIndex: 0,
});

const emptyQuizForm = (): QuizFormState => ({
  title: "",
  emoji: "ðŸŽ¯",
  category: "",
  difficulty: "Medio",
  color: "#1f4db7",
  gradColorA: "#1f4db7",
  gradColorB: "#6b21a8",
  maxPlayers: "50",
  secondsPerQuestion: "20",
  active: true,
  questions: [defaultQuestion()],
});

function toDateLabel(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function toStatusLabel(status: QuizSessionStatus) {
  if (status === "WAITING") return "En espera";
  if (status === "IN_PROGRESS") return "En juego";
  if (status === "FINISHED") return "Finalizada";
  return "Cancelada";
}

function statusBadge(status: QuizSessionStatus) {
  if (status === "WAITING") return "bg-amber-100 text-amber-700";
  if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-700";
  if (status === "FINISHED") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
}

function normalizeSocketBaseUrl(raw?: string) {
  const base = (raw || "http://localhost:3002").replace(/\/+$/, "");
  return base.endsWith("/api") ? base.slice(0, -4) : base;
}

function quizToForm(quiz: QuizTemplate): QuizFormState {
  return {
    title: quiz.title,
    emoji: quiz.emoji || "ðŸŽ¯",
    category: quiz.category,
    difficulty: quiz.difficulty,
    color: quiz.color || "#1f4db7",
    gradColorA: quiz.gradColors?.[0] || "#1f4db7",
    gradColorB: quiz.gradColors?.[1] || "#6b21a8",
    maxPlayers: String(quiz.maxPlayers),
    secondsPerQuestion: String(quiz.secondsPerQuestion),
    active: quiz.active,
    questions:
      quiz.questions?.map((question) => {
        const ordered = [...question.options].sort((a, b) => a.order - b.order);
        const options: [string, string, string, string] = [
          ordered[0]?.text || "",
          ordered[1]?.text || "",
          ordered[2]?.text || "",
          ordered[3]?.text || "",
        ];
        const correctIndex = ordered.findIndex((option) => option.isCorrect);
        return {
          prompt: question.prompt,
          explanation: question.explanation || "",
          options,
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
        };
      }) || [defaultQuestion()],
  };
}

function formToPayload(form: QuizFormState): QuizPayload {
  return {
    title: form.title.trim(),
    emoji: form.emoji.trim() || undefined,
    category: form.category.trim(),
    difficulty: form.difficulty.trim(),
    color: form.color.trim() || undefined,
    gradColors: [form.gradColorA.trim(), form.gradColorB.trim()],
    active: form.active,
    maxPlayers: Number(form.maxPlayers),
    secondsPerQuestion: Number(form.secondsPerQuestion),
    questions: form.questions.map((question, questionIndex) => ({
      prompt: question.prompt.trim(),
      explanation: question.explanation.trim() || undefined,
      order: questionIndex + 1,
      options: question.options.map((optionText, optionIndex) => ({
        text: optionText.trim(),
        order: optionIndex + 1,
        isCorrect: optionIndex === question.correctIndex,
      })),
    })),
  };
}

export default function QuizManager() {
  const toast = useToast();
  const socketBaseUrl = useMemo(
    () => normalizeSocketBaseUrl(process.env.NEXT_PUBLIC_API_URL),
    []
  );

  const [tab, setTab] = useState<AdminTab>("bank");
  const [quizzes, setQuizzes] = useState<QuizTemplate[]>([]);
  const [sessions, setSessions] = useState<QuizSessionSummary[]>([]);
  const [selectedSession, setSelectedSession] = useState<QuizSessionDetail | null>(
    null
  );
  const [liveSnapshot, setLiveSnapshot] = useState<QuizSessionSnapshot | null>(null);
  const [lastRound, setLastRound] = useState<QuestionClosedEvent | null>(null);
  const [finishedEvent, setFinishedEvent] = useState<SessionFinishedEvent | null>(
    null
  );

  const [loadingBank, setLoadingBank] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [creatingSessionFor, setCreatingSessionFor] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [liveActionLoading, setLiveActionLoading] = useState<
    "start" | "cancel" | "delete" | null
  >(
    null
  );

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizTemplate | null>(null);
  const [quizForm, setQuizForm] = useState<QuizFormState>(emptyQuizForm);

  const [sessionFilter, setSessionFilter] = useState<QuizSessionStatus | "ALL">(
    "ALL"
  );

  const socketRef = useRef<Socket | null>(null);
  const joinedSessionRef = useRef<string | null>(null);

  const loadQuizzes = async () => {
    try {
      setLoadingBank(true);
      const data = await getQuizzesAPI();
      setQuizzes(data);
    } catch {
      toast.error("No se pudo cargar el banco de quizzes.");
    } finally {
      setLoadingBank(false);
    }
  };

  const loadSessions = async () => {
    try {
      setLoadingSessions(true);
      const response = await getQuizSessionsAPI(
        sessionFilter === "ALL" ? {} : { status: sessionFilter, limit: 100 }
      );
      setSessions(response.items);
    } catch {
      toast.error("No se pudieron cargar las salas.");
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadSessionDetail = async (sessionId: string) => {
    const detail = await getQuizSessionDetailAPI(sessionId);
    setSelectedSession(detail);
    return detail;
  };

  useEffect(() => {
    void loadQuizzes();
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [sessionFilter]);

  useEffect(() => {
    return () => {
      const socket = socketRef.current;
      if (!socket) return;
      const joinedSession = joinedSessionRef.current;
      if (joinedSession) {
        socket.emit("session.leave", { sessionId: joinedSession });
      }
      socket.disconnect();
      socketRef.current = null;
      joinedSessionRef.current = null;
    };
  }, []);

  const participantRows = useMemo(() => {
    if (liveSnapshot?.participants?.length) {
      return liveSnapshot.participants.map((participant) => ({
        key: participant.id,
        name: participant.name,
        connected: participant.isConnected,
        score: participant.score,
        rank: participant.rank ?? null,
      }));
    }

    if (!selectedSession?.participants?.length) {
      return [];
    }

    return [...selectedSession.participants]
      .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))
      .map((participant) => ({
        key: participant.userId,
        name: participant.displayName || participant.fullName,
        connected: participant.isConnected,
        score: participant.totalScore,
        rank: participant.rank ?? null,
      }));
  }, [liveSnapshot, selectedSession]);

  const finalRanking = useMemo(() => {
    if (finishedEvent?.ranking?.length) {
      return [...finishedEvent.ranking].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
    }
    if (!selectedSession?.participants?.length) {
      return [];
    }
    return [...selectedSession.participants]
      .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
      .map((participant) => ({
        userId: participant.userId,
        name: participant.displayName || participant.fullName,
        score: participant.totalScore,
        totalResponseMs: participant.totalResponseMs,
        rank: participant.rank ?? null,
      }));
  }, [finishedEvent, selectedSession]);

  const ensureSocket = async () => {
    const token = getToken();
    if (!token) {
      throw new Error("Tu sesiÃ³n expirÃ³. Inicia sesiÃ³n nuevamente.");
    }

    if (!socketRef.current) {
      const url = `${socketBaseUrl}/quiz`;
      console.log("[QuizWeb] creando socket para", url);
      socketRef.current = io(url, {
        autoConnect: false,
        transports: ["websocket"],
        auth: { token },
      });
      socketRef.current.on("connect", () => {
        console.log("[QuizWeb] socket conectado id=", socketRef.current?.id);
      });
      socketRef.current.on("disconnect", (reason) => {
        console.log("[QuizWeb] socket desconectado, reason=", reason);
      });
      socketRef.current.on("connect_error", (err) => {
        console.log("[QuizWeb] connect_error:", err?.message);
      });
    } else {
      socketRef.current.auth = { token };
    }

    const socket = socketRef.current;
    if (!socket.connected) {
      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          socket.off("connect", onConnect);
          socket.off("connect_error", onError);
          reject(new Error("No se pudo conectar al canal en vivo."));
        }, 8000);

        const onConnect = () => {
          window.clearTimeout(timeout);
          socket.off("connect_error", onError);
          resolve();
        };

        const onError = () => {
          window.clearTimeout(timeout);
          socket.off("connect", onConnect);
          reject(new Error("No se pudo conectar al canal en vivo."));
        };

        socket.once("connect", onConnect);
        socket.once("connect_error", onError);
        socket.connect();
      });
    }

    return socket;
  };

  const emitWithAck = async <T,>(
    event: string,
    payload: Record<string, unknown>
  ): Promise<T> => {
    const socket = await ensureSocket();
    return await new Promise<T>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error("Tiempo de espera agotado en evento socket."));
      }, 8000);

      socket.emit(event, payload, (response: T) => {
        window.clearTimeout(timer);
        resolve(response);
      });
    });
  };

  useEffect(() => {
    if (!selectedSession) {
      return;
    }

    let disposed = false;
    const sessionId = selectedSession.id;
    const roomCode = selectedSession.roomCode;

    const wireSocket = async () => {
      try {
        const socket = await ensureSocket();
        if (disposed) return;

        const previousSession = joinedSessionRef.current;
        if (previousSession && previousSession !== sessionId) {
          socket.emit("session.leave", { sessionId: previousSession });
        }
        joinedSessionRef.current = sessionId;

        const onJoined = (snapshot: QuizSessionSnapshot) => {
          console.log("[QuizWeb] <- session.joined", snapshot);
          if (snapshot.sessionId !== sessionId || disposed) return;
          setLiveSnapshot(snapshot);
        };

        const onPresence = (payload: PresenceUpdatedEvent) => {
          console.log(
            "[QuizWeb] <- session.presence.updated",
            payload.sessionId,
            "participants:",
            payload.participants.length
          );
          if (payload.sessionId !== sessionId || disposed) return;
          setLiveSnapshot((current) =>
            current ? { ...current, participants: payload.participants } : current
          );
          setSessions((current) =>
            current.map((item) =>
              item.id === payload.sessionId
                ? { ...item, participantCount: payload.participants.length }
                : item
            )
          );
          setSelectedSession((current) =>
            current && current.id === payload.sessionId
              ? { ...current, participantCount: payload.participants.length }
              : current
          );
        };

        const onSessionStarted = (payload: { sessionId: string }) => {
          console.log("[QuizWeb] <- session.started", payload);
          if (payload.sessionId !== sessionId || disposed) return;
          setLiveSnapshot((current) =>
            current ? { ...current, status: "IN_PROGRESS" } : current
          );
          void loadSessionDetail(sessionId);
          void loadSessions();
        };

        const onQuestionStarted = (payload: QuestionStartedEvent) => {
          console.log("[QuizWeb] <- question.started", payload);
          if (payload.sessionId !== sessionId || disposed) return;
          setLiveSnapshot((current) =>
            current
              ? {
                  ...current,
                  status: "IN_PROGRESS",
                  currentQuestion: payload.question,
                  currentQuestionEndsAt: payload.endsAt,
                }
              : current
          );
          setLastRound(null);
        };

        const onQuestionClosed = (payload: QuestionClosedEvent) => {
          console.log("[QuizWeb] <- question.closed", payload);
          if (payload.sessionId !== sessionId || disposed) return;
          setLastRound(payload);
        };

        const onSessionFinished = (payload: SessionFinishedEvent) => {
          console.log("[QuizWeb] <- session.finished", payload);
          if (payload.sessionId !== sessionId || disposed) return;
          setFinishedEvent(payload);
          setLiveSnapshot((current) =>
            current
              ? {
                  ...current,
                  status: "FINISHED",
                  winner: payload.winner,
                  currentQuestion: null,
                  currentQuestionEndsAt: null,
                }
              : current
          );
          void loadSessionDetail(sessionId);
          void loadSessions();
        };

        const onSessionError = (payload: { code?: string; message?: string }) => {
          console.log("[QuizWeb] <- session.error", payload);
          if (disposed) return;
          if (payload?.code) {
            toast.error(`Socket quiz: ${payload.code}`);
          }
        };

        console.log("[QuizWeb] adjuntando listeners para session", sessionId);
        socket.on("session.joined", onJoined);
        socket.on("session.presence.updated", onPresence);
        socket.on("session.started", onSessionStarted);
        socket.on("question.started", onQuestionStarted);
        socket.on("question.closed", onQuestionClosed);
        socket.on("session.finished", onSessionFinished);
        socket.on("session.error", onSessionError);

        console.log("[QuizWeb] -> session.join", { sessionId, roomCode });
        socket.emit("session.join", { sessionId, roomCode });

        return () => {
          socket.off("session.joined", onJoined);
          socket.off("session.presence.updated", onPresence);
          socket.off("session.started", onSessionStarted);
          socket.off("question.started", onQuestionStarted);
          socket.off("question.closed", onQuestionClosed);
          socket.off("session.finished", onSessionFinished);
          socket.off("session.error", onSessionError);
        };
      } catch (error) {
        if (!disposed) {
          toast.error((error as Error).message || "No se pudo iniciar el canal en vivo.");
        }
      }
      return undefined;
    };

    let cleanup: (() => void) | undefined;
    void wireSocket().then((fn) => {
      cleanup = fn;
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [selectedSession?.id, selectedSession?.roomCode]);

  const openCreateQuizModal = () => {
    setEditingQuiz(null);
    setQuizForm(emptyQuizForm());
    setIsQuizModalOpen(true);
  };

  const openEditQuizModal = (quiz: QuizTemplate) => {
    setEditingQuiz(quiz);
    setQuizForm(quizToForm(quiz));
    setIsQuizModalOpen(true);
  };

  const handleSaveQuiz = async () => {
    const payload = formToPayload(quizForm);

    if (!payload.title || !payload.category || !payload.difficulty) {
      toast.error("Completa tÃ­tulo, categorÃ­a y dificultad.");
      return;
    }
    if (!payload.questions.length) {
      toast.error("Agrega al menos una pregunta.");
      return;
    }

    for (const question of payload.questions) {
      if (!question.prompt.trim()) {
        toast.error("Todas las preguntas deben tener enunciado.");
        return;
      }
      const emptyOption = question.options.find((option) => !option.text.trim());
      if (emptyOption) {
        toast.error("Cada pregunta debe tener 4 opciones completas.");
        return;
      }
    }

    try {
      setSavingQuiz(true);
      if (editingQuiz) {
        await updateQuizAPI(editingQuiz.id, payload);
        toast.success("Quiz actualizado.");
      } else {
        await createQuizAPI(payload);
        toast.success("Quiz creado.");
      }
      setIsQuizModalOpen(false);
      setEditingQuiz(null);
      setQuizForm(emptyQuizForm());
      await loadQuizzes();
    } catch {
      toast.error("No se pudo guardar el quiz.");
    } finally {
      setSavingQuiz(false);
    }
  };

  const handleDeactivateQuiz = async (quiz: QuizTemplate) => {
    const ok = window.confirm(
      `Se inactivarÃ¡ "${quiz.title}". Ya no podrÃ¡ usarse para salas nuevas.`
    );
    if (!ok) return;

    try {
      await deactivateQuizAPI(quiz.id);
      toast.success("Quiz inactivado.");
      await loadQuizzes();
    } catch {
      toast.error("No se pudo inactivar el quiz.");
    }
  };

  const handleCreateSession = async (quiz: QuizTemplate) => {
    try {
      setCreatingSessionFor(quiz.id);
      const created = await createQuizSessionAPI(quiz.id, {
        maxPlayers: quiz.maxPlayers,
        secondsPerQuestion: quiz.secondsPerQuestion,
      });
      toast.success(`Sala creada con cÃ³digo ${created.roomCode}.`);
      await loadSessions();
      const detail = await loadSessionDetail(created.id);
      setLiveSnapshot(null);
      setFinishedEvent(null);
      setLastRound(null);
      setSelectedSession(detail);
      setTab("live");
    } catch {
      toast.error("No se pudo crear la sala.");
    } finally {
      setCreatingSessionFor(null);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    try {
      const detail = await loadSessionDetail(sessionId);
      setSelectedSession(detail);
      setLiveSnapshot(null);
      setFinishedEvent(null);
      setLastRound(null);
    } catch {
      toast.error("No se pudo abrir la sala.");
    }
  };

  const handleStartSession = async () => {
    if (!selectedSession) return;
    try {
      setLiveActionLoading("start");
      const response = await emitWithAck<QuizSessionSummary>("session.host.start", {
        sessionId: selectedSession.id,
      });
      if ((response as { ok?: boolean }).ok === false) {
        throw new Error("No se pudo iniciar la sala.");
      }
      toast.success("Sala iniciada.");
      await loadSessions();
      await loadSessionDetail(selectedSession.id);
    } catch (error) {
      toast.error((error as Error).message || "No se pudo iniciar la sala.");
    } finally {
      setLiveActionLoading(null);
    }
  };

  const handleCancelSession = async () => {
    if (!selectedSession) return;
    const ok = window.confirm("Â¿Seguro que deseas cancelar esta sala?");
    if (!ok) return;

    try {
      setLiveActionLoading("cancel");
      const response = await emitWithAck<QuizSessionSummary>("session.host.cancel", {
        sessionId: selectedSession.id,
      });
      if ((response as { ok?: boolean }).ok === false) {
        await cancelQuizSessionAPI(selectedSession.id);
      }
      toast.success("Sala cancelada.");
      await loadSessions();
      await loadSessionDetail(selectedSession.id);
    } catch {
      toast.error("No se pudo cancelar la sala.");
    } finally {
      setLiveActionLoading(null);
    }
  };

  const handleDeleteSession = async (target: {
    id: string;
    roomCode: string;
    status: QuizSessionStatus;
  }) => {
    if (target.status === "IN_PROGRESS") {
      toast.error("Primero cancela la sala en juego para poder eliminarla.");
      return;
    }

    const ok = window.confirm(
      `Seguro que deseas eliminar la sala ${target.roomCode}? Esta accion es permanente.`
    );
    if (!ok) return;

    try {
      setLiveActionLoading("delete");
      setDeletingSessionId(target.id);
      await deleteQuizSessionAPI(target.id);
      toast.success("Sala eliminada.");

      if (joinedSessionRef.current === target.id && socketRef.current) {
        socketRef.current.emit("session.leave", { sessionId: target.id });
        joinedSessionRef.current = null;
      }

      if (selectedSession?.id === target.id) {
        setSelectedSession(null);
        setLiveSnapshot(null);
        setFinishedEvent(null);
        setLastRound(null);
      }

      await loadSessions();
    } catch {
      toast.error("No se pudo eliminar la sala.");
    } finally {
      setDeletingSessionId(null);
      setLiveActionLoading(null);
    }
  };

  if (loadingBank && loadingSessions) {
    return (
      <div className="px-5 py-10 text-sm text-slate-500">
        Cargando módulo de quiz...
      </div>
    );
  }

  const liveStatus = liveSnapshot?.status || selectedSession?.status;
  const livePlayers =
    liveSnapshot?.participants.length ?? selectedSession?.participantCount ?? 0;

  return (
    <>
      <PageHeader
        title="Quiz en tiempo real"
        description="Plantillas, salas en vivo y monitoreo de participantes."
        icon={<Brain className="h-[18px] w-[18px]" strokeWidth={2.1} />}
        breadcrumbs={[{ label: "Interactivo" }, { label: "Quiz" }]}
        actions={
          <>
            <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5">
              <button
                className={`rounded px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  tab === "bank"
                    ? "bg-jmv-blue text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => setTab("bank")}
              >
                Banco
              </button>
              <button
                className={`rounded px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  tab === "live"
                    ? "bg-jmv-blue text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => setTab("live")}
              >
                Salas en vivo
              </button>
            </div>
            {tab === "bank" ? (
              <Button
                size="md"
                variant="primary"
                icon={<Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
                onClick={openCreateQuizModal}
              >
                Nuevo quiz
              </Button>
            ) : (
              <Button
                size="md"
                variant="outline"
                icon={<RefreshCcw className="h-3.5 w-3.5" />}
                onClick={() => void loadSessions()}
                isLoading={loadingSessions}
              >
                Actualizar
              </Button>
            )}
          </>
        }
      />

      <div className="flex-1 space-y-5 overflow-auto px-6 py-5">
        {tab === "bank" ? (
          <section>
            <p className="mb-3 text-xs text-slate-500">
              {quizzes.length} plantilla{quizzes.length === 1 ? "" : "s"} registrada
              {quizzes.length === 1 ? "" : "s"}.
            </p>

            {loadingBank ? (
              <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">
                Cargando banco...
              </div>
            ) : quizzes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
                <Brain className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">
                  Aún no hay quizzes
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Crea uno nuevo para empezar a generar salas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {quizzes.map((quiz) => (
                  <article
                    key={quiz.id}
                    className="group flex flex-col rounded-lg border border-slate-200 bg-white p-3.5 transition-colors hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-lg">
                          {quiz.emoji || "🎯"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                            {quiz.category}
                          </p>
                          <h2 className="text-sm font-bold text-slate-900 leading-tight line-clamp-2">
                            {quiz.title}
                          </h2>
                        </div>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          quiz.active
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            quiz.active ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {quiz.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-md bg-slate-50 p-2.5 text-[11.5px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dificultad</span>
                        <span className="font-semibold text-slate-800">
                          {quiz.difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Preguntas</span>
                        <span className="font-semibold text-slate-800">
                          {quiz.questionCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Máx. juga.</span>
                        <span className="font-semibold text-slate-800">
                          {quiz.maxPlayers}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Seg/preg.</span>
                        <span className="font-semibold text-slate-800">
                          {quiz.secondsPerQuestion}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Button
                        size="xs"
                        variant="primary"
                        icon={<Radio className="h-3 w-3" />}
                        onClick={() => void handleCreateSession(quiz)}
                        isLoading={creatingSessionFor === quiz.id}
                        disabled={!quiz.active}
                      >
                        Crear sala
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        icon={<Pencil className="h-3 w-3" />}
                        onClick={() => openEditQuizModal(quiz)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        icon={<Ban className="h-3 w-3" />}
                        onClick={() => void handleDeactivateQuiz(quiz)}
                        disabled={!quiz.active}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Inactivar
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                Filtrar por estado:
              </span>
              {(
                [
                  { value: "ALL", label: "Todos" },
                  { value: "WAITING", label: "En espera" },
                  { value: "IN_PROGRESS", label: "En juego" },
                  { value: "FINISHED", label: "Finalizadas" },
                  { value: "CANCELLED", label: "Canceladas" },
                ] as { value: QuizSessionStatus | "ALL"; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSessionFilter(opt.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    sessionFilter === opt.value
                      ? "bg-jmv-blue text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
              <div className="xl:col-span-3">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50">
                      <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                        <th className="px-3 py-2.5 text-left font-bold">Sala</th>
                        <th className="px-3 py-2.5 text-left font-bold">Quiz</th>
                        <th className="px-3 py-2.5 text-left font-bold">Estado</th>
                        <th className="px-3 py-2.5 text-left font-bold">
                          Jugadores
                        </th>
                        <th className="px-3 py-2.5 text-right font-bold">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {sessions.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-3 py-8 text-center text-sm text-slate-500"
                          >
                            No hay salas para este filtro.
                          </td>
                        </tr>
                      ) : (
                        sessions.map((session) => {
                          const isSelected = selectedSession?.id === session.id;
                          return (
                            <tr
                              key={session.id}
                              className={`transition-colors ${
                                isSelected ? "bg-jmv-blue/5" : "hover:bg-slate-50"
                              }`}
                            >
                              <td className="px-3 py-2.5">
                                <p className="font-mono text-sm font-bold tracking-wide text-slate-900">
                                  {session.roomCode}
                                </p>
                                <p className="text-[10.5px] text-slate-500">
                                  {toDateLabel(session.createdAt)}
                                </p>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-1.5 text-slate-700">
                                  <span>{session.quiz.emoji || "🎯"}</span>
                                  <span className="text-xs font-medium line-clamp-1">
                                    {session.quiz.title}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusBadge(
                                    session.status
                                  )}`}
                                >
                                  {toStatusLabel(session.status)}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-xs font-semibold text-slate-700">
                                {session.participantCount}/{session.maxPlayers}
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex justify-end gap-1.5">
                                  <Button
                                    size="xs"
                                    variant={isSelected ? "primary" : "outline"}
                                    onClick={() =>
                                      void handleSelectSession(session.id)
                                    }
                                  >
                                    {isSelected ? "Abierta" : "Abrir"}
                                  </Button>
                                  <button
                                    onClick={() =>
                                      void handleDeleteSession({
                                        id: session.id,
                                        roomCode: session.roomCode,
                                        status: session.status,
                                      })
                                    }
                                    disabled={
                                      session.status === "IN_PROGRESS" ||
                                      deletingSessionId === session.id
                                    }
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="xl:col-span-2">
                {!selectedSession ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
                    <Radio className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">
                      Selecciona una sala
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Verás el control en vivo aquí mismo.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                    {/* Code + status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                          Código de sala
                        </p>
                        <h3 className="mt-0.5 font-mono text-xl font-black tracking-[0.25em] text-slate-900">
                          {selectedSession.roomCode}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusBadge(
                          liveStatus || "WAITING"
                        )}`}
                      >
                        {toStatusLabel(liveStatus || "WAITING")}
                      </span>
                    </div>

                    {/* Quiz info */}
                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <p className="text-xs font-bold text-slate-900">
                        {selectedSession.quiz.emoji || "🎯"}{" "}
                        {selectedSession.quiz.title}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
                        <span>
                          <Users className="mr-0.5 inline h-3 w-3" />
                          {livePlayers}/{selectedSession.maxPlayers} jugadores
                        </span>
                        <span>⏱ {selectedSession.secondsPerQuestion}s/preg.</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        size="xs"
                        variant="primary"
                        icon={<CircleDot className="h-3 w-3" />}
                        onClick={() => void handleStartSession()}
                        disabled={liveStatus !== "WAITING"}
                        isLoading={liveActionLoading === "start"}
                      >
                        Iniciar
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        icon={<Ban className="h-3 w-3" />}
                        onClick={() => void handleCancelSession()}
                        disabled={
                          liveStatus === "CANCELLED" || liveStatus === "FINISHED"
                        }
                        isLoading={liveActionLoading === "cancel"}
                        className="text-amber-700 border-amber-200 hover:bg-amber-50"
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        icon={<Trash2 className="h-3 w-3" />}
                        onClick={() =>
                          void handleDeleteSession({
                            id: selectedSession.id,
                            roomCode: selectedSession.roomCode,
                            status: liveStatus || selectedSession.status,
                          })
                        }
                        disabled={liveStatus === "IN_PROGRESS"}
                        isLoading={deletingSessionId === selectedSession.id}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Eliminar
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        icon={<RefreshCcw className="h-3 w-3" />}
                        onClick={() =>
                          void handleSelectSession(selectedSession.id)
                        }
                      >
                        Refrescar
                      </Button>
                    </div>

                    {/* Participants */}
                    <div className="rounded-md border border-slate-200">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-slate-50">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          <Users className="mr-1 inline h-3 w-3" />
                          Participantes
                        </p>
                        <span className="text-[11px] font-bold text-slate-700">
                          {participantRows.length}
                        </span>
                      </div>
                      {participantRows.length === 0 ? (
                        <p className="px-3 py-3 text-xs text-slate-500">
                          Sin participantes aún.
                        </p>
                      ) : (
                        <ul className="divide-y divide-slate-100">
                          {participantRows.map((participant) => (
                            <li
                              key={participant.key}
                              className="flex items-center justify-between px-3 py-2 text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`h-2 w-2 shrink-0 rounded-full ${
                                    participant.connected
                                      ? "bg-emerald-500"
                                      : "bg-slate-300"
                                  }`}
                                />
                                <span className="font-medium text-slate-800 truncate">
                                  {participant.name}
                                </span>
                              </div>
                              <span className="ml-2 shrink-0 font-bold text-slate-600">
                                {participant.score} pts
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Current question */}
                    {liveSnapshot?.currentQuestion ? (
                      <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2.5">
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-blue-700">
                          Pregunta en curso
                        </p>
                        <p className="mt-1 text-xs font-semibold text-blue-900 line-clamp-2">
                          {liveSnapshot.currentQuestion.prompt}
                        </p>
                        <p className="mt-1 text-[10.5px] text-blue-700">
                          Cierra: {toDateLabel(liveSnapshot.currentQuestionEndsAt)}
                        </p>
                      </div>
                    ) : null}

                    {/* Last round */}
                    {lastRound ? (
                      <div className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs text-indigo-900">
                        <span className="font-bold">Última ronda:</span>{" "}
                        Respondieron {lastRound.answeredCount}/
                        {lastRound.participantCount} jugadores.
                      </div>
                    ) : null}

                    {/* Final ranking */}
                    {(liveStatus === "FINISHED" ||
                      selectedSession.status === "FINISHED") &&
                    finalRanking.length > 0 ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                        <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wider text-amber-800">
                          <Trophy className="mr-1 inline h-3 w-3" />
                          Ranking final
                        </p>
                        <ol className="space-y-1">
                          {finalRanking.map((entry) => (
                            <li
                              key={entry.userId}
                              className="flex items-center justify-between rounded bg-white px-2.5 py-1.5 text-xs"
                            >
                              <span className="font-medium text-slate-800">
                                <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                                  {entry.rank || "-"}
                                </span>
                                {entry.name}
                              </span>
                              <span className="font-bold text-amber-700">
                                {entry.score} pts
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Quiz form modal */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        title={editingQuiz ? "Editar quiz" : "Nuevo quiz"}
        description={
          editingQuiz
            ? "Actualiza la plantilla del quiz."
            : "Define las preguntas y configuración de la nueva plantilla."
        }
        size="xl"
        footer={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsQuizModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="primary"
              isLoading={savingQuiz}
              icon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => void handleSaveQuiz()}
            >
              {editingQuiz ? "Guardar cambios" : "Crear quiz"}
            </Button>
          </>
        }
      >
        <div className="px-5 py-4 space-y-5">
          {/* Section: General */}
          <section>
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Información general
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InputField
                label="Título"
                required
                value={quizForm.title}
                onChange={(event) =>
                  setQuizForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Ej. Historia Vicentina"
                className="lg:col-span-2"
              />
              <InputField
                label="Emoji"
                value={quizForm.emoji}
                onChange={(event) =>
                  setQuizForm((current) => ({
                    ...current,
                    emoji: event.target.value,
                  }))
                }
                placeholder="🎯"
              />
              <InputField
                label="Categoría"
                required
                value={quizForm.category}
                onChange={(event) =>
                  setQuizForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                placeholder="Biblia"
              />
              <InputField
                label="Dificultad"
                required
                value={quizForm.difficulty}
                onChange={(event) =>
                  setQuizForm((current) => ({
                    ...current,
                    difficulty: event.target.value,
                  }))
                }
                placeholder="Medio"
              />
              <div className="flex items-end">
                <label className="inline-flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={quizForm.active}
                    onChange={(event) =>
                      setQuizForm((current) => ({
                        ...current,
                        active: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-jmv-blue focus:ring-2 focus:ring-jmv-blue/30"
                  />
                  Quiz activo
                </label>
              </div>
            </div>
          </section>

          {/* Section: Visual */}
          <section>
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Apariencia
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InputField
                label="Color base"
                value={quizForm.color}
                onChange={(event) =>
                  setQuizForm((current) => ({
                    ...current,
                    color: event.target.value,
                  }))
                }
                placeholder="#1f4db7"
              />
              <InputField
                label="Gradiente A"
                value={quizForm.gradColorA}
                onChange={(event) =>
                  setQuizForm((current) => ({
                    ...current,
                    gradColorA: event.target.value,
                  }))
                }
                placeholder="#1f4db7"
              />
              <InputField
                label="Gradiente B"
                value={quizForm.gradColorB}
                onChange={(event) =>
                  setQuizForm((current) => ({
                    ...current,
                    gradColorB: event.target.value,
                  }))
                }
                placeholder="#6b21a8"
              />
            </div>
          </section>

          {/* Section: Game settings */}
          <section>
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Reglas del juego
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Máx. jugadores"
                required
                type="number"
                value={quizForm.maxPlayers}
                onChange={(event) =>
                  setQuizForm((current) => ({
                    ...current,
                    maxPlayers: event.target.value,
                  }))
                }
              />
              <InputField
                label="Segundos por pregunta"
                required
                type="number"
                value={quizForm.secondsPerQuestion}
                onChange={(event) =>
                  setQuizForm((current) => ({
                    ...current,
                    secondsPerQuestion: event.target.value,
                  }))
                }
              />
            </div>
          </section>

          {/* Section: Questions */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                <HelpCircle className="h-4 w-4 text-jmv-blue" />
                Preguntas
                <span className="ml-1 rounded-full bg-jmv-blue/10 px-2 py-0.5 text-[10.5px] font-bold text-jmv-blue">
                  {quizForm.questions.length}
                </span>
              </h3>
              <Button
                size="xs"
                variant="outline"
                icon={<Plus className="h-3 w-3" />}
                onClick={() =>
                  setQuizForm((current) => ({
                    ...current,
                    questions: [...current.questions, defaultQuestion()],
                  }))
                }
              >
                Añadir pregunta
              </Button>
            </div>

            <div className="space-y-3">
              {quizForm.questions.map((question, index) => (
                <div
                  key={`question-${index}`}
                  className="rounded-md border border-slate-200 bg-white p-3"
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-jmv-blue text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                      Pregunta {index + 1}
                    </p>
                    {quizForm.questions.length > 1 ? (
                      <button
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                        onClick={() =>
                          setQuizForm((current) => ({
                            ...current,
                            questions: current.questions.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                        Quitar
                      </button>
                    ) : null}
                  </div>

                  <div className="space-y-2.5">
                    <InputField
                      label="Enunciado"
                      required
                      value={question.prompt}
                      onChange={(event) =>
                        setQuizForm((current) => ({
                          ...current,
                          questions: current.questions.map((item, i) =>
                            i === index
                              ? { ...item, prompt: event.target.value }
                              : item
                          ),
                        }))
                      }
                      placeholder="Escribe la pregunta..."
                    />

                    <InputField
                      label="Explicación (opcional)"
                      value={question.explanation}
                      onChange={(event) =>
                        setQuizForm((current) => ({
                          ...current,
                          questions: current.questions.map((item, i) =>
                            i === index
                              ? { ...item, explanation: event.target.value }
                              : item
                          ),
                        }))
                      }
                      placeholder="Texto que se puede mostrar al cerrar la ronda"
                    />

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        Opciones
                      </label>
                      <div className="space-y-1.5">
                        {question.options.map((option, optionIndex) => {
                          const isCorrect =
                            question.correctIndex === optionIndex;
                          return (
                            <div
                              key={`option-${index}-${optionIndex}`}
                              className={`flex items-center gap-2 rounded-md border px-2 transition-colors ${
                                isCorrect
                                  ? "border-emerald-300 bg-emerald-50/50"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setQuizForm((current) => ({
                                    ...current,
                                    questions: current.questions.map((item, i) =>
                                      i === index
                                        ? {
                                            ...item,
                                            correctIndex: optionIndex,
                                          }
                                        : item
                                    ),
                                  }))
                                }
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                  isCorrect
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-slate-300 hover:border-slate-400"
                                }`}
                                title={
                                  isCorrect
                                    ? "Opción correcta"
                                    : "Marcar como correcta"
                                }
                              >
                                {isCorrect && (
                                  <span className="text-[10px] font-bold text-white">
                                    ✓
                                  </span>
                                )}
                              </button>
                              <span className="text-[10.5px] font-bold uppercase text-slate-400 w-3">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <input
                                value={option}
                                onChange={(event) =>
                                  setQuizForm((current) => ({
                                    ...current,
                                    questions: current.questions.map(
                                      (item, i) => {
                                        if (i !== index) return item;
                                        const nextOptions = [
                                          ...item.options,
                                        ] as [string, string, string, string];
                                        nextOptions[optionIndex] =
                                          event.target.value;
                                        return {
                                          ...item,
                                          options: nextOptions,
                                        };
                                      }
                                    ),
                                  }))
                                }
                                className="h-8 flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                                placeholder={`Respuesta ${optionIndex + 1}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <p className="mt-1 text-[10.5px] text-slate-500">
                        Marca el círculo de la opción correcta.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Modal>
    </>
  );
}
