import type { RawSourceItem } from "../types";

export type { RawSourceItem };

export interface CollectResult {
  items: RawSourceItem[];
  /** 実際にLive Collectionへ接続できたか。falseの場合はDemo Snapshotへフォールバックしたことを示す */
  live: boolean;
  /** フォールバックした場合の理由（デモ演出のログ表示用） */
  fallbackReason?: string;
}

/**
 * SourceAdapterパターン（要件 #5, #18）
 * 外部サイトへのアクセスは robots.txt / 利用規約 / rate limit / access restriction を尊重し、
 * CAPTCHA回避・ログイン制限回避・アクセス制御迂回・高頻度リクエストは行わない。
 * Live Collectionが失敗した場合は必ずDemo Snapshotへフォールバックする。
 */
export interface SourceAdapter {
  name: string;
  canHandle(url: string): boolean;
  collect(url: string): Promise<RawSourceItem[]>;
}
