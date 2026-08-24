import { listExpertQuestions } from "@/lib/voc/data/queries";
import { CommunityFeed } from "@/components/voc/community/CommunityFeed";

export const dynamic = "force-dynamic";

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

      <CommunityFeed initialQuestions={questions} />
    </div>
  );
}
