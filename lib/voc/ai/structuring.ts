import { seedKnowledge } from "../mock-data/knowledge";
import { SAFETY_CRITICAL_KEYWORDS } from "../types";
import type { KnowledgeCategory, KnowledgeItem, SafetyLevel } from "../types";
import { detectQuickCategory } from "./chat-engine";

/**
 * AI Structuring（要件 #7, #10）のMock実装。
 * Mock Modeでは、対象のRaw VoCに対応する事前定義済みの構造化結果を返す。
 * 実AI接続時（api mode）でも失敗時はここへフォールバックする。
 */
export function getMockStructuredResult(rawVocId: string): Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt" | "status"> | null {
  const seed = seedKnowledge.find((k) => k.rawVocId === rawVocId);
  if (!seed) return null;
  return {
    vehicle: seed.vehicle,
    category: seed.category,
    issueTitle: seed.issueTitle,
    symptom: seed.symptom,
    conditions: seed.conditions,
    possibleCauses: seed.possibleCauses,
    checks: seed.checks,
    resolutions: seed.resolutions,
    tips: seed.tips,
    source: seed.source,
    trust: seed.trust,
    safety: seed.safety,
    rawVocId,
  };
}

/** Safety Gate（要件 #12, #22）：安全に直結するキーワードを含むかを判定する */
export function detectSafetyLevel(text: string): SafetyLevel {
  return SAFETY_CRITICAL_KEYWORDS.some((kw) => text.includes(kw)) ? "high" : "low";
}

/**
 * Review Workflow（要件 #17〜19）で、承認されたExpert AnswerをKnowledgeItemへ構造化するMockロジック。
 * 事前定義の対応（低速時異音の質問など）がある場合はそちらを優先し、
 * ない場合（デモ中に新規生成される質問など）は回答テキストから簡易構造化する。
 */
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
    checks: [{ order: 1, action: "有識者回答の内容に沿って確認する", reason: "Expert Communityで承認された回答です" }],
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
