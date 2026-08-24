"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconGlyph, type IconName } from "@/components/ui/IconGlyph";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { WarningBanner } from "@/components/ui/WarningBanner";
import type { GuidanceStep, GuidanceTrack, KnowledgeSource } from "@/types";

const sourceTypeLabel: Record<KnowledgeSource["type"], string> = {
  owners_manual: "オーナーズマニュアル",
  faq: "FAQ",
  support_case: "過去のサポート事例",
  product_info: "製品情報",
  community_tip: "オーナー投稿",
  video: "解説動画",
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export interface GuidanceStepperProps {
  title: string;
  estimatedSeconds: number;
  steps: GuidanceStep[];
  track?: GuidanceTrack;
  disclaimer?: string;
  sources?: KnowledgeSource[];
  onComplete: () => void;
  onExitBack?: () => void;
}

/**
 * Visual Guidance（U08）で3〜5ステップの操作案内を進行表示するClient Component。
 * track（official/community）に応じて配色・出典表示を切り替える。
 * 出典: docs/design/system-architecture.md 5.3 GuidanceStepper
 */
export function GuidanceStepper({
  title,
  estimatedSeconds,
  steps,
  track = "official",
  disclaimer,
  sources = [],
  onComplete,
  onExitBack,
}: GuidanceStepperProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const isCommunity = track === "community";

  if (!step) {
    return null;
  }

  function handleNext() {
    if (isLastStep) {
      onComplete();
    } else {
      setStepIndex((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (stepIndex === 0) {
      onExitBack?.();
    } else {
      setStepIndex((prev) => prev - 1);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-secondary">{estimatedSeconds}秒で確認できます</p>
        <ProgressIndicator current={stepIndex + 1} total={steps.length} label="STEP" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{title}</p>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            isCommunity ? "bg-attention/10 text-attention" : "bg-accent/10 text-accent"
          }`}
        >
          <IconGlyph name={isCommunity ? "video" : "shield-check"} size={12} />
          {isCommunity ? "実践・時短タイプ" : "安心・確実タイプ"}
        </span>
      </div>

      {disclaimer ? <WarningBanner>{disclaimer}</WarningBanner> : null}

      {step.warning ? <WarningBanner>{step.warning}</WarningBanner> : null}

      {step.imageUrl ? (
        <div
          className={`relative h-44 overflow-hidden rounded-2xl border bg-white p-3 ${
            isCommunity ? "border-attention/20" : "border-primary/10"
          }`}
        >
          <Image src={step.imageUrl} alt={step.title} fill className="object-contain" />
        </div>
      ) : (
        <div
          className={`flex h-44 items-center justify-center rounded-2xl ${
            isCommunity ? "bg-attention/5" : "bg-primary/5"
          }`}
        >
          <IconGlyph
            name={step.icon as IconName}
            size={64}
            className={isCommunity ? "text-attention" : "text-primary"}
          />
        </div>
      )}

      <div>
        <p className={`text-sm font-semibold ${isCommunity ? "text-attention" : "text-accent"}`}>
          STEP {stepIndex + 1}
        </p>
        <p className="mt-1 text-lg font-bold text-text">{step.title}</p>
        <p className="mt-2 text-sm text-secondary">{step.body}</p>
      </div>

      {sources.length > 0 ? (
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="mb-1.5 text-xs font-semibold text-secondary">出典</p>
          <ul className="space-y-1">
            {sources.map((source) => (
              <li key={source.id} className="flex flex-wrap items-center gap-1 text-xs text-secondary">
                <IconGlyph
                  name={source.type === "video" ? "video" : "book"}
                  size={12}
                  className="shrink-0"
                />
                <span className="font-medium text-text">{sourceTypeLabel[source.type]}</span>
                <span>：{source.title}</span>
                {source.durationSeconds ? (
                  <span className="text-secondary/70">（{formatDuration(source.durationSeconds)}）</span>
                ) : null}
                {source.publisher ? <span className="text-secondary/70">・{source.publisher}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-2 flex gap-3">
        <Button variant="outline" onClick={handleBack}>
          戻る
        </Button>
        <Button fullWidth onClick={handleNext}>
          {isLastStep ? "解決を確認する" : "次へ"}
        </Button>
      </div>
    </div>
  );
}
