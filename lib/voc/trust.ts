import type { KnowledgeTrust } from "./types";

export type ConfidenceLabel = "high" | "medium" | "low";

/**
 * Trust Visualization（要件 #21）：スコアを大きな数値でそのまま見せず、
 * バッジと根拠の説明で表現する。
 */
export function getConfidenceLabel(score: number): ConfidenceLabel {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

export const CONFIDENCE_LABEL_TEXT: Record<ConfidenceLabel, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

export function buildTrustExplanation(trust: KnowledgeTrust): string[] {
  const lines = [...trust.reason];
  if (trust.multipleSourceSupport) lines.push("複数ソースからの裏付けあり");
  if (trust.officialCorroboration) lines.push("公式情報との整合を確認済み");
  return lines;
}
