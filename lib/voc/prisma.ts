import "dotenv/config";
import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

/**
 * VoCベースナレッジ構築モック用のPrismaクライアント（SQLite）。
 * Next.jsの開発時ホットリロードでクライアントが多重生成されないようglobalに保持する。
 * Vercelでは process.cwd() が /var/task になるため、絶対パスに変換する。
 */

const rawUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
// "file:./..." の相対パスを絶対パスへ変換
const connectionString = rawUrl.startsWith("file:./")
  ? `file:${path.join(process.cwd(), rawUrl.slice(7))}`
  : rawUrl;

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
