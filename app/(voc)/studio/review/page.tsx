import { listPendingExpertAnswers } from "@/lib/voc/data/queries";
import { PendingAnswersFeed } from "@/components/voc/studio/PendingAnswersFeed";

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

      <PendingAnswersFeed
        initialItems={pending.map(({ answer, question }) => ({
          answerId: answer.id,
          answerText: answer.answerText,
          contributorName: answer.contributor.name,
          contributorBadge: answer.contributor.badge,
          questionTitle: question.title,
          questionRewardPoints: question.rewardPoints,
          createdAt: answer.createdAt,
        }))}
      />
    </div>
  );
}
