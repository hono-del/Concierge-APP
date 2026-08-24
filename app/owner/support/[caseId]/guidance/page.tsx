"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GuidanceStepper } from "@/components/troubleshooting/GuidanceStepper";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { LoadingState } from "@/components/ui/LoadingState";
import { getKnowledgeSourcesByIds } from "@/lib/mock-data";
import type { GuidanceTrack, SupportCaseDetailResponse } from "@/types";

export default function VisualGuidancePage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const caseId = params.caseId;

  const [detail, setDetail] = useState<SupportCaseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState<GuidanceTrack>("community");

  useEffect(() => {
    let cancelled = false;

    async function loadCase() {
      try {
        const response = await fetch(`/api/v1/support-cases/${caseId}`);
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as SupportCaseDetailResponse;
        if (cancelled) return;

        if (!data.recommendedGuidanceOfficial && !data.recommendedGuidanceCommunity) {
          router.replace(`/owner/support/${caseId}/diagnosis`);
          return;
        }
        setDetail(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCase();
    return () => {
      cancelled = true;
    };
  }, [caseId, router]);

  const officialGuidance = detail?.recommendedGuidanceOfficial ?? null;
  const communityGuidance = detail?.recommendedGuidanceCommunity ?? null;
  const canShowCommunity = Boolean(communityGuidance);
  const activeTrack: GuidanceTrack = track === "community" && communityGuidance ? "community" : "official";
  const activeGuidance = activeTrack === "community" ? communityGuidance : officialGuidance;

  function handleComplete() {
    if (!activeGuidance) return;
    window.localStorage.setItem("concierge:lastGuidanceTrack", activeTrack);
    window.localStorage.setItem("concierge:lastGuidanceCode", activeGuidance.code);
    router.push(`/owner/support/${caseId}/resolution`);
  }

  return (
    <div>
      <PageHeader title="解決方法" backHref={`/owner/support/${caseId}/diagnosis`} />
      <div className="px-4 py-5">
        {loading ? <LoadingState label="案内を準備しています…" /> : null}

        {!loading && activeGuidance ? (
          <div className="flex flex-col gap-4">
            {canShowCommunity ? (
              <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setTrack("official")}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
                    activeTrack === "official" ? "bg-white text-accent shadow-sm" : "text-secondary"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <IconGlyph name="shield-check" size={14} />
                    安心・確実タイプ
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTrack("community")}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
                    activeTrack === "community" ? "bg-white text-attention shadow-sm" : "text-secondary"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <IconGlyph name="video" size={14} />
                    実践・時短タイプ
                  </span>
                </button>
              </div>
            ) : null}

            <GuidanceStepper
              key={activeGuidance.code}
              title={activeGuidance.title}
              estimatedSeconds={activeGuidance.estimatedSeconds}
              steps={activeGuidance.steps}
              track={activeGuidance.track}
              disclaimer={activeGuidance.disclaimer}
              sources={getKnowledgeSourcesByIds(activeGuidance.sourceIds)}
              onExitBack={() => router.push(`/owner/support/${caseId}/diagnosis`)}
              onComplete={handleComplete}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
