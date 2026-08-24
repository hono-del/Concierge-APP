import Link from "next/link";
import { AskAnythingButton } from "@/components/owner/AskAnythingButton";
import { RecommendationCard } from "@/components/owner/RecommendationCard";
import { UpgradeCard } from "@/components/owner/UpgradeCard";
import { VehicleStatusCard } from "@/components/owner/VehicleStatusCard";
import { WhatsNewSummaryCard } from "@/components/owner/WhatsNewSummaryCard";
import { SectionLabel } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { getTopRecommendations } from "@/domain/recommendation/engine";
import { demoOtaUpdate, demoRecommendations, demoUser, demoVehicle, upgradeServices } from "@/lib/mock-data";

export default function OwnerHomePage() {
  const topRecommendations = getTopRecommendations(
    demoRecommendations.filter((recommendation) => recommendation.type !== "upgrade"),
    3
  );

  // ページ表示のたびにランダムで1件選択
  const randomUpgrade = upgradeServices[Math.floor(Math.random() * upgradeServices.length)];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-6 px-4 pb-6 pt-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary">{greeting}</p>
          <p className="text-lg font-bold text-text">{demoUser.displayName} さん</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-secondary shadow-sm transition-colors hover:bg-slate-50"
        >
          <IconGlyph name="chevron-left" size={12} />
          ホームへ
        </Link>
      </div>

      <VehicleStatusCard vehicle={demoVehicle} />

      <section aria-labelledby="for-you-heading">
        <div className="mb-2">
          <SectionLabel id="for-you-heading">For You</SectionLabel>
        </div>
        <div className="flex flex-col gap-3">
          {topRecommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </section>

      {randomUpgrade && (
        <section aria-labelledby="upgrade-heading">
          <SectionLabel id="upgrade-heading" className="mb-2 block">
            Upgrade
          </SectionLabel>
          <UpgradeCard recommendation={randomUpgrade} />
        </section>
      )}

      <section aria-labelledby="whats-new-heading">
        <SectionLabel id="whats-new-heading" className="mb-2 block">
          What&apos;s New
        </SectionLabel>
        <WhatsNewSummaryCard otaUpdate={demoOtaUpdate} />
      </section>

      <div className="mt-2">
        <AskAnythingButton />
        <p className="mt-2 text-center text-xs text-secondary">Ask anything</p>
      </div>
    </div>
  );
}
