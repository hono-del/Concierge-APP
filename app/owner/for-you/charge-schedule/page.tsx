import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, SectionLabel } from "@/components/ui/Card";
import { IconGlyph, type IconName } from "@/components/ui/IconGlyph";
import { getSettingsFeatures } from "@/lib/feature-data";
import type { FeatureSettingState } from "@/types";

const stateConfig: Record<
  FeatureSettingState,
  { variant: "success" | "neutral" | "attention" | "info"; icon: IconName }
> = {
  configured:     { variant: "success",   icon: "check-circle"    },
  not_configured: { variant: "neutral",   icon: "alert-triangle"  },
  partial:        { variant: "attention", icon: "alert-triangle"  },
  learning:       { variant: "info",      icon: "sparkles"        },
};

export default function ChargeSchedulePage() {
  const features = getSettingsFeatures();

  return (
    <div>
      <PageHeader title="充電スケジュールを設定する" backHref="/owner" />
      <div className="flex flex-col gap-5 px-4 py-5">

        {/* レコメンドカード本文 */}
        <Card className="border-accent/20 bg-accent/5">
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <IconGlyph name="bolt" size={20} />
              </span>
              <div>
                <p className="text-base font-bold text-text">充電スケジュールを設定する</p>
                <p className="mt-1 text-sm text-secondary">納車後に設定しておくと便利です</p>
              </div>
            </div>
            <ul className="ml-1 space-y-1.5 border-l-2 border-accent/20 pl-4">
              {[
                "納車から1か月以内のオーナー向けにおすすめしています",
                "夜間の電気料金が安いプランと組み合わせやすくなります",
              ].map((reason) => (
                <li key={reason} className="flex items-start gap-2 text-sm text-secondary">
                  <IconGlyph name="check-circle" size={14} className="mt-0.5 shrink-0 text-success" />
                  {reason}
                </li>
              ))}
            </ul>
            <Link
              href="/owner/settings/charge-schedule"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent"
            >
              設定手順を見る
              <IconGlyph name="arrow-right" size={14} />
            </Link>
          </CardBody>
        </Card>

        {/* 機能・設定の状況一覧 */}
        <section aria-labelledby="settings-heading">
          <SectionLabel id="settings-heading" className="mb-3 block">
            あなたのNXの設定状況
          </SectionLabel>
          <div className="flex flex-col gap-2">
            {features.map((feature) => {
              const setting = feature.settingStatus;
              const conf = setting ? stateConfig[setting.state] : stateConfig.not_configured;
              return (
                <Link key={feature.id} href={`/owner/settings/${feature.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardBody className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-secondary">
                        <IconGlyph name={feature.icon as IconName} size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text">{feature.name}</p>
                        <p className="text-xs text-secondary">{feature.category}</p>
                      </div>
                      {setting ? (
                        <Badge variant={conf.variant} icon={conf.icon} className="shrink-0">
                          {setting.label}
                        </Badge>
                      ) : (
                        <Badge variant="neutral" className="shrink-0">未対応</Badge>
                      )}
                      <IconGlyph name="chevron-right" size={16} className="shrink-0 text-secondary" />
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
