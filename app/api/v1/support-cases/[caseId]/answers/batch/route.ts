import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-response";
import { answerQuestionsBatch } from "@/repositories/fixture/support-case-repository";
import type { AnswerQuestionsBatchRequest } from "@/types";

/**
 * 状況確認フローの往復削減用エンドポイント。
 * 複数の質問への回答を1回でまとめて送信できる。
 * finalize: true の場合、未回答の質問があってもその時点の回答内容で診断を確定する。
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const body = (await request.json()) as Partial<AnswerQuestionsBatchRequest>;

    if (!Array.isArray(body.answers)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "answersは配列で指定してください。",
            requestId: `req_${globalThis.crypto.randomUUID().slice(0, 12)}`,
          },
        },
        { status: 400 }
      );
    }

    const result = answerQuestionsBatch(caseId, {
      answers: body.answers,
      finalize: body.finalize,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
