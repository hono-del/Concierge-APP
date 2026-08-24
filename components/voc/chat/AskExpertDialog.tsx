"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/voc/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/voc/ui/dialog";
import { Input } from "@/components/voc/ui/input";
import { Label } from "@/components/voc/ui/label";
import { Textarea } from "@/components/voc/ui/textarea";
import { submitExpertQuestion, type ExpertQuestionDraftInput } from "@/lib/voc/actions/chat-actions";
import { saveLocalQuestion } from "@/lib/voc/client-store";

interface AskExpertDialogProps {
  open: boolean;
  draft: ExpertQuestionDraftInput | null;
  onOpenChange: (open: boolean) => void;
  onPosted: (questionId: string) => void;
}

/** Question Generation（要件 #14）：AIが生成した質問文をユーザーが編集してPost */
export function AskExpertDialog({ open, draft, onOpenChange, onPosted }: AskExpertDialogProps) {
  const [form, setForm] = useState<ExpertQuestionDraftInput | null>(draft);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (open) setForm(draft);
  }, [open, draft]);

  async function handlePost() {
    if (!form) return;
    setPosting(true);
    try {
      const res = await submitExpertQuestion(form);
      // Vercelのサーバーレス環境でインスタンス間共有できないため localStorage にも保存
      saveLocalQuestion({
        id: res.id,
        title: form.title,
        vehicleModel: form.vehicleModel,
        symptoms: form.symptoms,
        conditions: form.conditions,
        alreadyChecked: form.alreadyChecked,
        questionText: form.questionText,
        tags: form.tags,
        rewardPoints: form.rewardPoints,
      });
      onPosted(res.id);
      onOpenChange(false);
    } finally {
      setPosting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ask Expert Community</DialogTitle>
          <DialogDescription>
            AIが会話内容から質問文を生成しました。内容を確認・編集してから投稿してください。
          </DialogDescription>
        </DialogHeader>

        {form && (
          <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                className="mt-1"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="vehicle">Vehicle</Label>
              <Input
                id="vehicle"
                className="mt-1"
                value={form.vehicleModel}
                onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                className="mt-1"
                rows={2}
                value={form.symptoms.join("\n")}
                onChange={(e) => setForm({ ...form, symptoms: e.target.value.split("\n") })}
              />
            </div>
            <div>
              <Label htmlFor="conditions">Conditions</Label>
              <Textarea
                id="conditions"
                className="mt-1"
                rows={2}
                value={form.conditions.join("\n")}
                onChange={(e) => setForm({ ...form, conditions: e.target.value.split("\n") })}
              />
            </div>
            <div>
              <Label htmlFor="checked">Already Checked</Label>
              <Textarea
                id="checked"
                className="mt-1"
                rows={2}
                value={form.alreadyChecked.join("\n")}
                onChange={(e) => setForm({ ...form, alreadyChecked: e.target.value.split("\n") })}
              />
            </div>
            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                className="mt-1"
                rows={4}
                value={form.questionText}
                onChange={(e) => setForm({ ...form, questionText: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                className="mt-1"
                value={form.tags.join(", ")}
                onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()) })}
              />
            </div>
            <div>
              <Label htmlFor="reward">Reward Points</Label>
              <Input
                id="reward"
                type="number"
                className="mt-1 w-28"
                value={form.rewardPoints}
                onChange={(e) => setForm({ ...form, rewardPoints: Number(e.target.value) })}
              />
            </div>

            <Button className="w-full" onClick={handlePost} disabled={posting}>
              {posting ? "投稿しています…" : "Post Question"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
