import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-response";
import {
  escalateCase,
  getHandoverSummary,
} from "@/repositories/fixture/support-case-repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const summary = getHandoverSummary(caseId);
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const updated = escalateCase(caseId);
    return NextResponse.json({ caseId: updated.id, status: updated.status }, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
