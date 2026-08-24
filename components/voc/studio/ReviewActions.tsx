"use client";

import { Award, Check, Loader2, Pencil, PartyPopper, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/voc/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/voc/ui/dialog";
import { Textarea } from "@/components/voc/ui/textarea";
import { acceptAnswer, rejectAnswer } from "@/lib/voc/actions/review-actions";

interface ReviewActionsProps {
  answerId: string;
  answerText: string;
  contributorName: string;
}

type Mode = "idle" | "editing";

/** Review Workflowの判断アクション（要件 #17〜19） */
export function ReviewActions({ answerId, answerText, contributorName }: ReviewActionsProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");
  const [editedText, setEditedText] = useState(answerText);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ knowledgeId: string; points: number } | null>(null);
  const [rejected, setRejected] = useState(false);

  async function handleAccept(edited?: string) {
    setBusy(true);
    try {
      const res = await acceptAnswer(answerId, edited);
      setResult({ knowledgeId: res.knowledgeId, points: res.rewardPoints });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleReject() {
    setBusy(true);
    try {
      await rejectAnswer(answerId);
      setRejected(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (rejected) {
    return <p className="text-sm text-slate-400">この回答は不採用としました。</p>;
  }

  return (
    <div className="space-y-3">
      {mode === "editing" ? (
        <div className="space-y-2">
          <Textarea rows={5} value={editedText} onChange={(e) => setEditedText(e.target.value)} />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => handleAccept(editedText)} disabled={busy}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              修正内容でKnowledgeに採用
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setMode("idle")} disabled={busy}>
              キャンセル
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button onClick={() => handleAccept()} disabled={busy}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Knowledgeに採用
          </Button>
          <Button variant="outline" onClick={() => setMode("editing")} disabled={busy}>
            <Pencil className="h-3.5 w-3.5" />
            修正して採用
          </Button>
          <Button variant="ghost" onClick={handleReject} disabled={busy}>
            <X className="h-3.5 w-3.5" />
            採用しない
          </Button>
        </div>
      )}

      <Dialog open={Boolean(result)} onOpenChange={(open) => !open && setResult(null)}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <PartyPopper className="h-6 w-6 text-emerald-600" />
            </div>
            <DialogTitle className="text-center">Knowledge Accepted!</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-slate-600">
            {contributorName}さんの回答がKnowledge Baseに追加されました。
          </p>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-lg font-bold text-amber-600">
            <Award className="h-5 w-5" />+{result?.points} Knowledge Points
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Button asChild size="sm">
              <Link href={`/studio/knowledge/${result?.knowledgeId}`}>Knowledgeを見る</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/studio/review">Reviewへ戻る</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
