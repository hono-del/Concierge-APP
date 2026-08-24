import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

/**
 * VoCベースナレッジ構築モック用のPrismaクライアント（SQLite）。
 * Next.jsの開発時ホットリロードでクライアントが多重生成されないようglobalに保持する。
 *
 * Vercel本番環境ではファイルシステムが読み取り専用のため、
 * ビルド時に生成した prisma/dev.db を /tmp/voc.db にコピーして使用する。
 * /tmp は書き込み可能で、関数インスタンスが生きている間は維持される。
 */

const IS_VERCEL = !!process.env.VERCEL;
const TMP_DB = "/tmp/voc.db";
const TMP_MARKER = "/tmp/voc.seeded";

function resolveConnectionString(): string {
  if (IS_VERCEL) {
    // コールドスタート時のみビルド済みDBをコピーする
    if (!fs.existsSync(TMP_MARKER)) {
      const builtDb = path.join(process.cwd(), "prisma/dev.db");
      if (fs.existsSync(builtDb)) {
        fs.copyFileSync(builtDb, TMP_DB);
      }
      fs.writeFileSync(TMP_MARKER, "1");
    }
    return `file:${TMP_DB}`;
  }

  const rawUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  // "file:./..." の相対パスを絶対パスへ変換
  return rawUrl.startsWith("file:./")
    ? `file:${path.join(process.cwd(), rawUrl.slice(7))}`
    : rawUrl;
}

const connectionString = resolveConnectionString();

const globalForPrisma = globalThis as unknown as {
  vocPrisma?: PrismaClient;
};

function createClient() {
  const adapter = new PrismaBetterSqlite3({ url: connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.vocPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.vocPrisma = prisma;
}
