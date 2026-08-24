/**
 * クライアントサイドの一時ストア（localStorage）
 * Vercelのサーバーレス環境では globalThis が複数インスタンス間で共有されないため、
 * ユーザー操作で生成されたデータはブラウザに保存して永続化する。
 */

import type { ExpertQuestion, KnowledgeItem } from "./types";

const KEYS = {
  questions: "voc_local_questions",
  answers: "voc_local_answers",
  knowledge: "voc_local_knowledge",
} as const;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage が使えない環境（プライベートブラウジング等）では無視
  }
}

// ─── Questions ──────────────────────────────────────────────────────────────

/** チャットから投稿した質問を保存する */
export function saveLocalQuestion(
  q: Pick<
    ExpertQuestion,
    | "id"
    | "title"
    | "vehicleModel"
    | "questionText"
    | "tags"
    | "rewardPoints"
    | "symptoms"
    | "conditions"
    | "alreadyChecked"
  >
) {
  const existing = read<ExpertQuestion>(KEYS.questions);
  const newQ: ExpertQuestion = {
    ...q,
    authorId: null,
    status: "open",
    createdAt: new Date().toISOString(),
    answerCount: 0,
  };
  write(KEYS.questions, [newQ, ...existing]);
}

/** localStorage に保存された質問を返す */
export function getLocalQuestions(): ExpertQuestion[] {
  return read<ExpertQuestion>(KEYS.questions);
}

/** IDを指定して localStorage の質問を返す */
export function getLocalQuestion(id: string): ExpertQuestion | null {
  return getLocalQuestions().find((q) => q.id === id) ?? null;
}

// ─── Answers ────────────────────────────────────────────────────────────────

export interface LocalAnswer {
  id: string;
  questionId: string;
  questionTitle: string;
  questionVehicleModel: string;
  questionRewardPoints: number;
  questionTags: string[];
  questionSymptoms: string[];
  questionConditions: string[];
  contributorId: string;
  contributorName: string;
  contributorBadge: string;
  contributorKnowledgeLevel: number;
  contributorPoints: number;
  answerText: string;
  status: "pending" | "accepted";
  createdAt: string;
}

/** Expert Community で投稿した回答を保存する */
export function saveLocalAnswer(a: LocalAnswer) {
  const existing = read<LocalAnswer>(KEYS.answers);
  // 同じ ID が既にある場合は更新しない
  if (existing.some((e) => e.id === a.id)) return;
  write(KEYS.answers, [a, ...existing]);
}

/** IDを指定して localStorage の回答ステータスを accepted に更新する */
export function markLocalAnswerAccepted(id: string) {
  const all = read<LocalAnswer>(KEYS.answers);
  const updated = all.map((a) => (a.id === id ? { ...a, status: "accepted" as const } : a));
  write(KEYS.answers, updated);
}

/** localStorage に保存された回答を返す（pending のみ） */
export function getLocalAnswers(): LocalAnswer[] {
  return read<LocalAnswer>(KEYS.answers).filter((a) => a.status === "pending");
}

/** IDを指定して localStorage の回答を返す */
export function getLocalAnswer(id: string): LocalAnswer | null {
  return read<LocalAnswer>(KEYS.answers).find((a) => a.id === id) ?? null;
}

/** localStorage で accepted としてマーク済みの回答IDセットを返す */
export function getAcceptedLocalAnswerIds(): Set<string> {
  return new Set(
    read<LocalAnswer>(KEYS.answers)
      .filter((a) => a.status === "accepted")
      .map((a) => a.id)
  );
}

// ─── Knowledge ──────────────────────────────────────────────────────────────

/** Review Workflowで採用されたKnowledgeItemを保存する */
export function saveLocalKnowledge(k: KnowledgeItem) {
  const existing = read<KnowledgeItem>(KEYS.knowledge);
  if (existing.some((e) => e.id === k.id)) return;
  write(KEYS.knowledge, [k, ...existing]);
}

/** localStorage に保存されたKnowledgeItemを返す */
export function getLocalKnowledgeItems(): KnowledgeItem[] {
  return read<KnowledgeItem>(KEYS.knowledge);
}

/** IDを指定して localStorage のKnowledgeItemを返す */
export function getLocalKnowledgeItem(id: string): KnowledgeItem | null {
  return getLocalKnowledgeItems().find((k) => k.id === id) ?? null;
}
