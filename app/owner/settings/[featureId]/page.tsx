import { notFound } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph, type IconName } from "@/components/ui/IconGlyph";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { getFeatureById } from "@/lib/feature-data";
import { vehicleFeatures } from "@/lib/feature-data";
import type { FeatureSettingState, FeatureUsageState, FeaturePriority } from "@/types";

const stateConfig: Record<
  FeatureSettingState,
  { label: string; variant: "success" | "neutral" | "attention" | "info"; icon: IconName }
> = {
  configured:     { label: "設定済み",     variant: "success",   icon: "check-circle"   },
  not_configured: { label: "未設定",       variant: "neutral",   icon: "alert-triangle" },
  partial:        { label: "一部設定済み", variant: "attention", icon: "alert-triangle" },
  learning:       { label: "学習中",       variant: "info",      icon: "sparkles"       },
};

const usageConfig: Record<
  FeatureUsageState,
  { label: string; variant: "success" | "neutral" | "attention" | "info"; icon: IconName }
> = {
  mastered:    { label: "習得済み",   variant: "success",   icon: "check-circle"   },
  in_use:      { label: "利用中",     variant: "info",      icon: "bolt"           },
  partial_use: { label: "一部利用中", variant: "attention", icon: "alert-triangle" },
  unused:      { label: "未使用",     variant: "neutral",   icon: "alert-triangle" },
};

const priorityConfig: Record<
  FeaturePriority,
  { label: string; variant: "danger" | "attention" | "neutral" }
> = {
  S: { label: "最優先",       variant: "danger"    },
  A: { label: "おすすめ",     variant: "attention" },
  B: { label: "余裕があれば", variant: "neutral"   },
};

interface PageProps {
  params: Promise<{ featureId: string }>;
}

export async function generateStaticParams() {
  return vehicleFeatures.map((f) => ({ featureId: f.id }));
}

export default async function FeatureSettingPage({ params }: PageProps) {
  const { featureId } = await params;
  const feature = getFeatureById(featureId);

  if (!feature) {
    notFound();
  }

  const settingConf = feature.settingStatus
    ? stateConfig[feature.settingStatus.state]
    : null;
  const usageConf = feature.usageStatus
    ? usageConfig[feature.usageStatus.state]
    : null;
  const priorityConf = priorityConfig[feature.priority];

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-100 bg-background/95 px-4 py-3 backdrop-blur">
        <BackButton />
        <h1 className="flex-1 truncate text-base font-bold text-text">{feature.name}</h1>
        <span className="h-9 w-9" aria-hidden="true" />
      </header>
      <div className="flex flex-col gap-5 px-4 py-5">

        {/* ヘッダーカード */}
        <Card>
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <IconGlyph name={feature.icon as IconName} size={24} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant={priorityConf.variant}>{priorityConf.label}</Badge>
                  <span className="text-xs text-secondary">{feature.category}</span>
                </div>
                <p className="text-base font-bold text-text">{feature.name}</p>
                <p className="mt-1 text-sm font-semibold text-accent">{feature.tagline}</p>
              </div>
            </div>

            {settingConf && feature.settingStatus && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-secondary">設定状態：</p>
                <Badge variant={settingConf.variant} icon={settingConf.icon}>
                  {feature.settingStatus.label}
                </Badge>
              </div>
            )}

            {usageConf && feature.usageStatus && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-secondary">利用状況：</p>
                <Badge variant={usageConf.variant} icon={usageConf.icon}>
                  {feature.usageStatus.label}
                </Badge>
              </div>
            )}
          </CardBody>
        </Card>

        {/* 機能説明 */}
        <Card>
          <CardBody className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              この機能について
            </p>
            <p className="text-sm text-secondary">{feature.description}</p>

            {feature.differenceNote && (
              <WarningBanner>{feature.differenceNote}</WarningBanner>
            )}
          </CardBody>
        </Card>

        {/* 設定手順 */}
        {feature.steps && feature.steps.length > 0 && (
          <Card>
            <CardBody className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                設定・操作の手順
              </p>
              <ol className="space-y-3">
                {feature.steps.map((step, i) => (
                  <li key={step.label} className="flex items-start gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-text">{step.label}</p>
                      <p className="mt-0.5 text-secondary">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        )}

        {/* CTA */}
        {feature.ctaLabel && (
          <button
            type="button"
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-white transition-opacity active:opacity-80"
          >
            {feature.ctaLabel}
          </button>
        )}

        <p className="text-center text-xs text-secondary">
          ※ このページはデモ画面です。実際の設定は車両のマルチメディアシステムまたはLexusアプリから行ってください。
        </p>

      </div>
    </div>
  );
}
