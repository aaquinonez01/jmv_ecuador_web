export type QuizSessionStatus =
  | "WAITING"
  | "IN_PROGRESS"
  | "FINISHED"
  | "CANCELLED";

export interface QuizQuestionOptionInput {
  text: string;
  order: number;
  isCorrect: boolean;
}

export interface QuizQuestionInput {
  prompt: string;
  explanation?: string;
  order: number;
  options: QuizQuestionOptionInput[];
}

export interface QuizPayload {
  title: string;
  emoji?: string;
  category: string;
  difficulty: string;
  color?: string;
  gradColors: string[];
  active?: boolean;
  maxPlayers?: number;
  secondsPerQuestion?: number;
  questions: QuizQuestionInput[];
}

export interface QuizTemplate {
  id: string;
  title: string;
  emoji?: string | null;
  category: string;
  difficulty: string;
  color?: string | null;
  gradColors: string[];
  active: boolean;
  maxPlayers: number;
  secondsPerQuestion: number;
  questionCount: number;
  questions: Array<
    QuizQuestionInput & {
      id: string;
      options: Array<QuizQuestionOptionInput & { id: string }>;
    }
  >;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuizSessionPayload {
  maxPlayers?: number;
  secondsPerQuestion?: number;
}

export interface QuizSessionSummary {
  id: string;
  roomCode: string;
  status: QuizSessionStatus;
  currentQuestionIndex: number;
  currentQuestionEndsAt?: string | null;
  maxPlayers: number;
  secondsPerQuestion: number;
  startedAt?: string | null;
  endedAt?: string | null;
  participantCount: number;
  createdAt?: string;
  updatedAt?: string;
  quiz: {
    id: string;
    title: string;
    emoji?: string | null;
    category: string;
    difficulty: string;
  };
  host?: {
    id?: string | null;
    fullName: string;
    displayName?: string | null;
  } | null;
  winner?: {
    id?: string | null;
    fullName: string;
    displayName?: string | null;
  } | null;
}

export interface QuizSessionParticipantDetail {
  id: string;
  userId: string;
  fullName: string;
  displayName?: string | null;
  isConnected: boolean;
  totalScore: number;
  totalResponseMs: number;
  rank?: number | null;
  isWinner: boolean;
  joinedAt: string;
}

export interface QuizSessionDetail extends QuizSessionSummary {
  participants: QuizSessionParticipantDetail[];
}

export interface QuizSessionSnapshotParticipant {
  id: string;
  name: string;
  initial: string;
  isCurrentUser?: boolean;
  isConnected: boolean;
  score: number;
  rank?: number | null;
}

export interface QuizSessionSnapshotQuestionOption {
  id: string;
  text: string;
  order: number;
}

export interface QuizSessionSnapshotQuestion {
  id: string;
  prompt: string;
  order: number;
  totalQuestions: number;
  options: QuizSessionSnapshotQuestionOption[];
}

export interface QuizSessionSnapshot {
  sessionId: string;
  roomCode: string;
  status: QuizSessionStatus;
  currentQuestionIndex: number;
  currentQuestionEndsAt: string | null;
  quiz: {
    id: string;
    title: string;
    emoji?: string | null;
    category: string;
    difficulty: string;
    color?: string | null;
    gradColors: string[];
    questionCount: number;
  };
  participants: QuizSessionSnapshotParticipant[];
  currentQuestion: QuizSessionSnapshotQuestion | null;
  winner: { id?: string | null; name: string } | null;
}

export interface PresenceUpdatedEvent {
  sessionId: string;
  participants: QuizSessionSnapshotParticipant[];
}

export interface QuestionStartedEvent {
  sessionId: string;
  question: QuizSessionSnapshotQuestion;
  endsAt: string;
}

export interface QuestionClosedEvent {
  sessionId: string;
  questionId: string;
  correctOptionId: string | null;
  answeredUsers: string[];
  answeredCount: number;
  participantCount: number;
  allAnswered: boolean;
  answers: Array<{
    userId: string;
    selectedOptionId: string | null;
    isCorrect: boolean;
    points: number;
    responseMs: number;
  }>;
}

export interface SessionFinishedEvent {
  sessionId: string;
  winner: { id?: string | null; name: string } | null;
  ranking: Array<{
    userId: string;
    name: string;
    score: number;
    totalResponseMs: number;
    rank?: number | null;
  }>;
}
