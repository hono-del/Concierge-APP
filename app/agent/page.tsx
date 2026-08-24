import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { formatDateTime } from "@/lib/utils";
import { demoUser } from "@/lib/mock-data";
import { listCases } from "@/repositories/fixture/case-store";
import type { CaseStatus } from "@/types";

const statusMeta: Record<CaseStatus, { label: string; variant: "success" | "attention" | "danger" | "info" }> = {
  in_progress: { label: "対応中", variant: "info" },
  escalated: { label: "対応待ち", variant: "attention" },
  solved: { label: "解決", variant: "success" },
  not_solved: { label: "未解決", variant: "danger" },
};

function CaseListItem({
  caseId,
  issueText,
  status,
  updatedAt,
}: {
  caseId: string;
  issueText: string;
  status: CaseStatus;
  updatedAt: string;
}) {
  const meta = statusMeta[status];
  return (
    <Link href={`/agent/cases/${caseId}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardBody className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconGlyph name="users" size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-text">{demoUser.displayName}</p>
              <p className="text-sm text-secondary">{issueText}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-secondary">{formatDateTime(updatedAt)}</span>
            <Badge variant={meta.variant}>{meta.label}</Badge>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default function AgentDashboardPage() {
  const cases = listCases();
  const escalatedCases = cases.filter((item) => item.status === "escalated");
  const otherCases = cases.filter((item) => item.status !== "escalated");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-text">Agent Dashboard</h1>
        <p className="mt-1 text-sm text-secondary">
          Ownerから引き継がれた問い合わせ一覧です。対応が必要なケースから確認してください。
        </p>
      </div>

      {cases.length === 0 ? (
        <EmptyState
          icon="headset"
          title="まだ問い合わせはありません"
          description='Owner Concierge（U01 Home →「困りごとを相談する」）で「まだ解決していません」→「相談する」を選択すると、ここに表示されます。'
        />
      ) : (
        <div className="flex flex-col gap-6">
          {escalatedCases.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">
                対応待ち（{escalatedCases.length}件）
              </h2>
              <div className="flex flex-col gap-3">
                {escalatedCases.map((item) => (
                  <CaseListItem
                    key={item.id}
                    caseId={item.id}
                    issueText={item.issueText}
                    status={item.status}
                    updatedAt={item.updatedAt}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {otherCases.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">
                その他のケース（{otherCases.length}件）
              </h2>
              <div className="flex flex-col gap-3">
                {otherCases.map((item) => (
                  <CaseListItem
                    key={item.id}
                    caseId={item.id}
                    issueText={item.issueText}
                    status={item.status}
                    updatedAt={item.updatedAt}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
