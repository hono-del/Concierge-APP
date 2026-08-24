import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-response";
import { registerResolution } from "@/repositories/fixture/support-case-repository";
import type { RegisterResolutionRequest } from "@/types";

const VALID_OUTCOMES = [
  "solved",
  "not_solved",
  "need_info",
  "dealer",
  "technical_support",
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const body = (await request.json()) as Partial<RegisterResolutionRequest>;

    if (!body.outcome || !VALID_OUTCOMES.includes(body.outcome)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "outcomeの値が不正です。",
            requestId: `req_${globalThis.crypto.randomUUID().slice(0, 12)}`,
          },
        },
        { status: 400 }
      );
    }

    const result = registerResolution(caseId, {
      outcome: body.outcome,
      channel: body.channel ?? "owner",
      guidanceCode: body.guidanceCode,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
