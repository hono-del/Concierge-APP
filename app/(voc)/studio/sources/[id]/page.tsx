import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/voc/ui/badge";
import { Card, CardContent } from "@/components/voc/ui/card";
import { getSource, listRawVocBySource } from "@/lib/voc/data/queries";
import { RAW_VOC_STATUS_LABELS, SOURCE_TYPE_LABELS, formatRelativeDate } from "@/lib/voc/labels";

export const dynamic = "force-dynamic";

export default async function SourceItemsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const source = await getSource(id);
  if (!source) notFound();
  const items = await listRawVocBySource(id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/studio/sources"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Source Managementへ戻る
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{source.name}</h1>
          <Badge>{SOURCE_TYPE_LABELS[source.sourceType]}</Badge>
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 hover:underline"
        >
          {source.url}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Raw VoC（{items.length}件）
        </p>
        {items.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-sm text-slate-400">
              まだ収集されたVoCがありません。Source ManagementからCollectを実行してください。
            </CardContent>
          </Card>
        )}
        {items.map((item) => (
          <Link key={item.id} href={`/studio/collection/${item.id}`}>
            <Card className="transition hover:border-slate-300 hover:bg-slate-50">
              <CardContent className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{item.rawTitle}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{item.rawText}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{formatRelativeDate(item.collectedAt)}</p>
                </div>
                <Badge variant={item.status === "structured" ? "success" : "secondary"} className="shrink-0">
                  {RAW_VOC_STATUS_LABELS[item.status]}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
