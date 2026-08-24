"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { LoadingState } from "@/components/ui/LoadingState";
import type { SupportCaseDetailResponse } from "@/types";

export default function ResolutionCheckPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const caseId = params.caseId;

  const [guidanceCode, setGuidanceCode] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"solved" | "not_solved" | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCase() {
      try {
        const response = await fetch(`/api/v1/support-cases/${caseId}`);
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as SupportCaseDetailResponse;
        if (cancelled) return;
        const storedCode = window.localStorage.getItem("concierge:lastGuidanceCode");
        setGuidanceCode(storedCode ?? data.case.diagnosis?.guidanceOfficial.code);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadCase();
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  async function handleResult(outcome: "solved" | "not_solved") {
    setSubmitting(true);
    try {
      await fetch(`/api/v1/support-cases/${caseId}/resolution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome, channel: "owner", guidanceCode }),
      });

      window.localStorage.removeItem("concierge:lastGuidanceTrack");
      window.localStorage.removeItem("concierge:lastGuidanceCode");

      if (outcome === "solved") {
        setResult("solved");
      } else {
        router.push(`/owner/support/${caseId}/handover`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="解決確認" backHref={`/owner/support/${caseId}/guidance`} />
      <div className="flex flex-col gap-5 px-4 py-5">
        {loading ? <LoadingState /> : null}

        {!loading && result === "solved" ? (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardBody className="flex flex-col items-center gap-3 py-6 text-center">
              <IconGlyph name="check-circle" size={36} className="text-success" />
              <p className="text-lg font-bold text-text">解決してよかったです！</p>
              <p className="text-sm text-secondary">
                ご利用ありがとうございました。他に気になることがあれば、いつでもご相談ください。
              </p>
              <Link href="/owner">
                <Button>Homeへ戻る</Button>
              </Link>
            </CardBody>
          </Card>
        ) : null}

        {!loading && result === null ? (
          <>
            <p className="text-lg font-bold text-text">解決しましたか？</p>
            <div className="flex flex-col gap-3">
              <Button fullWidth disabled={submitting} onClick={() => handleResult("solved")}>
                解決した
              </Button>
              <Button
                fullWidth
                variant="outline"
                disabled={submitting}
                onClick={() => handleResult("not_solved")}
              >
                まだ開かない
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
