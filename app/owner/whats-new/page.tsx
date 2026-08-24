import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph, type IconName } from "@/components/ui/IconGlyph";
import { formatDateTime } from "@/lib/utils";
import { demoOtaUpdate } from "@/lib/mock-data";
import type { OtaChangeItem } from "@/types";

const presentationMeta: Record<
  OtaChangeItem["presentation"],
  { label: string; icon: IconName }
> = {
  short: { label: "短文", icon: "chat" },
  image: { label: "画像案内", icon: "sparkles" },
  steps: { label: "3ステップガイド", icon: "book" },
  video: { label: "30秒動画風UI", icon: "bolt" },
};

export default function WhatsNewPage() {
  return (
    <div>
      <PageHeader title="What's New" backHref="/owner" />
      <div className="flex flex-col gap-5 px-4 py-5">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardBody>
            <div className="flex items-center gap-2">
              <IconGlyph name="check-circle" size={22} />
              <p className="text-base font-bold">Your vehicle has been updated</p>
            </div>
            <p className="mt-2 text-sm text-white/90">{demoOtaUpdate.summary}</p>
            <p className="mt-2 text-xs text-white/70">
              {formatDateTime(demoOtaUpdate.appliedAt)} ・ ソフトウェアバージョン {demoOtaUpdate.version}
            </p>
          </CardBody>
        </Card>

        <div>
          <p className="mb-2 text-sm font-semibold text-text">
            あなたに関係する変更：{demoOtaUpdate.changes.length}件
          </p>
          <div className="flex flex-col gap-3">
            {demoOtaUpdate.changes.map((change) => {
              const meta = presentationMeta[change.presentation];
              return (
                <Card key={change.id}>
                  <CardBody className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-text">{change.title}</p>
                      <Badge variant="info" icon={meta.icon}>
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary">{change.description}</p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
