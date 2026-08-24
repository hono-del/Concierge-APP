import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { MetricCard } from "@/components/manufacturer/MetricCard";
import { formatPercent } from "@/lib/utils";
import {
  demoCxImprovementActions,
  demoCxInsights,
  demoCxIssueSummary,
} from "@/lib/mock-data";
import { listCases } from "@/repositories/fixture/case-store";

export default function CxIntelligencePage() {
  const cases = listCases();
  const solvedInSession = cases.filter((item) => item.status === "solved").length;
  const escalatedInSession = cases.filter((item) => item.status === "escalated").length;

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="cx-dashboard-heading">
        <div className="mb-3 flex items-center justify-between">
          <h1 id="cx-dashboard-heading" className="text-xl font-bold text-text">
            CX Dashboard
          </h1>
          <Badge variant="neutral">デモデータ</Badge>
        </div>
        <p className="mb-4 text-sm text-secondary">
          Owner・Agent双方から得られる利用・解決ログを集計し、情報改善につなげます。以下はデモ用の固定集計値です。
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label={demoCxIssueSummary.issueTitle}
            value={`${demoCxIssueSummary.totalCases} cases`}
            icon="chart-bar"
          />
          <MetricCard
            label="Self Resolved"
            value={formatPercent(demoCxIssueSummary.selfResolvedRate)}
            icon="check-circle"
            tone="success"
          />
          <MetricCard
            label="Call Center"
            value={formatPercent(demoCxIssueSummary.callCenterRate)}
            icon="headset"
            tone="attention"
          />
          <MetricCard
            label="Dealer"
            value={formatPercent(demoCxIssueSummary.dealerRate)}
            icon="car"
            tone="danger"
          />
        </div>
      </section>

      <section aria-labelledby="live-demo-heading">
        <h2 id="live-demo-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">
          本デモセッションでの実績（ライブ）
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard label="作成されたケース" value={`${cases.length}件`} icon="chat" />
          <MetricCard label="Ownerで解決" value={`${solvedInSession}件`} icon="check-circle" tone="success" />
          <MetricCard
            label="Agentへエスカレーション"
            value={`${escalatedInSession}件`}
            icon="headset"
            tone="attention"
          />
        </div>
      </section>

      <section aria-labelledby="insight-heading">
        <h2 id="insight-heading" className="mb-3 text-xl font-bold text-text">
          AI Insight
        </h2>
        <div className="flex flex-col gap-3">
          {demoCxInsights.map((insight) => (
            <Card key={insight.id}>
              <CardBody className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <IconGlyph name="sparkles" size={18} />
                </span>
                <div>
                  <p className="text-base font-bold text-text">{insight.title}</p>
                  <p className="mt-1 text-sm text-secondary">{insight.description}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="improvement-heading">
        <h2 id="improvement-heading" className="mb-3 text-xl font-bold text-text">
          Knowledge Improvement
        </h2>
        <div className="flex flex-col gap-3">
          {demoCxImprovementActions.map((action) => (
            <Card key={action.id}>
              <CardBody className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-success">
                  <IconGlyph name="book" size={18} />
                </span>
                <div>
                  <p className="text-base font-bold text-text">{action.title}</p>
                  <p className="mt-1 text-sm text-secondary">{action.description}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
