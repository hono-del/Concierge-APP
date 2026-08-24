"use client";

import { Database, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/voc/cn";

const items = [
  { href: "/studio", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/studio/sources", label: "Sources", icon: Database, exact: false },
  { href: "/studio/review", label: "Review", icon: ListChecks, exact: false },
];

export function StudioSubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b border-slate-200 pb-3">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
