import { PageHeader } from "@/components/layout/PageHeader";
import { DemoActionButton } from "@/components/owner/DemoActionButton";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { demoRecommendations } from "@/lib/mock-data";

export default function UpgradeRecommendationPage() {
  const upgrade = demoRecommendations.find((recommendation) => recommendation.type === "upgrade");

  if (!upgrade) {
    return null;
  }

  return (
    <div>
      <PageHeader title="Upgrade Recommendation" backHref="/owner" />
      <div className="flex flex-col gap-5 px-4 py-5">
        <Card className="bg-gradient-to-br from-accent to-primary text-white">
          <CardBody className="flex flex-col gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <IconGlyph name="gift" size={22} />
            </span>
            <p className="text-xl font-bold">{upgrade.title}</p>
            <p className="text-sm text-white/85">{upgrade.reason}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-text">あなたにおすすめする理由</p>
            <ul className="space-y-2">
              {upgrade.reasons?.map((reason) => (
                <li key={reason} className="flex items-start gap-2 text-sm text-secondary">
                  <IconGlyph name="check-circle" size={16} className="mt-0.5 shrink-0 text-success" />
                  {reason}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-text">できること</p>
            <ul className="space-y-2">
              {upgrade.benefits?.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-secondary">
                  <IconGlyph name="sparkles" size={16} className="mt-0.5 shrink-0 text-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-3">
          <DemoActionButton
            variant="primary"
            fullWidth
            message="デモではここから実際の体験動画は再生されません。"
          >
            体験を見る
          </DemoActionButton>
          <DemoActionButton
            variant="outline"
            fullWidth
            message="デモではここから実際のご相談は送信されません。"
          >
            サービスについて相談
          </DemoActionButton>
        </div>
      </div>
    </div>
  );
}
