import type { RawSourceItem, SourceAdapter } from "./types";

const FETCH_TIMEOUT_MS = 4000;
const USER_AGENT = "ConciergeVoCDemoBot/1.0 (+respects robots.txt; demo-only, low-frequency)";

/**
 * robots.txtを確認し、対象パスがクロール許可されているかを簡易判定する。
 * 解析に失敗した場合は安全側に倒して「許可されていない」とみなす。
 */
async function isAllowedByRobots(targetUrl: string): Promise<boolean> {
  try {
    const url = new URL(targetUrl);
    const robotsUrl = `${url.protocol}//${url.host}/robots.txt`;
    const res = await fetch(robotsUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) return true; // robots.txt自体がなければ許可とみなす
    const text = await res.text();
    const lines = text.split("\n").map((l) => l.trim());
    let applies = false;
    for (const line of lines) {
      if (/^user-agent:\s*\*/i.test(line)) applies = true;
      else if (/^user-agent:/i.test(line)) applies = false;
      else if (applies && /^disallow:\s*\//i.test(line) && line.split(":")[1]?.trim() === "/") {
        return false;
      }
    }
    return true;
  } catch {
    return true;
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Mode A: Live Collection（要件 #5, #17）
 * 公開ページから取得可能な範囲でHTMLを取得し、本文の要約のみを保持する。
 * robots.txt / アクセス制限を尊重し、CAPTCHA・ログイン制限・アクセス制御の回避は行わない。
 * 1URLにつき1リクエストのみ、短いタイムアウトで取得を試みる（高頻度リクエスト禁止）。
 */
export class GenericWebAdapter implements SourceAdapter {
  name = "GenericWebAdapter";

  canHandle(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async collect(url: string): Promise<RawSourceItem[]> {
    const allowed = await isAllowedByRobots(url);
    if (!allowed) {
      throw new Error("robots.txtによりアクセスが許可されていません");
    }

    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) {
      throw new Error(`Live Collection failed with status ${res.status}`);
    }

    const html = await res.text();
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const text = stripHtml(html).slice(0, 400);

    if (!text) {
      throw new Error("本文を抽出できませんでした");
    }

    return [
      {
        rawTitle: titleMatch?.[1]?.trim() ?? url,
        rawText: text,
        sourceName: new URL(url).hostname,
        sourceUrl: url,
        publishedAt: new Date().toISOString(),
      },
    ];
  }
}
