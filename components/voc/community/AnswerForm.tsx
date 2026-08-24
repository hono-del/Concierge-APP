"use client";

import { Award, CheckCircle2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitAnswer } from "@/lib/voc/actions/community-actions";
import { saveLocalAnswer } from "@/lib/voc/client-store";
import { Button } from "@/components/voc/ui/button";
import { Card } from "@/components/voc/ui/card";
import { Textarea } from "@/components/voc/ui/textarea";
import type { Contributor, ExpertQuestion } from "@/lib/voc/types";

interface AnswerFormProps {
  question: Pick<
    ExpertQuestion,
    | "id"
    | "title"
    | "vehicleModel"
    | "rewardPoints"
    | "tags"
    | "symptoms"
    | "conditions"
  >;
  contributor: Contributor;
}

/** Expert Answer投稿フォーム（要件 #16）。サンプル回答者として固定Contributorを利用する。 */
export function AnswerForm({ question, contributor }: AnswerFormProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    setPosting(true);
    try {
      const { id } = await submitAnswer(question.id, contributor.id, text.trim());

      // Vercelのインスタンス間でストアが共有されないため localStorage にも保存
      saveLocalAnswer({
        id,
        questionId: question.id,
        questionTitle: question.title,
        questionVehicleModel: question.vehicleModel,
        questionRewardPoints: question.rewardPoints,
        questionTags: question.tags,
        questionSymptoms: question.symptoms,
        questionConditions: question.conditions,
        contributorId: contributor.id,
        contributorName: contributor.name,
        contributorBadge: contributor.badge,
        contributorKnowledgeLevel: contributor.knowledgeLevel,
        contributorPoints: contributor.points,
        answerText: text.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      setPosted(true);
      router.refresh();
    } finally {
      setPosting(false);
    }
  }

  if (posted) {
    return (
      <Card className="flex items-start gap-2 border-emerald-200 bg-emerald-50 p-4">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">回答を投稿しました</p>
          <p className="mt-0.5 text-xs leading-relaxed text-emerald-700">
            回答はKnowledge候補としてKnowledge StudioのReview Workflowへ送られました。
            承認されると新しいKnowledgeとして追加され、あなたにReward Pointが付与されます。
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
          {contributor.name.slice(0, 1)}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{contributor.name}</p>
          <p className="text-[11px] text-slate-400">
            {contributor.badge} ・ Knowledge Level {contributor.knowledgeLevel} ・ {contributor.points.toLocaleString()} pt
          </p>
        </div>
      </div>
      <Textarea
        rows={5}
        placeholder="実際に効いた確認方法や対処方法を共有してください…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1 text-[11px] text-amber-600">
          <Award className="h-3.5 w-3.5" />
          採用されると+100 Knowledge Points
        </p>
        <Button onClick={handleSubmit} disabled={posting || !text.trim()}>
          <Send className="h-3.5 w-3.5" />
          {posting ? "投稿しています…" : "Submit Answer"}
        </Button>
      </div>
    </Card>
  );
}
