/**
 * クライアントサイドの一時ストア（localStorage）
 * Vercelのサーバーレス環境では globalThis が複数インスタンス間で共有されないため、
 * ユーザー操作で生成されたデータはブラウザに保存して永続化する。
 */

import type { ExpertQuestion } from "./types";

const KEYS = {
  questions: "voc_local_questions",
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

/** チャットから投稿した質問を保存する */
export function saveLocalQuestion(q: Pick<ExpertQuestion, "id" | "title" | "vehicleModel" | "questionText" | "tags" | "rewardPoints" | "symptoms" | "conditions" | "alreadyChecked">) {
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
