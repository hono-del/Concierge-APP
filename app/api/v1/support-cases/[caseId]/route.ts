import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-response";
import { getCaseDetailForAgent } from "@/repositories/fixture/support-case-repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const detail = getCaseDetailForAgent(caseId);
    return NextResponse.json(detail, { status: 200 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
