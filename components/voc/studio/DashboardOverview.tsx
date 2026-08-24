"use client";

import { AlertCircle, BookMarked, Database, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SourceBadge } from "@/components/voc/SourceBadge";
import { KpiCard } from "@/components/voc/studio/KpiCard";
import { Badge } from "@/components/voc/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/voc/ui/card";
import { getLocalKnowledgeItems } from "@/lib/voc/client-store";
import { computeDashboardStats, computeKnowledgeByCategory, type DashboardStats } from "@/lib/voc/dashboard-utils";
import { CATEGORY_LABELS } from "@/lib/voc/labels";
import type { KnowledgeItem } from "@/lib/voc/types";

interface DashboardOverviewProps {
  initialStats: DashboardStats;
  initialCategories: { category: string; count: number }[];
  initialRecentKnowledge: KnowledgeItem[];
  pendingAnswerCount: number;
}

export function DashboardOverview({
  initialStats,
  initialCategories,
  initialRecentKnowledge,
  pendingAnswerCount,
}: DashboardOverviewProps) {
  const [stats, setStats] = useState(initialStats);
  const [categories, setCategories] = useState(initialCategories);
  const [recentKnowledge, setRecentKnowledge] = useState(initialRecentKnowledge);

  const recompute = useCallback(() => {
    const local = getLocalKnowledgeItems();
    if (local.length === 0) {
      setRecentKnowledge(initialRecentKnowledge);
      setStats(initialStats);
      setCategories(initialCategories);
      return;
    }

    const existingIds = new Set(initialRecentKnowledge.map((k) => k.id));
    const newOnes = local.filter((k) => !existingIds.has(k.id));
    if (newOnes.length === 0) return;

    const merged = [...newOnes, ...initialRecentKnowledge].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );

    setRecentKnowledge(merged);
    setStats(computeDashboardStats(merged, initialStats.sources));
    setCategories(computeKnowledgeByCategory(merged));
  }, [initialRecentKnowledge, initialStats, initialCategories]);

  useEffect(() => {
    recompute();
    // クライアントサイドナビゲーションでコンポーネントが再マウントされず
    // 古い状態のままになるケースに備え、画面へ戻ってきた時にも再計算する
    window.addEventListener("focus", recompute);
    document.addEventListener("visibilitychange", recompute);
    return () => {
      window.removeEventListener("focus", recompute);
      document.removeEventListener("visibilitychange", recompute);
    };
  }, [recompute]);

  const maxCategoryCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total Knowledge" value={stats.totalKnowledge} icon={Database} />
        <KpiCard
          label="Official Knowledge"
          value={stats.officialKnowledge}
          icon={ShieldCheck}
          accent="official"
        />
        <KpiCard label="VoC Knowledge" value={stats.vocKnowledge} icon={MessageSquareText} accent="voc" />
        <KpiCard label="Expert Knowledge" value={stats.expertKnowledge} icon={Sparkles} accent="expert" />
        <KpiCard
          label="Pending Review"
          value={stats.pendingReview + pendingAnswerCount}
          icon={AlertCircle}
          accent="warning"
        />
        <KpiCard label="Sources" value={stats.sources} icon={BookMarked} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Knowledge</CardTitle>
            <Link href="/studio" className="text-xs font-medium text-slate-500 hover:text-slate-900">
              すべて見る
            </Link>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {recentKnowledge.slice(0, 6).map((k) => (
              <Link
                key={k.id}
                href={`/studio/knowledge/${k.id}`}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-100 px-3 py-2 hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{k.issueTitle}</p>
                  <p className="text-[11px] text-slate-400">
                    {CATEGORY_LABELS[k.category as keyof typeof CATEGORY_LABELS] ?? k.category} ・{" "}
                    {k.vehicle.powertrain ?? k.vehicle.model}
                  </p>
                </div>
                <SourceBadge sourceType={k.source.type} evidenceCount={k.resolutions[0]?.evidenceCount} />
                <Badge variant={k.status === "approved" ? "success" : "secondary"} className="shrink-0">
                  {k.status}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Knowledge by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {categories.map((c) => (
              <div key={c.category}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    {CATEGORY_LABELS[c.category as keyof typeof CATEGORY_LABELS] ?? c.category}
                  </span>
                  <span className="tabular-nums text-slate-400">{c.count}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-900"
                    style={{ width: `${(c.count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
