import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/voc/ui/button";

export default function VocNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <SearchX className="h-6 w-6 text-slate-400" />
      </span>
      <div>
        <p className="text-lg font-bold text-slate-900">ページが見つかりません</p>
        <p className="mt-1 text-sm text-slate-500">
          お探しのKnowledge / Source / Questionは存在しないか、削除された可能性があります。
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size="sm">
          <Link href="/studio">Knowledge Studioへ</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/chat">Customer Chatへ</Link>
        </Button>
      </div>
    </div>
  );
}
