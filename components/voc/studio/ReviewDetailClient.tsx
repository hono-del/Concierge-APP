"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SafetyNotice } from "@/components/voc/SafetyNotice";
import { SourceBadge } from "@/components/voc/SourceBadge";
import { TrustBadge } from "@/components/voc/TrustBadge";
import { ReviewActions } from "@/components/voc/studio/ReviewActions";
import { Badge } from "@/components/voc/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/voc/ui/card";
import { buildStructuredFromExpertAnswer, detectQuickCategory, detectSafetyLevel } from "@/lib/voc/ai/pure-utils";
import { getLocalAnswer, type LocalAnswer } from "@/lib/voc/client-store";
import { CATEGORY_LABELS } from "@/lib/voc/labels";

interface ServerDetail {
  answer: {
    id: string;
    answerText: string;
    status: string;
    createdAt: string;
    contributor: {
      name: string;
      badge: string;
      knowledgeLevel: number;
      points: number;
    };
  };
  question: {
    title: string;
    vehicleModel: string;
    questionText: string;
    tags: string[];
    symptoms: string[];
    conditions: string[];
    rewardPoints: number;
  };
  category: string;
  safetyLevel: "low" | "medium" | "high";
  structured: ReturnType<typeof buildStructuredFromExpertAnswer>;
  similarKnowledge: Array<{
    id: string;
    issueTitle: string;
    source: { type: string };
  }>;
  official: {
    issueTitle: string;
    checks: Array<{ action: string }>;
  } | null;
}

interface ReviewDetailClientProps {
  serverId: string;
  serverDetail: ServerDetail | null;
}

export function ReviewDetailClient({ serverId, serverDetail }: ReviewDetailClientProps) {
  const [detail, setDetail] = useState<ServerDetail | null>(serverDetail);
  const [loading, setLoading] = useState(!serverDetail);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (serverDetail) return;

    const local: LocalAnswer | null = getLocalAnswer(serverId);
    if (!local) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const category = detectQuickCategory(`${local.questionTitle} ${local.answerText}`) ?? "other";
    const safetyLevel = detectSafetyLevel(`${local.questionTitle} ${local.answerText}`);
    const structured = buildStructuredFromExpertAnswer({
      questionTitle: local.questionTitle,
      questionVehicleModel: local.questionVehicleModel,
      symptoms: local.questionSymptoms,
      conditions: local.questionConditions,
      answerText: local.answerText,
      contributorName: local.contributorName,
      contributorBadge: local.contributorBadge,
    });

    setDetail({
      answer: {
        id: local.id,
        answerText: local.answerText,
        status: local.status,
        createdAt: local.createdAt,
        contributor: {
          name: local.contributorName,
          badge: local.contributorBadge,
          knowledgeLevel: local.contributorKnowledgeLevel,
          points: local.contributorPoints,
        },
      },
      question: {
        title: local.questionTitle,
        vehicleModel: local.questionVehicleModel,
        questionText: "",
        tags: local.questionTags,
        symptoms: local.questionSymptoms,
        conditions: local.questionConditions,
        rewardPoints: local.questionRewardPoints,
      },
      category,
      safetyLevel,
      structured,
      similarKnowledge: [],
      official: null,
    });
    setLoading(false);
  }, [serverId, serverDetail]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-slate-400">読み込み中…</div>
    );
  }

  if (notFound || !detail) {
    return (
      <div className="space-y-4">
        <Link
          href="/studio/review"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Review一覧へ戻る
        </Link>
        <p className="text-sm text-slate-500">この回答は見つかりませんでした。</p>
      </div>
    );
  }

  const { answer, question, category, safetyLevel, structured, similarKnowledge, official } = detail;
  const isPending = answer.status === "pending";

  return (
    <div className="space-y-6">
      <Link
        href="/studio/review"
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Review一覧へ戻る
      </Link>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <p className="font-semibold text-slate-900">{question.title}</p>
              {question.questionText && (
                <p className="whitespace-pre-wrap leading-relaxed text-slate-600">{question.questionText}</p>
              )}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {question.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Expert Answer</CardTitle>
              <Badge variant={isPending ? "warning" : answer.status === "rejected" ? "secondary" : "success"}>
                {answer.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {answer.contributor.name.slice(0, 1)}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{answer.contributor.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {answer.contributor.badge} ・ Knowledge Level {answer.contributor.knowledgeLevel} ・{" "}
                    {answer.contributor.points.toLocaleString()} pt
                  </p>
                </div>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{answer.answerText}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Structured Result（プレビュー）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-center gap-2">
                <SourceBadge sourceType="expert" />
                <span className="text-xs text-slate-500">{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Resolutions</p>
                <ul className="space-y-0.5 text-slate-700">
                  {structured.resolutions.map((r, i) => (
                    <li key={i}>・{r.action}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Checks</p>
                <ol className="space-y-0.5 text-slate-700">
                  {structured.checks.map((c) => (
                    <li key={c.order}>
                      {c.order}. {c.action}
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>

          {isPending && (
            <Card>
              <CardHeader>
                <CardTitle>判断</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ReviewActions
                  answerId={answer.id}
                  answerText={answer.answerText}
                  contributorName={answer.contributor.name}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trust Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <TrustBadge trust={structured.trust} sourceType="expert" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <p className="text-sm capitalize text-slate-800">Level: {safetyLevel}</p>
              <SafetyNotice safety={{ level: safetyLevel, requiresOfficialConfirmation: safetyLevel === "high" }} />
            </CardContent>
          </Card>

          {official && (
            <Card>
              <CardHeader>
                <CardTitle>Official Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pt-0 text-sm">
                <p className="font-medium text-slate-900">{official.issueTitle}</p>
                <p className="text-xs text-slate-500">{official.checks.map((c) => c.action).join(" → ")}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Similar Knowledge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {similarKnowledge.length === 0 && <p className="text-xs text-slate-400">類似事例はまだありません</p>}
              {similarKnowledge.map((k) => (
                <Link
                  key={k.id}
                  href={`/studio/knowledge/${k.id}`}
                  className="block rounded-md border border-slate-100 px-2.5 py-2 hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <SourceBadge sourceType={k.source.type as never} />
                  </div>
                  <p className="text-xs font-medium text-slate-800">{k.issueTitle}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
