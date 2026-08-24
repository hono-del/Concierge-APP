"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { cn } from "@/lib/utils";

interface SceneLink {
  href: string;
  label: string;
}

interface SceneGroup {
  title: string;
  links: SceneLink[];
}

const sceneGroups: SceneGroup[] = [
  {
    title: "Owner Concierge",
    links: [
      { href: "/owner", label: "U01 Home" },
      { href: "/owner/for-you", label: "U02 For You" },
      { href: "/owner/whats-new", label: "U03 What's New" },
      { href: "/owner/upgrade", label: "U04 Upgrade Recommendation" },
      { href: "/owner/support/new", label: "U05 困りごと入力" },
    ],
  },
  {
    title: "Agent Assist",
    links: [{ href: "/agent", label: "A01 Agent Dashboard" }],
  },
  {
    title: "Manufacturer",
    links: [{ href: "/manufacturer/insights", label: "M01-M03 CX Intelligence" }],
  },
];

/**
 * デモ運営機能（FR-12）：主要Sceneへの直接移動と初期化を提供する。
 * ショールームでの説明者操作を想定した、常時アクセス可能なフローティングメニュー。
 */
export function DemoSceneMenu() {
  const [open, setOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const router = useRouter();

  async function handleReset() {
    setResetting(true);
    try {
      await fetch("/api/v1/support-cases", { method: "DELETE" });
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("concierge:activeCaseId");
      }
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setResetting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="デモメニューを開く"
        aria-expanded={open}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <IconGlyph name="menu" size={22} />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 flex justify-end bg-black/40 transition-opacity",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="デモ運営メニュー"
          className={cn(
            "flex h-full w-full max-w-sm flex-col gap-6 bg-white p-5 shadow-2xl transition-transform",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-text">デモ運営メニュー</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="閉じる"
              className="rounded-full p-1.5 text-secondary hover:bg-slate-100"
            >
              <IconGlyph name="close" size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto">
            {sceneGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-text hover:bg-slate-100"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            fullWidth
            onClick={handleReset}
            disabled={resetting}
          >
            <IconGlyph name="refresh" size={18} />
            {resetting ? "初期化しています…" : "デモをリセット"}
          </Button>
          <p className="text-xs text-secondary">
            すべてのデモケースを初期化し、Homeへ戻ります。（モックデータのみが対象です）
          </p>
        </div>
      </div>
    </>
  );
}
