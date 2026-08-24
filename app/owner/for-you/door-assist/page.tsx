import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, SectionLabel } from "@/components/ui/Card";
import { IconGlyph, type IconName } from "@/components/ui/IconGlyph";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { getFeatureCandidates, getFeatureById } from "@/lib/feature-data";
import type { FeaturePriority } from "@/types";

const priorityConfig: Record<
  FeaturePriority,
  { label: string; variant: "danger" | "attention" | "neutral" }
> = {
  S: { label: "最優先",   variant: "danger"    },
  A: { label: "おすすめ", variant: "attention" },
  B: { label: "余裕があれば", variant: "neutral" },
};

export default function DoorAssistPage() {
  const feature = getFeatureById("door-assist");
  const candidates = getFeatureCandidates();

  return (
    <div>
      <PageHeader title="ドア開スイッチ＋降車アシスト" backHref="/owner" />
      <div className="flex flex-col gap-5 px-4 py-5">

        {/* メイン機能説明 */}
        {feature && (
          <Card className="border-primary/20">
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconGlyph name={feature.icon as IconName} size={20} />
                </span>
                <div>
                  <Badge variant="danger" className="mb-1">最優先で確認</Badge>
                  <p className="text-base font-bold text-text">{feature.name}</p>
                  <p className="mt-1 text-sm font-semibold text-accent">{feature.tagline}</p>
                </div>
              </div>

              <p className="text-sm text-secondary">{feature.description}</p>

              {/* e-Latch 説明補助画像 */}
              <div className="overflow-hidden rounded-xl">
                <Image
                  src="/images/e-latch.webp"
                  alt="e-Latch（電動ラッチ）の操作説明"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>

              {feature.differenceNote && (
                <WarningBanner>{feature.differenceNote}</WarningBanner>
              )}

              {feature.steps && feature.steps.length > 0 && (
                <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    操作の流れ
                  </p>
                  <ol className="space-y-2">
                    {feature.steps.map((step, i) => (
                      <li key={step.label} className="flex items-start gap-2 text-sm">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-text">{step.label}</p>
                          <p className="text-secondary">{step.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <Link
                href={`/owner/settings/door-assist`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-accent"
              >
                詳細ページで確認する
                <IconGlyph name="arrow-right" size={14} />
              </Link>
            </CardBody>
          </Card>
        )}

        {/* あわせて確認したい機能候補 */}
        <section aria-labelledby="candidates-heading">
          <SectionLabel id="candidates-heading" className="mb-3 block">
            あわせて確認したい機能
          </SectionLabel>
          <div className="flex flex-col gap-2">
            {candidates.map((candidate) => {
              const pc = priorityConfig[candidate.priority];
              return (
                <Link key={candidate.id} href={`/owner/settings/${candidate.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardBody className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-secondary">
                        <IconGlyph name={candidate.icon as IconName} size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text">{candidate.name}</p>
                        <p className="text-xs text-secondary">{candidate.tagline}</p>
                      </div>
                      <Badge variant={pc.variant} className="shrink-0">{pc.label}</Badge>
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
