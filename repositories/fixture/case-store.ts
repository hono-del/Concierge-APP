import type { SupportCase } from "@/types";

/**
 * ケースのインメモリ Fixture ストア。
 * Next.js の開発サーバーでのモジュール再評価に耐えるよう globalThis に保持する。
 * 本番のサーバーレス環境ではインスタンス間で共有されないため、
 * PoC移行時はSupabase実装（repositories/supabase）へ置き換える想定。
 */

interface GlobalWithCaseStore {
  __conciergeCaseStore?: Map<string, SupportCase>;
}

const globalRef = globalThis as unknown as GlobalWithCaseStore;

function getStore(): Map<string, SupportCase> {
  if (!globalRef.__conciergeCaseStore) {
    globalRef.__conciergeCaseStore = new Map<string, SupportCase>();
  }
  return globalRef.__conciergeCaseStore;
}

export function saveCase(supportCase: SupportCase): SupportCase {
  getStore().set(supportCase.id, supportCase);
  return supportCase;
}

export function getCaseById(id: string): SupportCase | undefined {
  return getStore().get(id);
}

export function listCases(): SupportCase[] {
  return Array.from(getStore().values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function clearAllCases(): void {
  getStore().clear();
}
