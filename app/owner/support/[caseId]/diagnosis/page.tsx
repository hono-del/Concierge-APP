"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { LoadingState } from "@/components/ui/LoadingState";
import { SimilarCaseComments } from "@/components/troubleshooting/SimilarCaseComments";
import type { SupportCaseDetailResponse } from "@/types";

export default function DiagnosisPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const caseId = params.caseId;

  const [detail, setDetail] = useState<SupportCaseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCase() {
      try {
        const response = await fetch(`/api/v1/support-cases/${caseId}`);
        if (!response.ok) {
          throw new Error("failed");
        }
        const data = (await response.json()) as SupportCaseDetailResponse;
        if (cancelled) return;

        if (!data.case.diagnosis) {
          router.replace(`/owner/support/${caseId}/clarify`);
          return;
        }
        setDetail(data);
      } catch {
        if (!cancelled) {
          setErrorMessage("診断結果の取得に失敗しました。");
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

  const topCause = detail?.case.diagnosis?.causes[0];

  return (
    <div>
      <PageHeader title="診断結果" backHref={`/owner/support/${caseId}/clarify`} />
      <div className="flex flex-col gap-5 px-4 py-5">
        {loading ? <LoadingState label="原因候補を確認しています…" /> : null}
        {!loading && errorMessage ? (
          <p role="alert" className="text-sm text-danger">
            {errorMessage}
          </p>
        ) : null}

        {!loading && topCause ? (
          <>
            <Card className="border-amber-200 bg-amber-50">
              <CardBody className="flex flex-col gap-2">
                {topCause.similarCaseCount !== undefined ? (
                  <div className="flex items-center gap-2 text-attention">
                    <IconGlyph name="chart-bar" size={20} />
                    <p className="text-base font-bold">
                      同じ症状の事例が{topCause.similarCaseCount}件あります
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-attention">
                    <IconGlyph name="alert-triangle" size={20} />
                    <p className="text-base font-bold">まず確認したいポイント</p>
                  </div>
                )}
                <p className="text-sm text-text">
                  <span className="font-semibold">{topCause.label}</span>
                  の可能性があります。
                </p>
              </CardBody>
            </Card>

            {topCause.similarComments ? (
              <SimilarCaseComments comments={topCause.similarComments} />
            ) : null}

            {detail && detail.case.diagnosis && detail.case.diagnosis.causes.length > 1 ? (
              <Card>
                <CardBody>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    その他の可能性
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {detail.case.diagnosis.causes.slice(1).map((cause) => (
                      <li key={cause.code} className="text-sm text-secondary">
                        ・{cause.label}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ) : null}

            <Button fullWidth onClick={() => router.push(`/owner/support/${caseId}/guidance`)}>
              {detail?.case.diagnosis?.guidanceOfficial.title ?? "確認手順"}を見る
            </Button>
            {detail?.case.diagnosis?.guidanceCommunity ? (
              <p className="text-center text-xs text-secondary">
                「安心・確実タイプ」「実践・時短タイプ」の2種類でご案内します
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
