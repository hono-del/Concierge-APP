import {
  AlertCircle,
  BookMarked,
  Database,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { SourceBadge } from "@/components/voc/SourceBadge";
import { KpiCard } from "@/components/voc/studio/KpiCard";
import { Badge } from "@/components/voc/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/voc/ui/card";
import {
  getDashboardStats,
  getKnowledgeByCategory,
  listKnowledge,
  listPendingExpertAnswers,
  listRawVoc,
} from "@/lib/voc/data/queries";
import { CATEGORY_LABELS, formatRelativeDate } from "@/lib/voc/labels";

export const dynamic = "force-dynamic";

export default async function StudioDashboardPage() {
  const [stats, categories, recentKnowledge, recentRawVoc, pendingAnswers] = await Promise.all([
    getDashboardStats(),
    getKnowledgeByCategory(),
    listKnowledge(),
    listRawVoc(),
    listPendingExpertAnswers(),
  ]);

  const maxCategoryCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Knowledge Studio
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Web / VoCの収集から構造化・信頼性評価・承認までを一望し、Knowledgeが育つ様子を確認できます。
        </p>
      </div>

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
          value={stats.pendingReview + pendingAnswers.length}
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
                    {CATEGORY_LABELS[k.category]} ・ {k.vehicle.powertrain ?? k.vehicle.model}
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Collections</CardTitle>
            <Link href="/studio/sources" className="text-xs font-medium text-slate-500 hover:text-slate-900">
              Sourcesへ
            </Link>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {recentRawVoc.slice(0, 5).map((r) => (
              <Link
                key={r.id}
                href={`/studio/collection/${r.id}`}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-100 px-3 py-2 hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{r.rawTitle}</p>
                  <p className="text-[11px] text-slate-400">
                    {r.sourceName} ・ {formatRelativeDate(r.collectedAt)}
                  </p>
                </div>
                <Badge variant={r.status === "structured" ? "success" : "secondary"}>{r.status}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Pending Expert Answers</CardTitle>
            <Link href="/studio/review" className="text-xs font-medium text-slate-500 hover:text-slate-900">
              Reviewへ
            </Link>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {pendingAnswers.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">承認待ちの回答はありません</p>
            )}
            {pendingAnswers.map(({ answer, question }) => (
              <Link
                key={answer.id}
                href={`/studio/review/${answer.id}`}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-100 px-3 py-2 hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{question.title}</p>
                  <p className="truncate text-[11px] text-slate-400">
                    {answer.contributor.name} ・ {answer.contributor.badge}
                  </p>
                </div>
                <Badge variant="warning">Pending</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
