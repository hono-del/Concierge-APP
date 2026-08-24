/**
 * 共通ユーティリティ関数
 */

type ClassValue = string | number | null | boolean | undefined;

/**
 * 条件付きでクラス名を結合する軽量ヘルパー（clsx/tailwind-mergeの代替）。
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter((value) => typeof value === "string" && value.length > 0).join(" ");
}

/**
 * ISO日時文字列を「MM月DD日 HH:mm」形式に整形する。
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}月${day}日 ${hours}:${minutes}`;
}

/**
 * 0〜1の比率をパーセント表示文字列に整形する。
 */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

/**
 * ブラウザ環境かどうかを判定する。
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}
