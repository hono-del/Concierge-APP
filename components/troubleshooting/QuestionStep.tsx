"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import type { QuestionOption } from "@/types";

export interface QuestionStepProps {
  questionCode: string;
  prompt: string;
  options: QuestionOption[];
  selectedCode?: string;
  progress: { current: number; total: number };
  onAnswer: (questionCode: string, optionCode: string) => void;
  onBack?: () => void;
  submitting?: boolean;
}

/**
 * 状況確認（U06 Clarification）で1問ずつ質問を表示するClient Component。
 * 出典: docs/design/system-architecture.md 5.3 QuestionStep
 */
export function QuestionStep({
  questionCode,
  prompt,
  options,
  selectedCode,
  progress,
  onAnswer,
  onBack,
  submitting = false,
}: QuestionStepProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedCode);

  return (
    <div className="flex flex-col gap-5">
      <ProgressIndicator current={progress.current} total={progress.total} />

      <div>
        <p className="text-sm text-secondary">状況を確認します。</p>
        <p className="mt-1 text-lg font-bold text-text">{prompt}</p>
      </div>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label={prompt}>
        {options.map((option) => {
          const isSelected = selected === option.code;
          return (
            <button
              key={option.code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(option.code)}
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

      <div className="mt-2 flex gap-3">
        {onBack ? (
          <Button variant="outline" onClick={onBack} disabled={submitting}>
            戻る
          </Button>
        ) : null}
        <Button
          fullWidth
          disabled={!selected || submitting}
          onClick={() => selected && onAnswer(questionCode, selected)}
        >
          {submitting ? "確認しています…" : "次へ"}
        </Button>
      </div>
    </div>
  );
}
