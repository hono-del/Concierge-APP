/**
 * Dashboard集計ロジック（Prisma/Node.js依存なし）。
 * サーバー（queries.ts）とクライアント（localStorageマージ後の再集計）の両方で使う。
 */

import type { KnowledgeItem } from "./types";

export interface DashboardStats {
  totalKnowledge: number;
  officialKnowledge: number;
  vocKnowledge: number;
  expertKnowledge: number;
  pendingReview: number;
  sources: number;
}

export function computeDashboardStats(all: KnowledgeItem[], sourcesCount: number): DashboardStats {
  const total = all.length;
  const official = all.filter((i) => i.source.type === "official").length;
  const expert = all.filter((i) => i.source.type === "expert").length;
  const pendingReview = all.filter((i) => i.status === "review").length;
  const vocKnowledge = all.filter((i) => i.source.type !== "official").length - expert;
  return {
    totalKnowledge: total,
    officialKnowledge: official,
    vocKnowledge,
    expertKnowledge: expert,
    pendingReview,
    sources: sourcesCount,
  };
}

export function computeKnowledgeByCategory(all: KnowledgeItem[]): { category: string; count: number }[] {
  const map = new Map<string, number>();
  for (const k of all) {
    map.set(k.category, (map.get(k.category) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
