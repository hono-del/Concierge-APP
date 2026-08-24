import { ShieldCheck, Sparkles } from "lucide-react";
import { isExperienceKnowledge } from "@/lib/voc/badge";
import { CONFIDENCE_LABEL_TEXT, buildTrustExplanation, getConfidenceLabel } from "@/lib/voc/trust";
import type { KnowledgeTrust, SourceType } from "@/lib/voc/types";

interface TrustBadgeProps {
  trust: KnowledgeTrust;
  sourceType: SourceType;
  compact?: boolean;
}

/**
 * Trust Visualization（要件 #21）。
 * 公式情報は「LEXUS公式」として明確に区別し、経験知は「Experience Knowledge」であることを示す。
 */
export function TrustBadge({ trust, sourceType, compact }: TrustBadgeProps) {
  const isOfficial = sourceType === "official";
  const label = getConfidenceLabel(trust.score);
  const explanation = buildTrustExplanation(trust);

  if (isOfficial) {
    return (
      <div className="flex items-start gap-2 rounded-md bg-slate-900/[0.03] px-3 py-2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-900" />
        <div>
          <p className="text-xs font-semibold text-slate-900">公式情報</p>
          {!compact && <p className="text-[11px] text-slate-500">LEXUSオーナーズマニュアル・FAQ等に基づく情報です</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <div>
        <p className="text-xs font-semibold text-amber-800">
          {CONFIDENCE_LABEL_TEXT[label]} ・ Experience Knowledge
        </p>
        {!compact && (
          <ul className="mt-0.5 space-y-0.5 text-[11px] text-amber-700">
            {explanation.map((line, i) => (
              <li key={i}>・{line}</li>
            ))}
            <li className="text-amber-600/80">・公式情報ではありません</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export { isExperienceKnowledge };
