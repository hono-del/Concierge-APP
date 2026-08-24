import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { formatDateTime } from "@/lib/utils";
import type { OtaUpdate } from "@/types";

interface WhatsNewSummaryCardProps {
  otaUpdate: OtaUpdate;
}

export function WhatsNewSummaryCard({ otaUpdate }: WhatsNewSummaryCardProps) {
  return (
    <Link href="/owner/whats-new" className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardBody className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-success">
            <IconGlyph name="check-circle" size={20} />
          </span>
          <div className="flex-1">
            <p className="text-base font-bold text-text">車両が更新されました</p>
            <p className="mt-1 text-sm text-secondary">{otaUpdate.summary}</p>
            <p className="mt-1 text-xs text-secondary">
              {formatDateTime(otaUpdate.appliedAt)} ・ あなたに関係する変更：{otaUpdate.changes.length}件
            </p>
          </div>
          <IconGlyph name="chevron-right" size={18} className="mt-2 shrink-0 text-secondary" />
        </CardBody>
      </Card>
    </Link>
  );
}
