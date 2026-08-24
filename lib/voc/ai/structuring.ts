import { seedKnowledge } from "../mock-data/knowledge";
import type { KnowledgeItem } from "../types";

export { buildStructuredFromExpertAnswer, detectSafetyLevel } from "./pure-utils";

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
