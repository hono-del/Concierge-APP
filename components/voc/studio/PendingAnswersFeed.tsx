"use client";

import { useEffect, useState } from "react";
import { Award, Clock } from "lucide-react";
import Link from "next/link";
import { getLocalAnswers, type LocalAnswer } from "@/lib/voc/client-store";
import { Badge } from "@/components/voc/ui/badge";
import { Card, CardContent } from "@/components/voc/ui/card";
import { formatRelativeDate } from "@/lib/voc/labels";

interface PendingItem {
  answerId: string;
  answerText: string;
  contributorName: string;
  contributorBadge: string;
  questionTitle: string;
  questionRewardPoints: number;
  createdAt: string;
}

function toItem(a: LocalAnswer): PendingItem {
  return {
    answerId: a.id,
    answerText: a.answerText,
    contributorName: a.contributorName,
    contributorBadge: a.contributorBadge,
    questionTitle: a.questionTitle,
    questionRewardPoints: a.questionRewardPoints,
    createdAt: a.createdAt,
  };
}

interface PendingAnswersFeedProps {
  initialItems: PendingItem[];
}

export function PendingAnswersFeed({ initialItems }: PendingAnswersFeedProps) {
  const [items, setItems] = useState<PendingItem[]>(initialItems);

  useEffect(() => {
    const local = getLocalAnswers().map(toItem);
    if (local.length === 0) return;
    const existingIds = new Set(initialItems.map((i) => i.answerId));
    const newOnes = local.filter((l) => !existingIds.has(l.answerId));
    if (newOnes.length > 0) {
      setItems([...newOnes, ...initialItems]);
    }
  }, [initialItems]);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-xs text-slate-400">
          承認待ちの回答はありません
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link key={item.answerId} href={`/studio/review/${item.answerId}`}>
          <Card className="p-4 transition-colors hover:border-slate-400">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.questionTitle}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{item.answerText}</p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{item.contributorName} ・ {item.contributorBadge}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeDate(item.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <Award className="h-3.5 w-3.5" />+{item.questionRewardPoints}pt
                </span>
                <Badge variant="warning">Pending</Badge>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
