import Link from "next/link";
import { DashboardOverview } from "@/components/voc/studio/DashboardOverview";
import { PendingAnswersFeed } from "@/components/voc/studio/PendingAnswersFeed";
import { Badge } from "@/components/voc/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/voc/ui/card";
import {
  getDashboardStats,
  getKnowledgeByCategory,
  listKnowledge,
  listPendingExpertAnswers,
  listRawVoc,
} from "@/lib/voc/data/queries";
import { formatRelativeDate } from "@/lib/voc/labels";

export const dynamic = "force-dynamic";

export default async function StudioDashboardPage() {
  const [stats, categories, recentKnowledge, recentRawVoc, pendingAnswers] = await Promise.all([
    getDashboardStats(),
    getKnowledgeByCategory(),
    listKnowledge(),
    listRawVoc(),
    listPendingExpertAnswers(),
  ]);

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

      <DashboardOverview
        initialStats={stats}
        initialCategories={categories}
        initialRecentKnowledge={recentKnowledge}
        pendingAnswerCount={pendingAnswers.length}
      />

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
            <PendingAnswersFeed
              initialItems={pendingAnswers.map(({ answer, question }) => ({
                answerId: answer.id,
                answerText: answer.answerText,
                contributorName: answer.contributor.name,
                contributorBadge: answer.contributor.badge,
                questionTitle: question.title,
                questionRewardPoints: question.rewardPoints,
                createdAt: answer.createdAt,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
