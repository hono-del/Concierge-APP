/**
 * VoC Knowledge Platform — インメモリ・グローバルストア
 *
 * Vercelのサーバーレス環境ではインスタンス間でファイルシステムが共有されないため、
 * SQLite/Prismaの代わりにglobalThisに保持するMutableストアを使用する。
 * 同一プロセス内のServer ComponentとServer Action間でデータが共有される。
 * デプロイ・コールドスタート時はモックデータにリセットされる。
 */

import { seedContributors } from "../mock-data/contributors";
import { seedKnowledge } from "../mock-data/knowledge";
import { seedQuestions } from "../mock-data/questions";
import { seedRawVoc } from "../mock-data/raw-voc";
import { seedSources } from "../mock-data/sources";
import type {
  Contributor,
  ExpertAnswer,
  ExpertQuestion,
  KnowledgeItem,
  RawVocItem,
  VocSource,
} from "../types";

const SEED_DATE = "2026-06-20T00:00:00.000Z";

function buildStore() {
  const sources: VocSource[] = seedSources.map((s) => ({
    id: s.id,
    name: s.name,
    url: s.url,
    sourceType: s.sourceType,
    vehicleModel: s.vehicleModel,
    status: "active" as const,
    lastCollectedAt: null,
    collectedItems: seedRawVoc.filter((r) => r.sourceId === s.id).length,
    createdAt: SEED_DATE,
  }));

  const rawVocs: RawVocItem[] = seedRawVoc.map((r) => ({
    id: r.id,
    sourceId: r.sourceId,
    rawTitle: r.rawTitle,
    rawText: r.rawText,
    sourceName: r.sourceName,
    sourceUrl: r.sourceUrl,
    publishedAt: r.publishedAt,
    status: "structured" as const,
    collectedAt: SEED_DATE,
    hasKnowledge: seedKnowledge.some((k) => k.rawVocId === r.id),
  }));

  const knowledge: KnowledgeItem[] = seedKnowledge.map((k) => ({
    ...k,
    rawVocId: k.rawVocId ?? null,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  }));

  const contributors: Contributor[] = seedContributors.map((c) => ({
    ...c,
    vehicleModel: c.vehicleModel ?? null,
    createdAt: SEED_DATE,
  }));

  const answers: ExpertAnswer[] = [];
  const questions: ExpertQuestion[] = [];

  for (const q of seedQuestions) {
    for (const a of q.answers) {
      const contributor = contributors.find((c) => c.id === a.contributorId)!;
      answers.push({
        id: a.id,
        questionId: q.id,
        contributorId: a.contributorId,
        contributor,
        answerText: a.answerText,
        status: a.status,
        createdAt: SEED_DATE,
        knowledgeItemId: a.linkedKnowledgeId ?? null,
      });
    }
    questions.push({
      id: q.id,
      title: q.title,
      vehicleModel: q.vehicleModel,
      symptoms: q.symptoms,
      conditions: q.conditions,
      alreadyChecked: q.alreadyChecked,
      questionText: q.questionText,
      tags: q.tags,
      rewardPoints: q.rewardPoints,
      authorId: null,
      status: q.status,
      createdAt: SEED_DATE,
      answerCount: q.answers.length,
    });
  }

  return { sources, rawVocs, knowledge, contributors, questions, answers };
}

export type VocStore = ReturnType<typeof buildStore>;

const g = globalThis as Record<string, unknown>;

if (!g.__vocStore) {
  g.__vocStore = buildStore();
}

export const store = g.__vocStore as VocStore;
