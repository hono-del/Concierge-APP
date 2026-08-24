import { Award, Car, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/voc/ui/badge";
import { Card } from "@/components/voc/ui/card";
import { listExpertQuestions } from "@/lib/voc/data/queries";
import { formatRelativeDate } from "@/lib/voc/labels";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  open: "回答受付中",
  answered: "回答あり",
  resolved: "解決済み",
};

const STATUS_VARIANT: Record<string, "secondary" | "warning" | "success"> = {
  open: "warning",
  answered: "secondary",
  resolved: "success",
};

export default async function CommunityFeedPage() {
  const questions = await listExpertQuestions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Expert Community
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Contributor Network</h1>
          <p className="mt-1 text-sm text-slate-500">
            公式情報だけでは分からない「実際に効いた確認・対処」を、オーナー・整備士・販売店スタッフが共有します。
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <Link key={q.id} href={`/community/questions/${q.id}`}>
            <Card className="p-4 transition-colors hover:border-slate-400">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Car className="h-3 w-3" />
                      {q.vehicleModel}
                    </Badge>
                    <Badge variant={STATUS_VARIANT[q.status]}>{STATUS_LABEL[q.status]}</Badge>
                  </div>
                  <p className="text-base font-semibold text-slate-900">{q.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {q.questionText}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Award className="h-3.5 w-3.5" />+{q.rewardPoints}pt
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {q.answerCount} Answers
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    {formatRelativeDate(q.createdAt)}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
