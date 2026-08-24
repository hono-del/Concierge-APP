"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Award, Car, Clock } from "lucide-react";
import Link from "next/link";
import { getLocalQuestion } from "@/lib/voc/client-store";
import { AnswerForm } from "@/components/voc/community/AnswerForm";
import { Badge } from "@/components/voc/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/voc/ui/card";
import type { Contributor, ExpertQuestion, ExpertQuestionDetail } from "@/lib/voc/types";
import { formatRelativeDate } from "@/lib/voc/labels";

const ANSWER_STATUS_LABEL: Record<string, string> = {
  pending: "Studio審査中",
  accepted: "Knowledgeに採用",
  edited_accepted: "Knowledgeに採用（編集済み）",
  rejected: "不採用",
};

const ANSWER_STATUS_VARIANT: Record<string, "warning" | "success" | "secondary"> = {
  pending: "warning",
  accepted: "success",
  edited_accepted: "success",
  rejected: "secondary",
};

interface Props {
  /** サーバーサイドで取得済みの質問（存在する場合） */
  serverQuestion: ExpertQuestionDetail | null;
  /** ページの [id] パラメータ */
  id: string;
  /** 回答フォームのデフォルトコントリビューター */
  defaultContributor: Contributor | null;
}

export function QuestionDetailClient({ serverQuestion, id, defaultContributor }: Props) {
  const [question, setQuestion] = useState<(ExpertQuestion & { answers: ExpertQuestionDetail["answers"] }) | null>(
    serverQuestion
  );
  const [loading, setLoading] = useState(!serverQuestion);

  useEffect(() => {
    if (serverQuestion) return; // サーバーデータがあればそちらを優先
    // localStorage からフォールバック
    const local = getLocalQuestion(id);
    if (local) {
      setQuestion({ ...local, answers: [] });
    }
    setLoading(false);
  }, [id, serverQuestion]);

  if (loading) {
    return <p className="py-12 text-center text-sm text-slate-400">読み込み中…</p>;
  }

  if (!question) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-slate-500">質問が見つかりません。</p>
        <Link href="/community" className="mt-4 inline-block text-sm font-medium underline">
          Community Feedへ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Community Feedへ戻る
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Car className="h-3 w-3" />
              {question.vehicleModel}
            </Badge>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
              <Award className="h-3.5 w-3.5" />+{question.rewardPoints}pt
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="h-3 w-3" />
              {formatRelativeDate(question.createdAt)}
            </span>
          </div>
          <CardTitle className="text-lg">{question.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{question.questionText}</p>

          {question.symptoms.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase text-slate-400">Symptoms</p>
              <ul className="space-y-0.5 text-sm text-slate-700">
                {question.symptoms.map((s, i) => (
                  <li key={i}>・{s}</li>
                ))}
              </ul>
            </div>
          )}

          {question.conditions.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase text-slate-400">Conditions</p>
              <p className="text-sm text-slate-700">{question.conditions.join(" ・ ")}</p>
            </div>
          )}

          {question.alreadyChecked.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase text-slate-400">Already Checked</p>
              <ul className="space-y-0.5 text-sm text-slate-700">
                {question.alreadyChecked.map((c, i) => (
                  <li key={i}>・{c}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {question.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Answers（{question.answers.length}）
        </p>
        {question.answers.map((answer) => (
          <Card key={answer.id} className="p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {answer.contributor.name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{answer.contributor.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {answer.contributor.badge} ・ Knowledge Level {answer.contributor.knowledgeLevel}
                  </p>
                </div>
              </div>
              <Badge variant={ANSWER_STATUS_VARIANT[answer.status]}>{ANSWER_STATUS_LABEL[answer.status]}</Badge>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{answer.answerText}</p>
          </Card>
        ))}
        {question.answers.length === 0 && (
          <p className="text-xs text-slate-400">まだ回答がありません。最初の回答者になりましょう。</p>
        )}
      </div>

      {defaultContributor && <AnswerForm questionId={question.id} contributor={defaultContributor} />}
    </div>
  );
}
