import type { KnowledgeCategory, KnowledgeStatus, RawVocStatus, SourceStatus, SourceType } from "./types";

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  door: "ドア",
  battery: "バッテリー",
  infotainment: "インフォテインメント",
  warning: "警告灯",
  noise: "異音",
  charging: "充電",
  adas: "運転支援",
  other: "その他",
};

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  qa: "Q&A",
  blog: "Blog",
  video: "Video",
  community: "Community",
  dealer: "Dealer",
  expert: "Expert",
  official: "Official",
};

export const SOURCE_STATUS_LABELS: Record<SourceStatus, string> = {
  active: "Active",
  disabled: "Disabled",
  error: "Error",
};

export const RAW_VOC_STATUS_LABELS: Record<RawVocStatus, string> = {
  new: "New",
  processing: "Processing",
  structured: "Structured",
  duplicate: "Duplicate",
  rejected: "Rejected",
};

export const KNOWLEDGE_STATUS_LABELS: Record<KnowledgeStatus, string> = {
  draft: "Draft",
  review: "Review",
  approved: "Approved",
  rejected: "Rejected",
};

export function formatRelativeDate(iso: string | null): string {
  if (!iso) return "未収集";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "本日";
  if (diffDays === 1) return "1日前";
  if (diffDays < 30) return `${diffDays}日前`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}ヶ月前`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const date = new Date(iso);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}
