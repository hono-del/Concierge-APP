export type AiMode = "mock" | "api";

/**
 * AI Mode切り替え（要件 #23）。
 * mock: 事前定義データのみで安定動作（デフォルト・デモ推奨）
 * api: 実AI呼び出しを試行する想定だが、本モックでは未接続のため常にmockへフォールバックする。
 */
export function getAiMode(): AiMode {
  const raw = process.env.NEXT_PUBLIC_AI_MODE;
  return raw === "api" ? "api" : "mock";
}

export const AI_STRUCTURING_STEPS = [
  "Reading VoC",
  "Extracting symptoms",
  "Finding resolution",
  "Evaluating trust",
  "Creating knowledge",
] as const;

export const AI_COLLECTION_STEPS = ["Connecting", "Collecting", "Analyzing"] as const;

export const AI_CHAT_THINKING_MESSAGES = [
  "同じNXの症状を探しています…",
  "条件が近い事例を比較しています…",
  "公式情報と照合しています…",
] as const;
