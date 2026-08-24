import { NextResponse } from "next/server";
import type { ApiErrorBody } from "@/types";
import {
  CaseAlreadyFinalizedError,
  CaseNotFoundError,
  InvalidQuestionError,
  ScenarioNotFoundError,
} from "@/repositories/fixture/support-case-repository";

/**
 * Route Handler共通のエラーハンドリング。
 * 出典: docs/design/api-specification.md 2. 共通仕様（エラーレスポンス形式）
 */
export function toErrorResponse(error: unknown): NextResponse<ApiErrorBody> {
  const requestId = `req_${globalThis.crypto.randomUUID().slice(0, 12)}`;

  if (error instanceof ScenarioNotFoundError) {
    return NextResponse.json(
      { error: { code: "SCENARIO_NOT_FOUND", message: error.message, requestId } },
      { status: 404 }
    );
  }
  if (error instanceof CaseNotFoundError) {
    return NextResponse.json(
      { error: { code: "CASE_NOT_FOUND", message: error.message, requestId } },
      { status: 404 }
    );
  }
  if (error instanceof InvalidQuestionError) {
    return NextResponse.json(
      { error: { code: "INVALID_QUESTION", message: error.message, requestId } },
      { status: 400 }
    );
  }
  if (error instanceof CaseAlreadyFinalizedError) {
    return NextResponse.json(
      { error: { code: "CASE_ALREADY_FINALIZED", message: error.message, requestId } },
      { status: 409 }
    );
  }

  console.error("Unexpected API error", error);
  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "サーバー内部で問題が発生しました。",
        requestId,
      },
    },
    { status: 500 }
  );
}
