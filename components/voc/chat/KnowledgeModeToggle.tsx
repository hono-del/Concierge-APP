import { cn } from "@/lib/voc/cn";
import type { KnowledgeMode } from "@/lib/voc/types";

interface KnowledgeModeToggleProps {
  mode: KnowledgeMode;
  onChange: (mode: KnowledgeMode) => void;
}

/** Official Only / Official + VoC比較トグル（要件 #12） */
export function KnowledgeModeToggle({ mode, onChange }: KnowledgeModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Knowledge Mode
      </span>
      <div className="flex items-center gap-0.5 rounded-md bg-slate-100 p-0.5">
        <button
          type="button"
          onClick={() => onChange("official_only")}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
            mode === "official_only" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
          )}
        >
          Official Only
        </button>
        <button
          type="button"
          onClick={() => onChange("official_voc")}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
            mode === "official_voc" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
          )}
        >
          Official + VoC
        </button>
      </div>
    </div>
  );
}
