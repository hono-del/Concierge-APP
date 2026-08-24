import Link from "next/link";
import { IconGlyph } from "@/components/ui/IconGlyph";

export function ManufacturerHeader() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-primary px-6 py-4 text-white">
      <Link href="/manufacturer/insights" className="flex items-center gap-2 font-bold">
        <IconGlyph name="chart-bar" size={22} />
        <span>CX Intelligence</span>
      </Link>
      <span className="text-sm text-white/80">Manufacturer Dashboard</span>
    </header>
  );
}
