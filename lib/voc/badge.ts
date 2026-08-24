import type { SourceType } from "./types";

export type SourceBadgeLabel =
  | "LEXUS公式"
  | "Owner Experience"
  | "Community"
  | "Blog"
  | "Video"
  | "Expert"
  | "Dealer";

/**
 * KnowledgeのsourceTypeと根拠件数から、UI表示用のSource Badgeラベルを決定する。
 * Trust設計（要件 #21）：公式情報は明確に区別し、経験知は「Experience Knowledge」であることを示す。
 */
export function getSourceBadgeLabel(
  sourceType: SourceType,
  evidenceCount = 1
): SourceBadgeLabel {
  switch (sourceType) {
    case "official":
      return "LEXUS公式";
    case "dealer":
      return "Dealer";
    case "expert":
      return "Expert";
    case "blog":
      return "Blog";
    case "video":
      return "Video";
    case "community":
    default:
      return evidenceCount > 1 ? "Community" : "Owner Experience";
  }
}

export const SOURCE_BADGE_STYLES: Record<SourceBadgeLabel, string> = {
  LEXUS公式: "bg-slate-900 text-white",
  "Owner Experience": "bg-amber-50 text-amber-800 border border-amber-200",
  Community: "bg-blue-50 text-blue-800 border border-blue-200",
  Blog: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  Video: "bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200",
  Expert: "bg-violet-50 text-violet-800 border border-violet-200",
  Dealer: "bg-cyan-50 text-cyan-800 border border-cyan-200",
};

export function isExperienceKnowledge(sourceType: SourceType): boolean {
  return sourceType !== "official";
}
