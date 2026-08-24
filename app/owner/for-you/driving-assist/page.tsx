import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, SectionLabel } from "@/components/ui/Card";
import { IconGlyph, type IconName } from "@/components/ui/IconGlyph";
import { getDrivingAssistFeatures } from "@/lib/feature-data";
import type { FeatureUsageState } from "@/types";

const usageConfig: Record<
  FeatureUsageState,
  {
    label: string;
    variant: "success" | "attention" | "neutral" | "info";
    icon: IconName;
  }
> = {
  mastered:    { label: "習得済み",   variant: "success",   icon: "check-circle"   },
  in_use:      { label: "利用中",     variant: "info",      icon: "bolt"           },
  partial_use: { label: "一部利用中", variant: "attention", icon: "alert-triangle" },
  unused:      { label: "未使用",     variant: "neutral",   icon: "alert-triangle" },
};

export default function DrivingAssistPage() {
  const features = getDrivingAssistFeatures();

  const unusedCount = features.filter(
    (f) => f.usageStatus?.state === "unused"
  ).length;

  return (
    <div>
      <PageHeader title="運転支援・駐車支援" backHref="/owner" />
      <div className="flex flex-col gap-5 px-4 py-5">

        {/* 導入カード */}
        <Card className="border-accent/20 bg-accent/5">
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <IconGlyph name="shield-check" size={20} />
              </span>
              <div>
                <p className="text-base font-bold text-text">運転支援設定を見る</p>
                <p className="mt-1 text-sm text-secondary">
                  まだ利用していない便利機能があります
                </p>
              </div>
            </div>
            <ul className="ml-1 space-y-1.5 border-l-2 border-accent/20 pl-4">
              <li className="flex items-start gap-2 text-sm text-secondary">
                <IconGlyph name="check-circle" size={14} className="mt-0.5 shrink-0 text-success" />
                納車後、運転支援機能をまだ有効化されていません
              </li>
              <li className="flex items-start gap-2 text-sm text-secondary">
                <IconGlyph name="check-circle" size={14} className="mt-0.5 shrink-0 text-success" />
                高速道路利用が多いオーナー様に高く評価されています
              </li>
            </ul>
            {unusedCount > 0 && (
              <p className="text-xs text-attention font-semibold">
                {unusedCount}つの機能がまだ未使用です。試してみましょう。
              </p>
            )}
          </CardBody>
        </Card>

        {/* 機能リスト */}
        <section aria-labelledby="driving-assist-heading">
          <SectionLabel id="driving-assist-heading" className="mb-3 block">
            機能の利用状況
          </SectionLabel>
          <div className="flex flex-col gap-2">
            {features.map((feature) => {
              const usage = feature.usageStatus;
              const uc = usage ? usageConfig[usage.state] : usageConfig.unused;
              return (
                <Link key={feature.id} href={`/owner/settings/${feature.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardBody className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-secondary">
                        <IconGlyph name={feature.icon as IconName} size={20} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text">{feature.name}</p>
                        <p className="text-xs text-secondary mt-0.5">{feature.tagline}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <Badge variant={uc.variant} icon={uc.icon}>
                          {usage ? usage.label : "未使用"}
                        </Badge>
                      </div>
                      <IconGlyph name="chevron-right" size={16} className="shrink-0 text-secondary" />
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 凡例 */}
        <Card className="bg-slate-50">
          <CardBody>
            <p className="mb-2 text-xs font-semibold text-secondary">利用状況の見かた</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {(Object.entries(usageConfig) as [FeatureUsageState, typeof usageConfig[FeatureUsageState]][]).map(
                ([, cfg]) => (
                  <div key={cfg.label} className="flex items-center gap-1.5">
                    <Badge variant={cfg.variant} icon={cfg.icon} className="text-xs">
                      {cfg.label}
                    </Badge>
                  </div>
                )
              )}
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
}
