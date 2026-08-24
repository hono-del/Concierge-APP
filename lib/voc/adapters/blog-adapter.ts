import { GenericWebAdapter } from "./generic-web-adapter";
import type { RawSourceItem, SourceAdapter } from "./types";

/**
 * ブログ・レビューサイト向けの薄いAdapter（余力対応 #5）。
 * 本文の大量転載は行わず、GenericWebAdapterで取得した内容を要約用に短く保持する想定。
 */
export class BlogAdapter implements SourceAdapter {
  name = "BlogAdapter";
  private readonly generic = new GenericWebAdapter();

  canHandle(url: string): boolean {
    return /blog|journal|review|matome/i.test(url);
  }

  async collect(url: string): Promise<RawSourceItem[]> {
    return this.generic.collect(url);
  }
}
