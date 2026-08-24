import { seedRawVoc } from "../mock-data/raw-voc";
import { seedSources } from "../mock-data/sources";
import type { RawSourceItem, SourceAdapter } from "./types";

/**
 * Mode B: Demo Snapshot（要件 #17）
 * 取得制限・サイト変更・ネットワーク制限などがある場合に必ず利用できる、事前保存済みのサンプルデータ。
 * URLからSourceを特定し、対応するデモ用Raw VoCスナップショットを返す。
 */
export class DemoSnapshotAdapter implements SourceAdapter {
  name = "DemoSnapshotAdapter";

  // Demo Snapshotは常にフォールバック先として使えるため、URLの種類を問わず対応する
  canHandle(): boolean {
    return true;
  }

  async collect(url: string): Promise<RawSourceItem[]> {
    const source = seedSources.find((s) => s.url === url || url.startsWith(s.url));
    const items = source
      ? seedRawVoc.filter((item) => item.sourceId === source.id)
      : seedRawVoc;

    return items.map((item) => ({
      rawTitle: item.rawTitle,
      rawText: item.rawText,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      publishedAt: item.publishedAt,
    }));
  }
}
