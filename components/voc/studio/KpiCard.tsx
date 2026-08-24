import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/voc/ui/card";
import { cn } from "@/lib/voc/cn";

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "default" | "official" | "voc" | "expert" | "warning";
}

const accentStyles: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  default: "bg-slate-100 text-slate-700",
  official: "bg-slate-900 text-white",
  voc: "bg-amber-50 text-amber-700",
  expert: "bg-violet-50 text-violet-700",
  warning: "bg-red-50 text-red-700",
};

export function KpiCard({ label, value, icon: Icon, accent = "default" }: KpiCardProps) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          accentStyles[accent]
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-xl font-bold tabular-nums text-slate-900">{value}</p>
      </div>
    </Card>
  );
}
