import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, SectionLabel } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { formatDateTime } from "@/lib/utils";
import type { CaseStatus, SupportCaseDetailResponse } from "@/types";

const statusMeta: Record<CaseStatus, { label: string; variant: "success" | "attention" | "danger" | "info" }> = {
  in_progress: { label: "対応中", variant: "info" },
  escalated: { label: "エスカレーション済み", variant: "attention" },
  solved: { label: "解決", variant: "success" },
  not_solved: { label: "未解決", variant: "danger" },
};

const outcomeLabel: Record<string, string> = {
  solved: "解決",
  not_solved: "未解決",
  need_info: "追加情報が必要",
  dealer: "販売店へエスカレーション",
  technical_support: "技術支援へエスカレーション",
};

const channelLabel: Record<string, string> = {
  owner: "Owner",
  call_center: "コールセンター",
  dealer: "販売店",
};

interface CaseSummaryProps {
  detail: SupportCaseDetailResponse;
}

export function CaseSummary({ detail }: CaseSummaryProps) {
  const { case: supportCase, user, vehicle } = detail;
  const status = statusMeta[supportCase.status];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SectionLabel>Customer / Case</SectionLabel>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Customer</p>
            <p className="mt-0.5 flex items-center gap-2 text-base font-bold text-text">
              <IconGlyph name="users" size={16} className="text-secondary" />
              {user.displayName}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Vehicle</p>
            <p className="mt-0.5 flex items-center gap-2 text-base font-bold text-text">
              <IconGlyph name="car" size={16} className="text-secondary" />
              {vehicle.model}（{vehicle.modelYear}年式）
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Issue</p>
            <p className="mt-0.5 text-base font-bold text-text">{supportCase.issueText}</p>
          </div>

          {supportCase.answers.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Checked</p>
              <ul className="mt-1 space-y-1">
                {supportCase.answers.map((answer) => (
                  <li key={answer.questionCode} className="flex items-center gap-2 text-sm text-text">
                    <IconGlyph name="check-circle" size={14} className="text-success" />
                    {answer.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-secondary">まだ確認済みの項目はありません。</p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <SectionLabel>History</SectionLabel>
          {supportCase.resolutionEvents.length === 0 ? (
            <p className="mt-2 text-sm text-secondary">対応履歴はまだありません。</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {supportCase.resolutionEvents.map((event) => (
                <li key={event.id} className="text-sm text-text">
                  <span className="font-semibold">{outcomeLabel[event.outcome] ?? event.outcome}</span>
                  <span className="text-secondary">
                    {" "}
                    ・{channelLabel[event.channel] ?? event.channel} ・{formatDateTime(event.occurredAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
