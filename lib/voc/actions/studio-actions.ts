"use server";

import { revalidatePath } from "next/cache";
import { collectFromUrl } from "../adapters/registry";
import { getMockStructuredResult } from "../ai/structuring";
import { store } from "../data/store";
import type { KnowledgeItem } from "../types";

export interface CollectSourceResult {
  live: boolean;
  fallbackReason?: string;
  newCount: number;
  totalCount: number;
}

/**
 * Source Management「Collect」アクション（要件 #5）。
 * Live Collectionを試行し、失敗時はDemo Snapshotへ自動フォールバックする。
 */
export async function collectSource(sourceId: string): Promise<CollectSourceResult> {
  const source = store.sources.find((s) => s.id === sourceId);
  if (!source) throw new Error("Source not found");

  const result = await collectFromUrl(source.url);

  const now = new Date().toISOString();
  let newCount = 0;

  for (const item of result.items) {
    const exists = store.rawVocs.some((r) => r.sourceUrl === item.sourceUrl);
    if (exists) continue;
    store.rawVocs.unshift({
      id: crypto.randomUUID(),
      sourceId,
      rawTitle: item.rawTitle,
      rawText: item.rawText,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      publishedAt: item.publishedAt ?? now,
      status: "new",
      collectedAt: now,
      hasKnowledge: false,
    });
    newCount++;
  }

  const totalCount = store.rawVocs.filter((r) => r.sourceId === sourceId).length;
  source.lastCollectedAt = now;
  source.collectedItems = totalCount;

  revalidatePath("/studio/sources");
  revalidatePath("/studio");

  return { live: result.live, fallbackReason: result.fallbackReason, newCount, totalCount };
}

function buildGenericFallback(raw: {
  rawTitle: string;
  sourceName: string;
  sourceUrl: string;
}): Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt" | "status"> {
  return {
    vehicle: { maker: "LEXUS", model: "NX" },
    category: "other",
    issueTitle: raw.rawTitle,
    symptom: [raw.rawTitle],
    conditions: {},
    possibleCauses: [{ label: "追加確認が必要です（自動抽出のため精度は限定的）", confidence: 0.3 }],
    checks: [{ order: 1, action: "症状の再現条件を記録し、公式サポートへの相談も検討する" }],
    resolutions: [],
    tips: [],
    source: { type: "community", title: raw.sourceName, url: raw.sourceUrl },
    trust: { score: 40, reason: ["未検証の投稿（自動抽出）"], officialCorroboration: false, multipleSourceSupport: false },
    safety: { level: "low", requiresOfficialConfirmation: false },
    rawVocId: null,
  };
}

/**
 * AI Structuring（要件 #7）。Mock Modeでは事前定義の構造化結果を返す。
 */
export async function structureKnowledge(rawVocId: string): Promise<{ id: string }> {
  const raw = store.rawVocs.find((r) => r.id === rawVocId);
  if (!raw) throw new Error("RawVoc not found");

  const existing = store.knowledge.find((k) => k.rawVocId === rawVocId);
  if (existing) return { id: existing.id };

  const mock = getMockStructuredResult(rawVocId);
  const base = mock ?? buildGenericFallback(raw);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  store.knowledge.unshift({
    ...base,
    id,
    rawVocId,
    status: "review",
    createdAt: now,
    updatedAt: now,
  });

  // RawVocのステータス更新
  raw.status = "structured";
  raw.hasKnowledge = true;

  revalidatePath(`/studio/collection/${rawVocId}`);
  revalidatePath("/studio");
  revalidatePath(`/studio/knowledge/${id}`);

  return { id };
}

export interface KnowledgeUpdateInput {
  issueTitle?: string;
  status?: "draft" | "review" | "approved" | "rejected";
  tips?: string[];
}

/** Knowledge Detail画面での編集（要件 #8：編集可能にする） */
export async function updateKnowledge(id: string, input: KnowledgeUpdateInput) {
  const k = store.knowledge.find((k) => k.id === id);
  if (!k) throw new Error("Knowledge not found");
  if (input.issueTitle !== undefined) k.issueTitle = input.issueTitle;
  if (input.status !== undefined) k.status = input.status;
  if (input.tips !== undefined) k.tips = input.tips;
  k.updatedAt = new Date().toISOString();

  revalidatePath(`/studio/knowledge/${id}`);
  revalidatePath("/studio");
}

export async function toggleSourceStatus(sourceId: string) {
  const source = store.sources.find((s) => s.id === sourceId);
  if (!source) throw new Error("Source not found");
  source.status = source.status === "disabled" ? "active" : "disabled";
  revalidatePath("/studio/sources");
}
