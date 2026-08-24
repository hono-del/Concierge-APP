import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { IconGlyph } from "@/components/ui/IconGlyph";

export function AgentHeader() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-primary px-6 py-4 text-white">
      <Link href="/agent" className="flex items-center gap-2 font-bold">
        <IconGlyph name="headset" size={22} />
        <span>Agent Assist</span>
      </Link>
      <div className="flex items-center gap-3 text-sm">
        <Badge variant="info" className="bg-white/10 text-white">
          共通Troubleshooting Engine
        </Badge>
        <span className="text-white/80">田中 健（オペレーター）</span>
      </div>
    </header>
  );
}
