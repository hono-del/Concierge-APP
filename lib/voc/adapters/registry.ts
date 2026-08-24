import { BlogAdapter } from "./blog-adapter";
import { DemoSnapshotAdapter } from "./demo-snapshot-adapter";
import { GenericWebAdapter } from "./generic-web-adapter";
import { MinkaraAdapter } from "./minkara-adapter";
import type { CollectResult, SourceAdapter } from "./types";

const demoSnapshotAdapter = new DemoSnapshotAdapter();

/** URLに応じたLive Collection用Adapterの優先順位（先に一致したものを使用） */
const liveAdapters: SourceAdapter[] = [
  new MinkaraAdapter(),
  new BlogAdapter(),
  new GenericWebAdapter(),
];

/**
 * 指定URLからVoCを収集する。
 * Live Collectionを試み、失敗（アクセス制限・タイムアウト・robots.txt不許可・パース失敗など）した場合は
 * 必ずDemo Snapshotへフォールバックし、デモが常に成立するようにする。
 */
export async function collectFromUrl(url: string): Promise<CollectResult> {
  const adapter = liveAdapters.find((a) => a.canHandle(url));

  if (adapter) {
    try {
      const items = await adapter.collect(url);
      if (items.length > 0) {
        return { items, live: true };
      }
      return {
        items: await demoSnapshotAdapter.collect(url),
        live: false,
        fallbackReason: "Live Collectionで有効な項目が取得できませんでした",
      };
    } catch (error) {
      return {
        items: await demoSnapshotAdapter.collect(url),
        live: false,
        fallbackReason:
          error instanceof Error ? error.message : "Live Collectionに失敗しました",
      };
    }
  }

  return {
    items: await demoSnapshotAdapter.collect(url),
    live: false,
    fallbackReason: "対応するAdapterが見つかりませんでした",
  };
}
