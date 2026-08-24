import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuringPanel } from "@/components/voc/studio/StructuringPanel";
import { Badge } from "@/components/voc/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/voc/ui/card";
import { getRawVoc } from "@/lib/voc/data/queries";
import { RAW_VOC_STATUS_LABELS, formatDate } from "@/lib/voc/labels";

export const dynamic = "force-dynamic";

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRawVoc(id);
  if (!data) notFound();
  const { raw, source, knowledge } = data;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/studio/sources/${source.id}`}
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {source.name}へ戻る
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">{raw.rawTitle}</h1>
          <Badge variant={raw.status === "structured" ? "success" : "secondary"}>
            {RAW_VOC_STATUS_LABELS[raw.status]}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Original VoC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Source</p>
              <p className="text-sm text-slate-800">{raw.sourceName}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">URL</p>
              <a
                href={raw.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline"
              >
                {raw.sourceUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Published</p>
              <p className="text-sm text-slate-800">{formatDate(raw.publishedAt)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-400">Raw Text</p>
              <p className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                {raw.rawText}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Structured Knowledge</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <StructuringPanel rawVocId={raw.id} knowledge={knowledge} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
