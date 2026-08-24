/**
 * Prisma / Node.js 依存を持たない純粋な関数群。
 * Client Component からもインポートできます。
 */

import { SAFETY_CRITICAL_KEYWORDS } from "../types";
import type { KnowledgeCategory, KnowledgeItem, SafetyLevel } from "../types";

// ─── カテゴリ検出 ──────────────────────────────────────────────────────────────

const DOOR_KEYWORDS = ["ドア", "e-latch", "elatch", "イーラッチ"];
const NOISE_KEYWORDS = ["異音", "音がする", "コトコト", "カタカタ"];
const BATTERY_KEYWORDS = ["バッテリー", "上がった", "12v"];
const INFOTAINMENT_KEYWORDS = [
  "bluetooth",
  "ブルートゥース",
  "carplay",
  "カープレイ",
  "ナビ",
  "フリーズ",
  "画面",
];
const WARNING_KEYWORDS = ["警告灯", "警告ランプ"];

function normalize(text: string): string {
  return text.toLowerCase();
}

export function detectQuickCategory(text: string): KnowledgeCategory | null {
  const t = normalize(text);
  if (DOOR_KEYWORDS.some((k) => t.includes(k))) return "door";
  if (NOISE_KEYWORDS.some((k) => t.includes(k))) return "noise";
  if (BATTERY_KEYWORDS.some((k) => t.includes(k))) return "battery";
  if (INFOTAINMENT_KEYWORDS.some((k) => t.includes(k))) return "infotainment";
  if (WARNING_KEYWORDS.some((k) => t.includes(k))) return "warning";
  return null;
}

// ─── 安全レベル検出 ────────────────────────────────────────────────────────────

export function detectSafetyLevel(text: string): SafetyLevel {
  return SAFETY_CRITICAL_KEYWORDS.some((kw) => text.includes(kw)) ? "high" : "low";
}

// ─── Expert Answer 構造化 ──────────────────────────────────────────────────────

export function buildStructuredFromExpertAnswer(params: {
  questionTitle: string;
  questionVehicleModel: string;
  symptoms: string[];
  conditions: string[];
  answerText: string;
  contributorName: string;
  contributorBadge: string;
}): Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt" | "status"> {
  const category: KnowledgeCategory =
    detectQuickCategory(`${params.questionTitle} ${params.answerText}`) ?? "other";
  const safetyLevel = detectSafetyLevel(`${params.questionTitle} ${params.answerText}`);

  return {
    vehicle: { maker: "LEXUS", model: "NX", powertrain: params.questionVehicleModel },
    category,
    issueTitle: params.questionTitle,
    symptom: params.symptoms.length > 0 ? params.symptoms : [params.questionTitle],
    conditions: { timing: params.conditions.join(" / ") || undefined },
    possibleCauses: [{ label: "有識者の回答に基づく推定原因", confidence: 0.6 }],
    checks: [
      {
        order: 1,
        action: "有識者回答の内容に沿って確認する",
        reason: "Expert Communityで承認された回答です",
      },
    ],
    resolutions: [{ action: params.answerText, outcome: "Expert Community回答", evidenceCount: 1 }],
    tips: [],
    source: {
      type: "expert",
      title: `Expert Community回答（${params.contributorName} / ${params.contributorBadge}）`,
      author: params.contributorName,
    },
    trust: {
      score: 75,
      reason: ["Expert Communityで承認された回答", `${params.contributorBadge}による回答`],
      officialCorroboration: false,
      multipleSourceSupport: false,
    },
    safety: {
      level: safetyLevel,
      requiresOfficialConfirmation: safetyLevel === "high",
      notes:
        safetyLevel === "high"
          ? ["安全に関わる可能性があるため、公式情報・専門スタッフでの確認を優先してください"]
          : undefined,
    },
  };
}
