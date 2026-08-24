import { notFound } from "next/navigation";
import Image from "next/image";
import { BackButton } from "@/components/ui/BackButton";
import { Card, CardBody } from "@/components/ui/Card";
import { DemoActionButton } from "@/components/owner/DemoActionButton";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { getUpgradeServiceById, upgradeServices } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return upgradeServices.map((s) => ({ id: s.id }));
}

export default async function UpgradeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = getUpgradeServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-100 bg-background/95 px-4 py-3 backdrop-blur">
        <BackButton />
        <h1 className="flex-1 truncate text-base font-bold text-text">
          {service.title}
        </h1>
        <span className="h-9 w-9" aria-hidden="true" />
      </header>

      <div className="flex flex-col gap-5 pb-8">
        {/* サービス画像（縦横比維持） */}
        {service.imageUrl && (
          <Image
            src={service.imageUrl}
            alt={service.title}
            width={1200}
            height={675}
            className="w-full h-auto"
            priority
          />
        )}

        <div className="flex flex-col gap-4 px-4">
          {/* タイトル */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
              アップグレード
            </p>
            <p className="text-xl font-bold text-text">{service.title}</p>
          </div>

          {/* 詳細説明 */}
          {service.detailedDescription && (
            <Card>
              <CardBody>
                <p className="mb-2 text-sm font-semibold text-text">サービスの概要</p>
                <p className="text-sm leading-relaxed text-secondary">
                  {service.detailedDescription}
                </p>
              </CardBody>
            </Card>
          )}

          {/* できること */}
          {service.benefits && service.benefits.length > 0 && (
            <Card>
              <CardBody className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-text">できること</p>
                <ul className="space-y-2">
                  {service.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm text-secondary"
                    >
                      <IconGlyph
                        name="sparkles"
                        size={15}
                        className="mt-0.5 shrink-0 text-accent"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {/* なぜおすすめするか */}
          <Card className="border-accent/20 bg-accent/5">
            <CardBody className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <IconGlyph name="sparkles" size={16} className="text-accent" />
                <p className="text-sm font-semibold text-text">なぜおすすめするか</p>
              </div>
              <p className="text-sm text-secondary">{service.reason}</p>
            </CardBody>
          </Card>

          {/* CTA */}
          <div className="flex flex-col gap-3 pt-1">
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
    </div>
  );
}
