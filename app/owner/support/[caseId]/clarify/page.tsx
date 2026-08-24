"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { troubleshootingScenarios } from "@/domain/troubleshooting/scenarios";
import type { Question, SupportCaseDetailResponse } from "@/types";

/**
 * 状況確認（U06）。
 * 質問を1画面に統合して表示し、送信を1回にまとめることで往復回数を削減する。
 * 「一般的な確認手順を見る」を選ぶと、回答をスキップしてその時点の情報で診断を確定できる。
 */
export default function ClarificationPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const caseId = params.caseId;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCase() {
      try {
        const response = await fetch(`/api/v1/support-cases/${caseId}`);
        if (!response.ok) {
          throw new Error("ケース情報を取得できませんでした。");
        }
        const detail = (await response.json()) as SupportCaseDetailResponse;
        if (cancelled) return;

        if (detail.case.diagnosis) {
          router.replace(`/owner/support/${caseId}/diagnosis`);
          return;
        }

        const scenario = troubleshootingScenarios.find(
          (candidate) => candidate.code === detail.case.issueCode
        );
        setQuestions(
          [...(scenario?.questions ?? [])].sort((a, b) => a.sequence - b.sequence)
        );

        const initialAnswers: Record<string, string> = {};
        for (const answer of detail.case.answers) {
          if (answer.optionCode) {
            initialAnswers[answer.questionCode] = answer.optionCode;
          }
        }
        setAnswers(initialAnswers);
      } catch {
        if (!cancelled) {
          setErrorMessage("ケース情報の取得に失敗しました。最初からお試しください。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCase();
    return () => {
      cancelled = true;
    };
  }, [caseId, router]);

  const allAnswered = questions.length > 0 && questions.every((question) => answers[question.code]);

  async function submitAnswers(finalize: boolean) {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/v1/support-cases/${caseId}/answers/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionCode, optionCode]) => ({
            questionCode,
            optionCode,
          })),
          finalize,
        }),
      });

      if (!response.ok) {
        throw new Error("回答の送信に失敗しました。");
      }

      router.push(`/owner/support/${caseId}/diagnosis`);
    } catch {
      setErrorMessage("回答の送信に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="状況確認" backHref="/owner" />
      <div className="flex flex-col gap-6 px-4 py-5">
        {loading ? <LoadingState label="状況を確認しています…" /> : null}

        {!loading && errorMessage ? (
          <p role="alert" className="text-sm text-danger">
            {errorMessage}
          </p>
        ) : null}

        {!loading && questions.length > 0 ? (
          <>
            <p className="text-sm text-secondary">
              {questions.length === 1
                ? "状況をひとつだけ確認します。"
                : "いくつか状況を確認します。分かる範囲でお答えください。"}
            </p>

            {questions.map((question) => (
              <div key={question.code} className="flex flex-col gap-2">
                <p className="text-base font-bold text-text">{question.prompt}</p>
                <div className="flex flex-col gap-2" role="radiogroup" aria-label={question.prompt}>
                  {question.options.map((option) => {
                    const isSelected = answers[question.code] === option.code;
                    return (
                      <button
                        key={option.code}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={submitting}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [question.code]: option.code }))
                        }
                        className={`min-h-[44px] rounded-2xl border px-4 py-3 text-left text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          isSelected
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-slate-300 bg-white text-text hover:border-accent/60"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-2 flex flex-col gap-3">
              <Button
                fullWidth
                disabled={!allAnswered || submitting}
                onClick={() => submitAnswers(false)}
              >
                {submitting ? "診断しています…" : "この内容で診断する"}
              </Button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => submitAnswers(true)}
                className="text-center text-sm font-semibold text-accent underline-offset-2 hover:underline disabled:opacity-50"
              >
                質問に回答せず、まず一般的な確認手順を見る
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
