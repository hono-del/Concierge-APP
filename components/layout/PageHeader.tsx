import Link from "next/link";
import type { ReactNode } from "react";
import { IconGlyph } from "@/components/ui/IconGlyph";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  right?: ReactNode;
}

export function PageHeader({ title, backHref, right }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-100 bg-background/95 px-4 py-3 backdrop-blur">
      {backHref ? (
        <Link
          href={backHref}
          aria-label="前の画面へ戻る"
          className="flex h-9 w-9 items-center justify-center rounded-full text-text hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <IconGlyph name="chevron-left" size={20} />
        </Link>
      ) : (
        <span className="h-9 w-9" aria-hidden="true" />
      )}
      <h1 className="flex-1 truncate text-base font-bold text-text">{title}</h1>
      {right ?? <span className="h-9 w-9" aria-hidden="true" />}
    </header>
  );
}
