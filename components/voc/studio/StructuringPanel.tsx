"use client";

import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SourceBadge } from "@/components/voc/SourceBadge";
import { Badge } from "@/components/voc/ui/badge";
import { Button } from "@/components/voc/ui/button";
import { structureKnowledge } from "@/lib/voc/actions/studio-actions";
import { AI_STRUCTURING_STEPS } from "@/lib/voc/ai/mode";
import { CATEGORY_LABELS, SOURCE_TYPE_LABELS } from "@/lib/voc/labels";
import { getConfidenceLabel } from "@/lib/voc/trust";
import type { KnowledgeItem } from "@/lib/voc/types";

interface StructuringPanelProps {
  rawVocId: string;
  knowledge: KnowledgeItem | null;
}

export function StructuringPanel({ rawVocId, knowledge }: StructuringPanelProps) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);

  async function handleStructure() {
    setRunning(true);
    const structurePromise = structureKnowledge(rawVocId);

    for (let i = 0; i < AI_STRUCTURING_STEPS.length; i++) {
      setStepIndex(i);
      await new Promise((r) => setTimeout(r, 550));
    }

    await structurePromise;
    setRunning(false);
    setStepIndex(-1);
    router.refresh();
  }

  if (running) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
        <Sparkles className="h-8 w-8 text-slate-300" />
        <div className="space-y-2">
          {AI_STRUCTURING_STEPS.map((step, i) => (
            <p
              key={step}
              className={
                i === stepIndex
                  ? "flex items-center justify-center gap-2 text-sm font-medium text-slate-900"
                  : i < stepIndex
                    ? "flex items-center justify-center gap-2 text-sm text-slate-400 line-through"
                    : "flex items-center justify-center gap-2 text-sm text-slate-300"
              }
            >
              {i === stepIndex && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {i < stepIndex && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
              {step}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (!knowledge) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
        <Sparkles className="h-8 w-8 text-slate-300" />
        <div>
          <p className="text-sm font-medium text-slate-700">まだAI構造化されていません</p>
          <p className="mt-1 text-xs text-slate-400">
            Original VoCを解析し、Vehicle / Category / Symptoms / Causes / Checks / Resolutions / Tipsへ構造化します
          </p>
        </div>
        <Button onClick={handleStructure}>
          <Sparkles className="h-3.5 w-3.5" />
          Structure with AI
        </Button>
      </div>
    );
  }

  const confidence = getConfidenceLabel(knowledge.trust.score);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SourceBadge sourceType={knowledge.source.type} evidenceCount={knowledge.resolutions[0]?.evidenceCount} />
          <Badge variant={knowledge.status === "approved" ? "success" : "secondary"}>{knowledge.status}</Badge>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/studio/knowledge/${knowledge.id}`}>
            Knowledge Detailを開く
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">Vehicle</p>
        <p className="text-sm text-slate-800">
          {knowledge.vehicle.maker} {knowledge.vehicle.model}
          {knowledge.vehicle.powertrain ? ` (${knowledge.vehicle.powertrain})` : ""}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">Category</p>
        <p className="text-sm text-slate-800">{CATEGORY_LABELS[knowledge.category]}</p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">Issue</p>
        <p className="text-sm font-medium text-slate-900">{knowledge.issueTitle}</p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">Symptoms</p>
        <ul className="mt-1 space-y-0.5 text-sm text-slate-700">
          {knowledge.symptom.map((s, i) => (
            <li key={i}>・{s}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">Conditions</p>
        <p className="text-sm text-slate-700">
          {[
            knowledge.conditions.weather?.join("/"),
            knowledge.conditions.temperature,
            knowledge.conditions.vehicleState?.join("/"),
            knowledge.conditions.frequency,
            knowledge.conditions.timing,
          ]
            .filter(Boolean)
            .join(" ・ ") || "特記事項なし"}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">Possible Causes</p>
        <ul className="mt-1 space-y-0.5 text-sm text-slate-700">
          {knowledge.possibleCauses.map((c, i) => (
            <li key={i}>
              ・{c.label}
              <span className="ml-1 text-[11px] text-slate-400">（確信度 {Math.round(c.confidence * 100)}%）</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">Checks</p>
        <ol className="mt-1 space-y-0.5 text-sm text-slate-700">
          {knowledge.checks.map((c) => (
            <li key={c.order}>
              {c.order}. {c.action}
              {c.reason && <span className="ml-1 text-[11px] text-slate-400">（{c.reason}）</span>}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">Resolutions</p>
        <ul className="mt-1 space-y-0.5 text-sm text-slate-700">
          {knowledge.resolutions.map((r, i) => (
            <li key={i}>
              ・{r.action}
              {r.outcome && <span className="ml-1 text-[11px] text-slate-400">（{r.outcome}）</span>}
            </li>
          ))}
        </ul>
      </div>

      {knowledge.tips.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase text-slate-400">Tips</p>
          <ul className="mt-1 space-y-0.5 text-sm text-slate-700">
            {knowledge.tips.map((t, i) => (
              <li key={i}>・{t}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 rounded-md bg-slate-50 p-3">
        <div>
          <p className="text-[10px] font-semibold uppercase text-slate-400">Source Type</p>
          <p className="text-sm text-slate-800">{SOURCE_TYPE_LABELS[knowledge.source.type]}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase text-slate-400">Trust</p>
          <p className="text-sm capitalize text-slate-800">{confidence} confidence</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase text-slate-400">Safety Level</p>
          <p className="text-sm capitalize text-slate-800">{knowledge.safety.level}</p>
        </div>
      </div>
    </div>
  );
}
