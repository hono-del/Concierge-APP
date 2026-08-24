import { GenericWebAdapter } from "./generic-web-adapter";
import type { RawSourceItem, SourceAdapter } from "./types";

/**
 * みんカラ向けの薄いAdapter（余力対応 #5）。
 * みんカラはQ&A投稿の閲覧にログインを要する領域があるため、
 * ログイン制限・アクセス制御の回避は行わず、GenericWebAdapterの取得結果をそのまま利用する。
 * 実運用では利用規約・API提供状況を別途確認する必要がある。
 */
export class MinkaraAdapter implements SourceAdapter {
  name = "MinkaraAdapter";
  private readonly generic = new GenericWebAdapter();

  canHandle(url: string): boolean {
    return url.includes("minkara.carview.co.jp");
  }

  async collect(url: string): Promise<RawSourceItem[]> {
    return this.generic.collect(url);
  }
}
