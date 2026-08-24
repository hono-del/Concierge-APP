import Image from "next/image";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import type { Recommendation } from "@/types";

interface UpgradeCardProps {
  recommendation: Recommendation;
}

export function UpgradeCard({ recommendation }: UpgradeCardProps) {
  return (
    <Link href={recommendation.href} className="block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        {/* サービス画像（縦横比を維持して全体表示） */}
        {recommendation.imageUrl && (
          <Image
            src={recommendation.imageUrl}
            alt={recommendation.title}
            width={1200}
            height={675}
            className="w-full h-auto"
            priority
          />
        )}

        <CardBody className="flex flex-col gap-2">
          {/* ラベル */}
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
            アップグレード
          </p>

          {/* 機能名 */}
          <p className="text-base font-bold text-text">{recommendation.title}</p>

          {/* おすすめする理由（簡易） */}
          <p className="text-sm text-secondary">{recommendation.reason}</p>

          <p className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
            詳しく見る
            <IconGlyph name="arrow-right" size={14} />
          </p>
        </CardBody>
      </Card>
    </Link>
  );
}
