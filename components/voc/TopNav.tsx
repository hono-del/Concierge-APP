"use client";

import { BookOpenText, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/voc/cn";
import { DemoTourMenu } from "./DemoTourMenu";

const navItems = [
  { href: "/studio", label: "Knowledge Studio", icon: BookOpenText },
  { href: "/chat", label: "Customer Chat", icon: MessageCircle },
  { href: "/community", label: "Expert Community", icon: Users },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/studio" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-[11px] font-bold text-white">
              NX
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-slate-900 sm:inline">
              VoC Knowledge Platform
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden text-xs text-slate-400 hover:text-slate-600 sm:inline"
          >
            ← コンシェルジュAPP デモTOP
          </Link>
          <DemoTourMenu />
        </div>
      </div>
    </header>
  );
}
