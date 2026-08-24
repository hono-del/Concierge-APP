/**
 * データ読み取り層 — インメモリストアから取得
 * Prisma/SQLiteへの依存を除去し、Vercel含むあらゆる環境で動作する。
 */

import { store } from "./store";
import type {
  Contributor,
  ExpertQuestion,
  ExpertQuestionDetail,
  KnowledgeItem,
  RawVocItem,
  VocSource,
} from "../types";

export async function listSources(): Promise<VocSource[]> {
  return [...store.sources].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getSource(id: string): Promise<VocSource | null> {
  return store.sources.find((s) => s.id === id) ?? null;
}

export async function listRawVocBySource(sourceId: string): Promise<RawVocItem[]> {
  return store.rawVocs
    .filter((r) => r.sourceId === sourceId)
    .sort((a, b) => b.collectedAt.localeCompare(a.collectedAt));
}

export async function listRawVoc(): Promise<RawVocItem[]> {
  return [...store.rawVocs].sort((a, b) => b.collectedAt.localeCompare(a.collectedAt));
}

export async function getRawVoc(
  id: string
): Promise<{ raw: RawVocItem; source: VocSource; knowledge: KnowledgeItem | null } | null> {
  const raw = store.rawVocs.find((r) => r.id === id);
  if (!raw) return null;
  const source = store.sources.find((s) => s.id === raw.sourceId);
  if (!source) return null;
  const knowledge = store.knowledge.find((k) => k.rawVocId === id) ?? null;
  return { raw, source, knowledge };
}

export async function listKnowledge(): Promise<KnowledgeItem[]> {
  return [...store.knowledge].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getKnowledge(id: string): Promise<KnowledgeItem | null> {
  return store.knowledge.find((k) => k.id === id) ?? null;
}

export async function listContributors(): Promise<Contributor[]> {
  return [...store.contributors].sort((a, b) => b.points - a.points);
}

export async function getContributor(id: string): Promise<Contributor | null> {
  return store.contributors.find((c) => c.id === id) ?? null;
}

export async function listExpertQuestions(): Promise<ExpertQuestion[]> {
  return [...store.questions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getExpertQuestion(id: string): Promise<ExpertQuestionDetail | null> {
  const q = store.questions.find((q) => q.id === id);
  if (!q) return null;
  const answers = store.answers.filter((a) => a.questionId === id).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );
  return { ...q, answers };
}

export async function listPendingExpertAnswers() {
  return store.answers
    .filter((a) => a.status === "pending")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((answer) => {
      const question = store.questions.find((q) => q.id === answer.questionId)!;
      return { answer, question };
    });
}

export async function getExpertAnswerDetail(answerId: string) {
  const answer = store.answers.find((a) => a.id === answerId);
  if (!answer) return null;
  const question = store.questions.find((q) => q.id === answer.questionId);
  if (!question) return null;
  return { answer, question };
}

export async function listKnowledgeByCategory(
  category: string,
  limit = 3
): Promise<KnowledgeItem[]> {
  return store.knowledge
    .filter((k) => k.category === category && k.status === "approved")
    .sort((a, b) => b.trust.score - a.trust.score)
    .slice(0, limit);
}

export async function getOfficialKnowledgeByCategory(
  category: string
): Promise<KnowledgeItem | null> {
  return (
    store.knowledge
      .filter((k) => k.category === category && k.source.type === "official")
      .sort((a, b) => b.trust.score - a.trust.score)[0] ?? null
  );
}

export interface DashboardStats {
  totalKnowledge: number;
  officialKnowledge: number;
  vocKnowledge: number;
  expertKnowledge: number;
  pendingReview: number;
  sources: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const k = store.knowledge;
  const total = k.length;
  const official = k.filter((i) => i.source.type === "official").length;
  const expert = k.filter((i) => i.source.type === "expert").length;
  const pendingReview = k.filter((i) => i.status === "review").length;
  const sources = store.sources.length;
  const vocKnowledge = k.filter((i) => i.source.type !== "official").length - expert;
  return { totalKnowledge: total, officialKnowledge: official, vocKnowledge, expertKnowledge: expert, pendingReview, sources };
}

export async function getKnowledgeByCategory(): Promise<{ category: string; count: number }[]> {
  const map = new Map<string, number>();
  for (const k of store.knowledge) {
    map.set(k.category, (map.get(k.category) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
