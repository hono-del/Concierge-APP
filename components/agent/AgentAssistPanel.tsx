"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, SectionLabel } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import type {
  AgentResolutionOutcome,
  CauseCandidate,
  ConfidenceLabel,
  Guidance,
  KnowledgeSource,
  Question,
  ResolutionOutcome,
} from "@/types";

const confidenceMeta: Record<ConfidenceLabel, { label: string; variant: "success" | "attention" | "neutral" }> = {
  high: { label: "確度：高", variant: "success" },
  medium: { label: "確度：中", variant: "attention" },
  low: { label: "確度：低", variant: "neutral" },
};

const sourceTypeLabel: Record<KnowledgeSource["type"], string> = {
  owners_manual: "Owner's Manual",
  faq: "FAQ",
  support_case: "Past Support Case",
  product_info: "Product Info",
  community_tip: "Community Tip",
  video: "Video",
};

interface AgentAssistPanelProps {
  caseId: string;
  caseStatus: string;
  nextQuestion: Question | null;
  nextQuestionReason: string | null;
  causes: CauseCandidate[];
  recommendedGuidanceOfficial: Guidance | null;
  recommendedGuidanceCommunity: Guidance | null;
  evidence: KnowledgeSource[];
}

/**
 * Agent Assist（A03〜A06）の右ペイン。
 * 出典: docs/design/system-architecture.md 5.3 AgentAssistPanel
 */
export function AgentAssistPanel({
  caseId,
  caseStatus,
  nextQuestion,
  nextQuestionReason,
  causes,
  recommendedGuidanceOfficial,
  recommendedGuidanceCommunity,
  evidence,
}: AgentAssistPanelProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [submittingResolution, setSubmittingResolution] = useState<string | null>(null);

  const isFinalized = caseStatus === "solved";

  async function handleAnswerSubmit() {
    if (!nextQuestion || !selectedOption) return;
    setSubmittingAnswer(true);
    try {
      await fetch(`/api/v1/support-cases/${caseId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionCode: nextQuestion.code, optionCode: selectedOption }),
      });
      setSelectedOption(undefined);
      router.refresh();
    } finally {
      setSubmittingAnswer(false);
    }
  }

  async function handleResolve(outcome: ResolutionOutcome | AgentResolutionOutcome) {
    setSubmittingResolution(outcome);
    try {
      await fetch(`/api/v1/support-cases/${caseId}/resolution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome,
          channel: "call_center",
          guidanceCode: recommendedGuidanceOfficial?.code,
        }),
      });
      router.refresh();
    } finally {
      setSubmittingResolution(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardBody className="flex flex-col gap-3">
          <SectionLabel>Next Best Question</SectionLabel>
          {nextQuestion ? (
            <>
              <p className="text-lg font-bold text-text">「{nextQuestion.prompt}」</p>
              {nextQuestionReason ? (
                <p className="text-sm text-secondary">なぜ確認する？ → {nextQuestionReason}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {nextQuestion.options.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => setSelectedOption(option.code)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                      selectedOption === option.code
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-slate-300 text-text hover:border-accent/60"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                disabled={!selectedOption || submittingAnswer}
                onClick={handleAnswerSubmit}
                className="self-start"
              >
                {submittingAnswer ? "記録しています…" : "顧客の回答として記録する"}
              </Button>
            </>
          ) : (
            <p className="text-sm text-secondary">
              状況確認は完了しています。原因候補とご案内内容をご確認ください。
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <SectionLabel>Possible Causes</SectionLabel>
          {causes.length === 0 ? (
            <p className="mt-2 text-sm text-secondary">回答が揃うと原因候補が表示されます。</p>
          ) : (
            <ol className="mt-2 space-y-2">
              {causes.map((cause) => {
                const confidence = confidenceMeta[cause.confidenceLabel];
                return (
                  <li
                    key={cause.code}
                    className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
                  >
                    <span className="text-sm font-semibold text-text">
                      {cause.priority}. {cause.label}
                    </span>
                    <Badge variant={confidence.variant}>{confidence.label}</Badge>
                  </li>
                );
              })}
            </ol>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <SectionLabel>Recommended Guidance</SectionLabel>
          {recommendedGuidanceOfficial ? (
            <div className="mt-2 space-y-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                <IconGlyph name="shield-check" size={12} />
                安心・確実タイプ（約{recommendedGuidanceOfficial.estimatedSeconds}秒）
              </p>
              <ol className="space-y-1.5">
                {recommendedGuidanceOfficial.steps.map((step, index) => (
                  <li key={step.id} className="text-sm text-text">
                    <span className="font-semibold text-accent">STEP {index + 1}.</span> {step.title}
                    {step.warning ? (
                      <span className="ml-1 text-xs text-attention">（注意：{step.warning}）</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="mt-2 text-sm text-secondary">まだ推奨ガイダンスはありません。</p>
          )}

          {recommendedGuidanceCommunity ? (
            <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold text-attention">
                <IconGlyph name="video" size={12} />
                実践・時短タイプ（参考情報・約{recommendedGuidanceCommunity.estimatedSeconds}秒）
              </p>
              <ol className="space-y-1.5">
                {recommendedGuidanceCommunity.steps.map((step, index) => (
                  <li key={step.id} className="text-sm text-text">
                    <span className="font-semibold text-attention">STEP {index + 1}.</span> {step.title}
                  </li>
                ))}
              </ol>
              {recommendedGuidanceCommunity.disclaimer ? (
                <p className="text-xs text-secondary">{recommendedGuidanceCommunity.disclaimer}</p>
              ) : null}
            </div>
          ) : null}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <SectionLabel>Evidence</SectionLabel>
          {evidence.length === 0 ? (
            <p className="mt-2 text-sm text-secondary">根拠情報はまだありません。</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {evidence.map((source) => (
                <li key={source.id} className="flex items-center gap-2 text-sm text-text">
                  <IconGlyph name="book" size={14} className="text-secondary" />
                  <span className="font-semibold">{sourceTypeLabel[source.type]}</span>
                  <span className="text-secondary">{source.title}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card className="border-primary/20">
        <CardBody className="flex flex-col gap-3">
          <SectionLabel>Resolution</SectionLabel>
          {isFinalized ? (
            <p className="text-sm text-secondary">このケースは既に解決として記録されています。</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                disabled={submittingResolution !== null}
                onClick={() => handleResolve("solved")}
              >
                {submittingResolution === "solved" ? "記録中…" : "解決"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={submittingResolution !== null}
                onClick={() => handleResolve("not_solved")}
              >
                {submittingResolution === "not_solved" ? "記録中…" : "未解決"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={submittingResolution !== null}
                onClick={() => handleResolve("dealer")}
              >
                {submittingResolution === "dealer" ? "記録中…" : "Dealerへ"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={submittingResolution !== null}
                onClick={() => handleResolve("technical_support")}
              >
                {submittingResolution === "technical_support" ? "記録中…" : "Technical Supportへ"}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
