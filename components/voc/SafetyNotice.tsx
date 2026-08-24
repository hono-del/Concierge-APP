import { ShieldAlert } from "lucide-react";
import type { KnowledgeSafety } from "@/lib/voc/types";

/** Safety Gate（要件 #12, #22）：安全に関わる領域はExperience Knowledgeのみでの案内を避ける */
export function SafetyNotice({ safety }: { safety: KnowledgeSafety }) {
  if (safety.level === "low") return null;

  const isHigh = safety.level === "high";
  return (
    <div
      className={
        isHigh
          ? "flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5"
          : "flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5"
      }
    >
      <ShieldAlert
        className={isHigh ? "mt-0.5 h-4 w-4 shrink-0 text-red-600" : "mt-0.5 h-4 w-4 shrink-0 text-amber-600"}
      />
      <p className={isHigh ? "text-xs leading-relaxed text-red-800" : "text-xs leading-relaxed text-amber-800"}>
        {isHigh
          ? "安全に関わるため、Experience Knowledgeのみでは案内できません。公式情報のご確認、または販売店・専門スタッフへのご相談を優先してください。"
          : safety.notes?.[0] ?? "安全に関わる可能性があるため、公式情報の確認を優先してください。"}
      </p>
    </div>
  );
}
