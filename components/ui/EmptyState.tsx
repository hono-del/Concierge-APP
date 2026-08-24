import type { ReactNode } from "react";
import { IconGlyph, type IconName } from "./IconGlyph";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = "search", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-secondary">
        <IconGlyph name={icon} size={24} />
      </span>
      <p className="text-base font-semibold text-text">{title}</p>
      {description ? <p className="text-sm text-secondary">{description}</p> : null}
      {action}
    </div>
  );
}
