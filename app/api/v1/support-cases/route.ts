import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-response";
import {
  createSupportCase,
} from "@/repositories/fixture/support-case-repository";
import { clearAllCases, listCases } from "@/repositories/fixture/case-store";
import type { CreateSupportCaseRequest } from "@/types";

/**
 * Agent Dashboard（A01）向けの一覧取得。
 * docs/design/api-specification.md には明記のない拡張エンドポイントだが、
 * 同一の設計原則（RESTful, /api/v1配下）に従う。
 */
export async function GET() {
  try {
    const cases = listCases();
    return NextResponse.json({ cases }, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateSupportCaseRequest>;

    if (!body.userId || !body.vehicleId || !body.issueText) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "userId, vehicleId, issueText は必須です。",
            requestId: `req_${globalThis.crypto.randomUUID().slice(0, 12)}`,
          },
        },
        { status: 400 }
      );
    }

    const result = createSupportCase({
      userId: body.userId,
      vehicleId: body.vehicleId,
      issueText: body.issueText,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * デモ運営機能（FR-12）：全ケースを初期化する。
 */
export async function DELETE() {
  clearAllCases();
  return NextResponse.json({ cleared: true }, { status: 200 });
}
