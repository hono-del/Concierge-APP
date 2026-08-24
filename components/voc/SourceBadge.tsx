import { getSourceBadgeLabel, SOURCE_BADGE_STYLES } from "@/lib/voc/badge";
import { cn } from "@/lib/voc/cn";
import type { SourceType } from "@/lib/voc/types";

interface SourceBadgeProps {
  sourceType: SourceType;
  evidenceCount?: number;
  className?: string;
}

export function SourceBadge({ sourceType, evidenceCount = 1, className }: SourceBadgeProps) {
  const label = getSourceBadgeLabel(sourceType, evidenceCount);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold leading-4",
        SOURCE_BADGE_STYLES[label],
        className
      )}
    >
      {label}
    </span>
  );
}
