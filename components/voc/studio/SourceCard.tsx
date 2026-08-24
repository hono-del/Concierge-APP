"use client";

import { Ban, CheckCircle2, Eye, Loader2, Play, Wifi } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/voc/ui/badge";
import { Button } from "@/components/voc/ui/button";
import { Card, CardContent } from "@/components/voc/ui/card";
import { collectSource, toggleSourceStatus } from "@/lib/voc/actions/studio-actions";
import { AI_COLLECTION_STEPS } from "@/lib/voc/ai/mode";
import { formatDate } from "@/lib/voc/labels";
import { SOURCE_STATUS_LABELS, SOURCE_TYPE_LABELS } from "@/lib/voc/labels";
import type { VocSource } from "@/lib/voc/types";

interface SourceCardProps {
  source: VocSource;
}

type CollectPhase = "idle" | "connecting" | "collecting" | "analyzing" | "done";

const STEP_LABELS: Record<Exclude<CollectPhase, "idle" | "done">, string> = {
  connecting: "Connecting",
  collecting: "Collecting",
  analyzing: "Analyzing",
};

export function SourceCard({ source }: SourceCardProps) {
  const [phase, setPhase] = useState<CollectPhase>("idle");
  const [resultText, setResultText] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  async function handleCollect() {
    setResultText(null);
    setPhase("connecting");
    const collectPromise = collectSource(source.id);

    for (const step of AI_COLLECTION_STEPS) {
      setPhase(step.toLowerCase() as CollectPhase);
      await new Promise((r) => setTimeout(r, 600));
    }

    const result = await collectPromise;
    setPhase("done");
    const liveLabel = result.live ? "Live Collectionで取得" : "Demo Snapshotへフォールバック";
    setResultText(
      `${result.totalCount} items found（新規 ${result.newCount}件・${liveLabel}）`
    );
    setTimeout(() => setPhase("idle"), 2500);
  }

  async function handleToggle() {
    setToggling(true);
    try {
      await toggleSourceStatus(source.id);
    } finally {
      setToggling(false);
    }
  }

  const isBusy = phase !== "idle" && phase !== "done";

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-slate-900">{source.name}</p>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-slate-400 hover:text-slate-600 hover:underline"
            >
              {source.url}
            </a>
          </div>
          <Badge variant={source.status === "active" ? "success" : "secondary"}>
            {SOURCE_STATUS_LABELS[source.status]}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-[10px] uppercase text-slate-400">Source Type</p>
            <p className="font-medium text-slate-700">{SOURCE_TYPE_LABELS[source.sourceType]}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-400">Vehicle</p>
            <p className="font-medium text-slate-700">{source.vehicleModel}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-400">Last Collected</p>
            <p className="font-medium text-slate-700">{formatDate(source.lastCollectedAt)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-400">Collected Items</p>
            <p className="font-medium text-slate-700">{source.collectedItems}</p>
          </div>
        </div>

        {phase !== "idle" && (
          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {isBusy ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                {STEP_LABELS[phase as keyof typeof STEP_LABELS]}…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {resultText}
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" onClick={handleCollect} disabled={isBusy || source.status === "disabled"}>
            {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Collect
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/studio/sources/${source.id}`}>
              <Eye className="h-3.5 w-3.5" />
              View Items
            </Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={handleToggle} disabled={toggling}>
            {source.status === "disabled" ? <Wifi className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
            {source.status === "disabled" ? "Enable" : "Disable"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
