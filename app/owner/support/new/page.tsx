"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { getSampleIssues } from "@/domain/troubleshooting/engine";
import { DEMO_USER_ID, DEMO_VEHICLE_ID } from "@/lib/mock-data";
import type { ApiErrorBody, CreateSupportCaseResponse } from "@/types";

const sampleIssues = getSampleIssues();

export default function IssueInputPage() {
  const router = useRouter();
  const [issueText, setIssueText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!issueText.trim() || submitting) {
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/v1/support-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          vehicleId: DEMO_VEHICLE_ID,
          issueText,
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiErrorBody;
        if (body.error.code === "SCENARIO_NOT_FOUND") {
          setErrorMessage(
            "申し訳ございません。今回のデモではこの困りごとに対応するシナリオをご用意できていません。下記のサンプルからお試しください。"
          );
        } else {
          setErrorMessage(body.error.message);
        }
        return;
      }

      const data = (await response.json()) as CreateSupportCaseResponse;
      window.localStorage.setItem("concierge:activeCaseId", data.id);
      router.push(`/owner/support/${data.id}/clarify`);
    } catch {
      setErrorMessage("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="困りごとを相談する" backHref="/owner" />
      <div className="flex flex-col gap-5 px-4 py-5">
        <p className="text-sm text-secondary">
          困っていることを短く入力してください。状況を確認しながら、解決までサポートします。
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="issue-text" className="text-sm font-semibold text-text">
            困りごとの内容
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2.5 focus-within:border-accent">
            <IconGlyph name="chat" size={18} className="shrink-0 text-secondary" />
            <input
              id="issue-text"
              name="issue-text"
              type="text"
              value={issueText}
              onChange={(event) => setIssueText(event.target.value)}
              placeholder="例：後ろのドアが開かない"
              className="w-full bg-transparent text-base text-text outline-none placeholder:text-slate-400"
              autoComplete="off"
            />
          </div>

          {errorMessage ? (
            <p role="alert" className="text-sm text-danger">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={submitting || !issueText.trim()}>
            {submitting ? "確認しています…" : "送信する"}
          </Button>
        </form>

        <Card>
          <CardBody className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-text">よくある困りごとの例</p>
            <div className="flex flex-wrap gap-2">
              {sampleIssues.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setIssueText(sample)}
                  className="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-text hover:border-accent hover:text-accent"
                >
                  {sample}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
