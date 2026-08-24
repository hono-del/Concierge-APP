"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/voc/ui/button";

/**
 * Error Handling（要件 #29 Phase5）：デモ中に予期しない例外が発生しても、
 * 画面全体がクラッシュせずリトライできるようにする。
 */
export default function VocError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[VoC Demo Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </span>
      <div>
        <p className="text-lg font-bold text-slate-900">予期しないエラーが発生しました</p>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          デモデータの読み込み中に問題が発生しました。もう一度お試しいただくか、Dashboardへ戻ってください。
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => reset()}>
          再試行
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href="/studio">Dashboardへ戻る</a>
        </Button>
      </div>
    </div>
  );
}
