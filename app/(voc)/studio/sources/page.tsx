import { SourceCard } from "@/components/voc/studio/SourceCard";
import { listSources } from "@/lib/voc/data/queries";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const sources = await listSources();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Knowledge Studio</p>
        <h1 className="text-2xl font-bold text-slate-900">Source Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Web / VoCの収集元を管理します。Collectを実行すると、robots.txtや利用規約を尊重した収集を試行し、
          失敗時は自動でDemo Snapshotへフォールバックします。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
}
