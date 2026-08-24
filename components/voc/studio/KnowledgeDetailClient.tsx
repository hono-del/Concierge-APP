"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SafetyNotice } from "@/components/voc/SafetyNotice";
import { SourceBadge } from "@/components/voc/SourceBadge";
import { TrustBadge } from "@/components/voc/TrustBadge";
import { KnowledgeEditor } from "@/components/voc/studio/KnowledgeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/voc/ui/card";
import { getLocalKnowledgeItem } from "@/lib/voc/client-store";
import { CATEGORY_LABELS } from "@/lib/voc/labels";
import type { KnowledgeItem } from "@/lib/voc/types";

interface KnowledgeDetailClientProps {
  id: string;
  serverKnowledge: KnowledgeItem | null;
}

export function KnowledgeDetailClient({ id, serverKnowledge }: KnowledgeDetailClientProps) {
  const [knowledge, setKnowledge] = useState<KnowledgeItem | null>(serverKnowledge);
  const [loading, setLoading] = useState(!serverKnowledge);

  useEffect(() => {
    if (serverKnowledge) return;
    setKnowledge(getLocalKnowledgeItem(id));
    setLoading(false);
  }, [id, serverKnowledge]);

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-400">読み込み中…</div>;
  }

  if (!knowledge) {
    return (
      <div className="space-y-4">
        <Link
          href="/studio"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboardへ戻る
        </Link>
        <p className="text-sm text-slate-500">このKnowledgeは見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/studio"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboardへ戻る
        </Link>
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Knowledge Detail</p>
          <SourceBadge sourceType={knowledge.source.type} evidenceCount={knowledge.resolutions[0]?.evidenceCount} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardContent className="pt-4">
              <KnowledgeEditor knowledge={knowledge} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle / Category</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 pt-0 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Vehicle</p>
                <p className="text-slate-800">
                  {knowledge.vehicle.maker} {knowledge.vehicle.model}
                  {knowledge.vehicle.powertrain ? ` (${knowledge.vehicle.powertrain})` : ""}
                  {knowledge.vehicle.grade ? ` / ${knowledge.vehicle.grade}` : ""}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Category</p>
                <p className="text-slate-800">
                  {CATEGORY_LABELS[knowledge.category as keyof typeof CATEGORY_LABELS] ?? knowledge.category}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Symptoms / Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <ul className="space-y-0.5 text-slate-700">
                {knowledge.symptom.map((s, i) => (
                  <li key={i}>・{s}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-500">
                条件：
                {[
                  knowledge.conditions.weather?.join("/"),
                  knowledge.conditions.temperature,
                  knowledge.conditions.vehicleState?.join("/"),
                  knowledge.conditions.frequency,
                  knowledge.conditions.timing,
                ]
                  .filter(Boolean)
                  .join(" ・ ") || "特記事項なし"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Possible Causes / Recommended Checks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <ul className="space-y-0.5 text-slate-700">
                {knowledge.possibleCauses.map((c, i) => (
                  <li key={i}>
                    ・{c.label}
                    <span className="ml-1 text-[11px] text-slate-400">（確信度 {Math.round(c.confidence * 100)}%）</span>
                  </li>
                ))}
              </ul>
              <ol className="space-y-0.5 text-slate-700">
                {knowledge.checks.map((c) => (
                  <li key={c.order}>
                    {c.order}. {c.action}
                    {c.reason && <span className="ml-1 text-[11px] text-slate-400">（{c.reason}）</span>}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolution</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm">
              <ul className="space-y-0.5 text-slate-700">
                {knowledge.resolutions.map((r, i) => (
                  <li key={i}>
                    ・{r.action}
                    {r.outcome && <span className="ml-1 text-[11px] text-slate-400">（{r.outcome}）</span>}
                    {r.evidenceCount ? (
                      <span className="ml-1 text-[11px] text-slate-400">・{r.evidenceCount}件の事例</span>
                    ) : null}
                  </li>
                ))}
                {knowledge.resolutions.length === 0 && <li className="text-slate-400">未登録</li>}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trust</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <TrustBadge trust={knowledge.trust} sourceType={knowledge.source.type} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <p className="text-sm capitalize text-slate-800">Level: {knowledge.safety.level}</p>
              <SafetyNotice safety={knowledge.safety} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <p className="text-slate-800">{knowledge.source.title}</p>
              {knowledge.source.author && <p className="text-xs text-slate-500">投稿者: {knowledge.source.author}</p>}
              {knowledge.source.url && (
                <a
                  href={knowledge.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline"
                >
                  {knowledge.source.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
