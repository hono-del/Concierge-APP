"use server";

import { revalidatePath } from "next/cache";
import { collectFromUrl } from "../adapters/registry";
import { getMockStructuredResult } from "../ai/structuring";
import { toKnowledgeCreateData } from "../data/mappers";
import { prisma } from "../prisma";
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
  const source = await prisma.source.findUnique({ where: { id: sourceId } });
  if (!source) throw new Error("Source not found");

  const result = await collectFromUrl(source.url);

  let newCount = 0;
  for (const item of result.items) {
    const exists = await prisma.rawVoc.findFirst({ where: { sourceUrl: item.sourceUrl } });
    if (exists) continue;
    await prisma.rawVoc.create({
      data: {
        sourceId,
        rawTitle: item.rawTitle,
        rawText: item.rawText,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
        status: "new",
      },
    });
    newCount++;
  }

  const totalCount = await prisma.rawVoc.count({ where: { sourceId } });
  await prisma.source.update({
    where: { id: sourceId },
    data: { lastCollectedAt: new Date(), collectedItems: totalCount },
  });

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
  };
}

/**
 * AI Structuring（要件 #7）。Mock Modeでは事前定義の構造化結果を返す。
 * 対応する事前定義がない場合（Live Collectionで取得した未知のVoCなど）は簡易フォールバックを生成する。
 */
export async function structureKnowledge(rawVocId: string): Promise<{ id: string }> {
  const raw = await prisma.rawVoc.findUnique({ where: { id: rawVocId } });
  if (!raw) throw new Error("RawVoc not found");

  const existing = await prisma.knowledgeItem.findUnique({ where: { rawVocId } });
  if (existing) return { id: existing.id };

  const mock = getMockStructuredResult(rawVocId);
  const base = mock ?? buildGenericFallback(raw);

  const created = await prisma.knowledgeItem.create({
    data: toKnowledgeCreateData(base, "review"),
  });

  await prisma.rawVoc.update({ where: { id: rawVocId }, data: { status: "structured" } });

  revalidatePath(`/studio/collection/${rawVocId}`);
  revalidatePath("/studio");
  revalidatePath(`/studio/knowledge/${created.id}`);

  return { id: created.id };
}

export interface KnowledgeUpdateInput {
  issueTitle?: string;
  status?: "draft" | "review" | "approved" | "rejected";
  tips?: string[];
}

/** Knowledge Detail画面での編集（要件 #8：編集可能にする） */
export async function updateKnowledge(id: string, input: KnowledgeUpdateInput) {
  await prisma.knowledgeItem.update({
    where: { id },
    data: {
      issueTitle: input.issueTitle,
      status: input.status,
      tipsJson: input.tips ? JSON.stringify(input.tips) : undefined,
    },
  });
  revalidatePath(`/studio/knowledge/${id}`);
  revalidatePath("/studio");
}

export async function toggleSourceStatus(sourceId: string) {
  const source = await prisma.source.findUnique({ where: { id: sourceId } });
  if (!source) throw new Error("Source not found");
  const nextStatus = source.status === "disabled" ? "active" : "disabled";
  await prisma.source.update({ where: { id: sourceId }, data: { status: nextStatus } });
  revalidatePath("/studio/sources");
}
