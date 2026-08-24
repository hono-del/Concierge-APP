"use client";

import { ChevronRight, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/voc/cn";
import { demoSteps } from "./demo-scenario";

/**
 * デモ導線（要件 #27）：Demo Scenarioボタン。
 * 押すと9ステップのデモシナリオを順番に案内し、各ステップのリンクへ直接移動できる。
 */
export function DemoTourMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Demo Scenario
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">デモシナリオ</p>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
              Collectから Rewardまで、Knowledgeが育つ循環を順番に体験できます。
            </p>
            <ol className="max-h-[60vh] space-y-0.5 overflow-y-auto">
              {demoSteps.map((s) => (
                <li key={s.step}>
                  <Link
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50"
                    )}
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 group-hover:bg-slate-900 group-hover:text-white">
                      {s.step}
                    </span>
                    <span className="flex-1">
                      <span className="block text-xs font-semibold text-slate-800">{s.title}</span>
                      <span className="block text-[11px] leading-snug text-slate-500">
                        {s.description}
                      </span>
                    </span>
                    <ChevronRight className="mt-1 h-3 w-3 shrink-0 text-slate-300 group-hover:text-slate-600" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
