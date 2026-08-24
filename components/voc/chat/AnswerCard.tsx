import { CheckCircle2, ExternalLink, Lightbulb, ShieldCheck } from "lucide-react";
import { SafetyNotice } from "@/components/voc/SafetyNotice";
import { SourceBadge } from "@/components/voc/SourceBadge";
import { TrustBadge } from "@/components/voc/TrustBadge";
import { Badge } from "@/components/voc/ui/badge";
import { Card } from "@/components/voc/ui/card";
import type { ChatAnswer } from "@/lib/voc/types";

/**
 * Chat回答の表示順序（要件 #10, #11）：
 * 1. まず試してほしいこと → 2. Why → 3. Similar Experiences → 4. Official Information → 5. Source
 */
export function AnswerCard({ answer }: { answer: ChatAnswer }) {
  return (
    <div className="max-w-xl space-y-3">
      <Badge variant={answer.mode === "official_only" ? "outline" : "secondary"}>
        {answer.mode === "official_only" ? "Official Only" : "Official + VoC"}
      </Badge>

      {answer.safetyBlocked && (
        <SafetyNotice safety={{ level: "high", requiresOfficialConfirmation: true }} />
      )}

      {/* 1. まず試してほしいこと */}
      <Card className="border-slate-900/10 bg-slate-900 p-4 text-white">
        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
          <CheckCircle2 className="h-3.5 w-3.5" />
          まずここを確認してください
        </p>
        <p className="text-sm font-semibold leading-relaxed">{answer.firstAction.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-white/85">{answer.firstAction.body}</p>
      </Card>

      {/* 2. Why */}
      {answer.why.length > 0 && (
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            なぜこの確認を優先するのか
          </p>
          <ul className="space-y-0.5 text-xs leading-relaxed text-slate-700">
            {answer.why.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Similar Experiences */}
      {answer.similarExperiences.length > 0 && (
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Similar Experiences
          </p>
          <div className="space-y-2">
            {answer.similarExperiences.map((exp) => (
              <Card key={exp.knowledgeId} className="p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <SourceBadge sourceType={exp.sourceType} />
                  <span className="text-[10px] text-slate-400">一致度 {Math.round(exp.matchScore * 100)}%</span>
                </div>
                <p className="text-xs font-semibold text-slate-900">{exp.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{exp.summary}</p>
                <p className="mt-1 text-[11px] text-slate-400">{exp.sourceTitle}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {answer.tips.length > 0 && (
        <div className="rounded-md border border-blue-100 bg-blue-50/60 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-500">
            <Lightbulb className="h-3.5 w-3.5" />
            Tips
          </p>
          <ul className="space-y-0.5 text-xs leading-relaxed text-blue-800">
            {answer.tips.map((tip, i) => (
              <li key={i}>・{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Official Information */}
      {answer.official && (
        <Card className="border-slate-200 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-900" />
            <SourceBadge sourceType="official" />
          </div>
          <p className="text-xs font-semibold text-slate-900">{answer.official.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{answer.official.body}</p>
          <p className="mt-1 text-[11px] text-slate-400">{answer.official.sourceTitle}</p>
        </Card>
      )}

      {/* 5. Source / Trust */}
      <TrustBadge trust={answer.trust} sourceType={answer.primarySourceType} />

      {answer.similarExperiences.some((e) => e.sourceUrl) && (
        <div className="space-y-1 text-[11px] text-slate-400">
          {answer.similarExperiences
            .filter((e) => e.sourceUrl)
            .map((e) => (
              <a
                key={e.knowledgeId}
                href={e.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-slate-700"
              >
                <ExternalLink className="h-3 w-3" />
                {e.sourceTitle}
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
