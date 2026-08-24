import { Award, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/voc/ui/badge";
import { Card, CardContent } from "@/components/voc/ui/card";
import { listPendingExpertAnswers } from "@/lib/voc/data/queries";
import { formatRelativeDate } from "@/lib/voc/labels";

export const dynamic = "force-dynamic";

export default async function ReviewListPage() {
  const pending = await listPendingExpertAnswers();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Knowledge Studio</p>
        <h1 className="text-2xl font-bold text-slate-900">Review Workflow</h1>
        <p className="mt-1 text-sm text-slate-500">
          Expert Communityからの回答をレビューし、Knowledgeへ採用するか判断します。採用するとContributorへReward
          Pointが付与されます。
        </p>
      </div>

      <div className="space-y-2">
        {pending.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-slate-400">
              承認待ちの回答はありません。すべて処理済みです。
            </CardContent>
          </Card>
        )}
        {pending.map(({ answer, question }) => (
          <Link key={answer.id} href={`/studio/review/${answer.id}`}>
            <Card className="p-4 transition-colors hover:border-slate-400">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{question.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{answer.answerText}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{answer.contributor.name} ・ {answer.contributor.badge}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeDate(answer.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Award className="h-3.5 w-3.5" />+{question.rewardPoints}pt
                  </span>
                  <Badge variant="warning">Pending</Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
