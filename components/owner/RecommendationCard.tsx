import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph, type IconName } from "@/components/ui/IconGlyph";
import type { Recommendation, RecommendationType } from "@/types";

const typeIcon: Record<RecommendationType, IconName> = {
  onboarding: "sparkles",
  feature: "bolt",
  ota: "bell",
  upgrade: "gift",
};

const typeLabel: Record<RecommendationType, string> = {
  onboarding: "おすすめ",
  feature: "おすすめ",
  ota: "更新情報",
  upgrade: "アップグレード",
};

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <Link href={recommendation.href} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardBody className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <IconGlyph name={typeIcon[recommendation.type]} size={20} />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              {typeLabel[recommendation.type]}
            </p>
            <p className="mt-0.5 text-base font-bold text-text">{recommendation.title}</p>
            <p className="mt-1 text-sm text-secondary">{recommendation.reason}</p>
          </div>
          <IconGlyph name="chevron-right" size={18} className="mt-2 shrink-0 text-secondary" />
        </CardBody>
      </Card>
    </Link>
  );
}
