import Link from "next/link";
import { AgentAssistPanel } from "@/components/agent/AgentAssistPanel";
import { CaseSummary } from "@/components/agent/CaseSummary";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CaseNotFoundError,
  getCaseDetailForAgent,
} from "@/repositories/fixture/support-case-repository";

export default async function AgentCasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;

  try {
    const detail = getCaseDetailForAgent(caseId);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text">Customer Case</h1>
          <Link href="/agent">
            <Button variant="ghost" size="sm">
              一覧へ戻る
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
          <CaseSummary detail={detail} />
          <AgentAssistPanel
            caseId={detail.case.id}
            caseStatus={detail.case.status}
            nextQuestion={detail.nextQuestion}
            nextQuestionReason={detail.nextQuestionReason}
            causes={detail.causes}
            recommendedGuidanceOfficial={detail.recommendedGuidanceOfficial}
            recommendedGuidanceCommunity={detail.recommendedGuidanceCommunity}
            evidence={detail.evidence}
          />
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof CaseNotFoundError) {
      return (
        <EmptyState
          icon="search"
          title="ケースが見つかりません"
          description="デモがリセットされたか、無効なケースIDです。Agent Dashboardから確認してください。"
          action={
            <Link href="/agent">
              <Button size="sm">Agent Dashboardへ戻る</Button>
            </Link>
          }
        />
      );
    }
    throw error;
  }
}
