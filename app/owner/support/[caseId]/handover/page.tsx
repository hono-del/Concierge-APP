"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import type { HandoverSummaryResponse } from "@/types";

export default function SupportHandoverPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const caseId = params.caseId;

  const [summary, setSummary] = useState<HandoverSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadSummary() {
      try {
        const response = await fetch(`/api/v1/support-cases/${caseId}/handover`);
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as HandoverSummaryResponse;
        if (!cancelled) setSummary(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadSummary();
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  async function handleConsult() {
    setSubmitting(true);
    try {
      await fetch(`/api/v1/support-cases/${caseId}/handover`, { method: "POST" });
      router.push(`/agent/cases/${caseId}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="サポートへの引き継ぎ" backHref="/owner" />
      <div className="flex flex-col gap-5 px-4 py-5">
        {loading ? <LoadingState /> : null}

        {!loading && summary ? (
          <>
            <p className="text-sm text-secondary">
              まだ解決していないようです。これまでの内容を整理しました。サポートスタッフに相談しますか？
            </p>

            <Card>
              <CardBody className="flex flex-col gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    Vehicle
                  </p>
                  <p className="mt-0.5 font-semibold text-text">
                    {summary.vehicle.model}（{summary.vehicle.modelYear}年式）
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    Issue
                  </p>
                  <p className="mt-0.5 font-semibold text-text">{summary.issue}</p>
                </div>
                {summary.conditions.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                      Condition
                    </p>
                    <ul className="mt-0.5 space-y-0.5 text-text">
                      {summary.conditions.map((condition) => (
                        <li key={condition}>・{condition}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {summary.checkedItems.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                      Already Checked
                    </p>
                    <ul className="mt-0.5 space-y-0.5 text-text">
                      {summary.checkedItems.map((item) => (
                        <li key={item}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {summary.guidance ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                      Guidance
                    </p>
                    <p className="mt-0.5 text-text">{summary.guidance}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    Result
                  </p>
                  <p className="mt-0.5 text-text">{summary.result}</p>
                </div>
              </CardBody>
            </Card>

            <p className="text-xs text-secondary">
              この内容は外部システムへ送信されず、デモ内のAgent
              Assist画面へそのまま引き継がれます。実際のサポート窓口には送信されません。
            </p>

            <div className="flex flex-col gap-3">
              <Button fullWidth disabled={submitting} onClick={handleConsult}>
                {submitting ? "引き継いでいます…" : "相談する"}
              </Button>
              <Button
                fullWidth
                variant="outline"
                disabled={submitting}
                onClick={() => router.push("/owner")}
              >
                あとで
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
