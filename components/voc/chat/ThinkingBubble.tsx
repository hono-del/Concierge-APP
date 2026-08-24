import { Loader2 } from "lucide-react";

export function ThinkingBubble({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      {text}
    </div>
  );
}
