import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-response";
import { answerQuestion } from "@/repositories/fixture/support-case-repository";
import type { AnswerQuestionRequest } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const body = (await request.json()) as Partial<AnswerQuestionRequest>;

    if (!body.questionCode || (!body.optionCode && !body.answerText)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "questionCodeと回答内容（optionCodeまたはanswerText）は必須です。",
            requestId: `req_${globalThis.crypto.randomUUID().slice(0, 12)}`,
          },
        },
        { status: 400 }
      );
    }

    const result = answerQuestion(caseId, {
      questionCode: body.questionCode,
      optionCode: body.optionCode,
      answerText: body.answerText,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
