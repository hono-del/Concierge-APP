import { prisma } from "../prisma";
import type {
  Contributor,
  ExpertQuestion,
  ExpertQuestionDetail,
  KnowledgeItem,
  RawVocItem,
  VocSource,
} from "../types";
import {
  mapContributor,
  mapExpertAnswer,
  mapExpertQuestion,
  mapKnowledgeItem,
  mapRawVoc,
  mapSource,
} from "./mappers";

export async function listSources(): Promise<VocSource[]> {
  const rows = await prisma.source.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(mapSource);
}

export async function getSource(id: string): Promise<VocSource | null> {
  const row = await prisma.source.findUnique({ where: { id } });
  return row ? mapSource(row) : null;
}

export async function listRawVocBySource(sourceId: string): Promise<RawVocItem[]> {
  const rows = await prisma.rawVoc.findMany({
    where: { sourceId },
    include: { knowledge: { select: { id: true } } },
    orderBy: { collectedAt: "desc" },
  });
  return rows.map(mapRawVoc);
}

export async function listRawVoc(): Promise<RawVocItem[]> {
  const rows = await prisma.rawVoc.findMany({
    include: { knowledge: { select: { id: true } } },
    orderBy: { collectedAt: "desc" },
  });
  return rows.map(mapRawVoc);
}

export async function getRawVoc(
  id: string
): Promise<{ raw: RawVocItem; source: VocSource; knowledge: KnowledgeItem | null } | null> {
  const row = await prisma.rawVoc.findUnique({
    where: { id },
    include: { knowledge: true, source: true },
  });
  if (!row) return null;
  return {
    raw: mapRawVoc(row),
    source: mapSource(row.source),
    knowledge: row.knowledge ? mapKnowledgeItem(row.knowledge) : null,
  };
}

export async function listKnowledge(): Promise<KnowledgeItem[]> {
  const rows = await prisma.knowledgeItem.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapKnowledgeItem);
}

export async function getKnowledge(id: string): Promise<KnowledgeItem | null> {
  const row = await prisma.knowledgeItem.findUnique({ where: { id } });
  return row ? mapKnowledgeItem(row) : null;
}

export async function listContributors(): Promise<Contributor[]> {
  const rows = await prisma.contributor.findMany({ orderBy: { points: "desc" } });
  return rows.map(mapContributor);
}

export async function getContributor(id: string): Promise<Contributor | null> {
  const row = await prisma.contributor.findUnique({ where: { id } });
  return row ? mapContributor(row) : null;
}

export async function listExpertQuestions(): Promise<ExpertQuestion[]> {
  const rows = await prisma.expertQuestion.findMany({
    include: { answers: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapExpertQuestion);
}

export async function getExpertQuestion(id: string): Promise<ExpertQuestionDetail | null> {
  const row = await prisma.expertQuestion.findUnique({
    where: { id },
    include: {
      answers: {
        include: { contributor: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!row) return null;
  return {
    ...mapExpertQuestion(row),
    answers: row.answers.map(mapExpertAnswer),
  };
}

export async function listPendingExpertAnswers() {
  const rows = await prisma.expertAnswer.findMany({
    where: { status: "pending" },
    include: { contributor: true, question: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((row) => ({
    answer: mapExpertAnswer(row),
    question: mapExpertQuestion(row.question),
  }));
}

/** Review Workflow詳細（要件 #17）：Question / Answer / Contributorをまとめて取得する */
export async function getExpertAnswerDetail(answerId: string) {
  const row = await prisma.expertAnswer.findUnique({
    where: { id: answerId },
    include: { contributor: true, question: true },
  });
  if (!row) return null;
  return {
    answer: mapExpertAnswer(row),
    question: mapExpertQuestion(row.question),
  };
}

/** Similar Knowledge（要件 #17）：同カテゴリの承認済みKnowledgeを類似事例として提示する */
export async function listKnowledgeByCategory(category: string, limit = 3): Promise<KnowledgeItem[]> {
  const rows = await prisma.knowledgeItem.findMany({
    where: { category, status: "approved" },
    orderBy: { trustScore: "desc" },
    take: limit,
  });
  return rows.map(mapKnowledgeItem);
}

/** Official Information（要件 #17）：同カテゴリの公式情報を提示する */
export async function getOfficialKnowledgeByCategory(category: string): Promise<KnowledgeItem | null> {
  const row = await prisma.knowledgeItem.findFirst({
    where: { category, sourceType: "official" },
    orderBy: { trustScore: "desc" },
  });
  return row ? mapKnowledgeItem(row) : null;
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
  const [total, official, expert, pendingReview, sources, allKnowledge] = await Promise.all([
    prisma.knowledgeItem.count(),
    prisma.knowledgeItem.count({ where: { sourceType: "official" } }),
    prisma.knowledgeItem.count({ where: { sourceType: "expert" } }),
    prisma.knowledgeItem.count({ where: { status: "review" } }),
    prisma.source.count(),
    prisma.knowledgeItem.count({ where: { sourceType: { notIn: ["official"] } } }),
  ]);
  return {
    totalKnowledge: total,
    officialKnowledge: official,
    vocKnowledge: allKnowledge - expert,
    expertKnowledge: expert,
    pendingReview,
    sources,
  };
}

export async function getKnowledgeByCategory(): Promise<{ category: string; count: number }[]> {
  const rows = await prisma.knowledgeItem.groupBy({
    by: ["category"],
    _count: { category: true },
  });
  return rows
    .map((r) => ({ category: r.category, count: r._count.category }))
    .sort((a, b) => b.count - a.count);
}
