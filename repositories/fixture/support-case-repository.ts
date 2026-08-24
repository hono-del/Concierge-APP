import {
  evaluateDiagnosis,
  findScenarioByCode,
  findScenarioByIssueText,
  getFirstQuestion,
  getNextQuestion,
} from "@/domain/troubleshooting/engine";
import { demoUser, demoVehicle, getKnowledgeSourcesByIds } from "@/lib/mock-data";
import type {
  AnswerQuestionRequest,
  AnswerQuestionResponse,
  AnswerQuestionsBatchRequest,
  CaseAnswerRecord,
  CreateSupportCaseRequest,
  CreateSupportCaseResponse,
  Guidance,
  HandoverSummaryResponse,
  KnowledgeSource,
  Question,
  RegisterResolutionRequest,
  RegisterResolutionResponse,
  SupportCase,
  SupportCaseDetailResponse,
} from "@/types";
import { getCaseById, saveCase } from "./case-store";

export class ScenarioNotFoundError extends Error {
  constructor() {
    super("対象シナリオが見つかりません。");
    this.name = "ScenarioNotFoundError";
  }
}

export class CaseNotFoundError extends Error {
  constructor() {
    super("指定されたケースが見つかりません。");
    this.name = "CaseNotFoundError";
  }
}

export class CaseAlreadyFinalizedError extends Error {
  constructor() {
    super("このケースは既に確定済みです。");
    this.name = "CaseAlreadyFinalizedError";
  }
}

export class InvalidQuestionError extends Error {
  constructor() {
    super("想定されている質問と一致しません。");
    this.name = "InvalidQuestionError";
  }
}

function createId(): string {
  return globalThis.crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

export function createSupportCase(
  input: CreateSupportCaseRequest
): CreateSupportCaseResponse {
  const scenario = findScenarioByIssueText(input.issueText);
  if (!scenario) {
    throw new ScenarioNotFoundError();
  }

  const firstQuestion = getFirstQuestion(scenario);
  const now = nowIso();

  const supportCase: SupportCase = {
    id: createId(),
    userId: input.userId,
    vehicleId: input.vehicleId,
    issueCode: scenario.code,
    issueText: input.issueText,
    status: "in_progress",
    currentQuestionCode: firstQuestion?.code ?? null,
    answers: [],
    diagnosis: null,
    resolutionEvents: [],
    createdAt: now,
    updatedAt: now,
  };

  saveCase(supportCase);

  return {
    id: supportCase.id,
    issueCode: supportCase.issueCode,
    status: supportCase.status,
    nextQuestion: firstQuestion,
  };
}

export function answerQuestion(
  caseId: string,
  input: AnswerQuestionRequest
): AnswerQuestionResponse {
  const supportCase = getCaseById(caseId);
  if (!supportCase) {
    throw new CaseNotFoundError();
  }
  if (supportCase.status !== "in_progress") {
    throw new CaseAlreadyFinalizedError();
  }

  const scenario = findScenarioByCode(supportCase.issueCode);
  if (!scenario) {
    throw new ScenarioNotFoundError();
  }

  const question = scenario.questions.find(
    (candidate) => candidate.code === input.questionCode
  );
  if (!question) {
    throw new InvalidQuestionError();
  }

  const selectedOption = question.options.find(
    (option) => option.code === input.optionCode
  );

  const answerRecord: CaseAnswerRecord = {
    questionCode: input.questionCode,
    optionCode: input.optionCode,
    answerText: input.answerText,
    label: selectedOption?.label ?? input.answerText ?? "",
  };

  const existingIndex = supportCase.answers.findIndex(
    (answer) => answer.questionCode === input.questionCode
  );
  const nextAnswers = [...supportCase.answers];
  if (existingIndex >= 0) {
    nextAnswers[existingIndex] = answerRecord;
  } else {
    nextAnswers.push(answerRecord);
  }

  const answersMap = Object.fromEntries(
    nextAnswers.map((answer) => [answer.questionCode, answer.optionCode ?? answer.answerText ?? ""])
  );

  const nextQuestion: Question | null = getNextQuestion(
    scenario,
    nextAnswers.map((answer) => answer.questionCode)
  );

  const diagnosis = nextQuestion ? null : evaluateDiagnosis(scenario, answersMap);

  const updatedCase: SupportCase = {
    ...supportCase,
    answers: nextAnswers,
    currentQuestionCode: nextQuestion?.code ?? null,
    diagnosis,
    updatedAt: nowIso(),
  };

  saveCase(updatedCase);

  return {
    caseId: updatedCase.id,
    nextQuestion,
    diagnosis,
  };
}

/**
 * 複数の質問への回答を1回でまとめて処理する（状況確認フローの往復削減用）。
 * finalize: true の場合、未回答の質問が残っていても診断を確定する（「一般的な確認手順を見る」用）。
 */
export function answerQuestionsBatch(
  caseId: string,
  input: AnswerQuestionsBatchRequest
): AnswerQuestionResponse {
  const supportCase = getCaseById(caseId);
  if (!supportCase) {
    throw new CaseNotFoundError();
  }
  if (supportCase.status !== "in_progress") {
    throw new CaseAlreadyFinalizedError();
  }

  const scenario = findScenarioByCode(supportCase.issueCode);
  if (!scenario) {
    throw new ScenarioNotFoundError();
  }

  let nextAnswers = [...supportCase.answers];

  for (const item of input.answers) {
    const question = scenario.questions.find(
      (candidate) => candidate.code === item.questionCode
    );
    if (!question) {
      throw new InvalidQuestionError();
    }

    const selectedOption = question.options.find(
      (option) => option.code === item.optionCode
    );

    const answerRecord: CaseAnswerRecord = {
      questionCode: item.questionCode,
      optionCode: item.optionCode,
      answerText: item.answerText,
      label: selectedOption?.label ?? item.answerText ?? "",
    };

    const existingIndex = nextAnswers.findIndex(
      (answer) => answer.questionCode === item.questionCode
    );
    if (existingIndex >= 0) {
      nextAnswers[existingIndex] = answerRecord;
    } else {
      nextAnswers = [...nextAnswers, answerRecord];
    }
  }

  const answersMap = Object.fromEntries(
    nextAnswers.map((answer) => [answer.questionCode, answer.optionCode ?? answer.answerText ?? ""])
  );

  const nextQuestion: Question | null = input.finalize
    ? null
    : getNextQuestion(scenario, nextAnswers.map((answer) => answer.questionCode));

  const diagnosis = nextQuestion ? null : evaluateDiagnosis(scenario, answersMap);

  const updatedCase: SupportCase = {
    ...supportCase,
    answers: nextAnswers,
    currentQuestionCode: nextQuestion?.code ?? null,
    diagnosis,
    updatedAt: nowIso(),
  };

  saveCase(updatedCase);

  return {
    caseId: updatedCase.id,
    nextQuestion,
    diagnosis,
  };
}

export function registerResolution(
  caseId: string,
  input: RegisterResolutionRequest
): RegisterResolutionResponse {
  const supportCase = getCaseById(caseId);
  if (!supportCase) {
    throw new CaseNotFoundError();
  }
  if (supportCase.status === "solved" || supportCase.status === "escalated") {
    throw new CaseAlreadyFinalizedError();
  }

  const status = input.outcome === "solved" ? "solved" : "not_solved";

  const updatedCase: SupportCase = {
    ...supportCase,
    status,
    resolutionEvents: [
      ...supportCase.resolutionEvents,
      {
        id: createId(),
        outcome: input.outcome,
        channel: input.channel,
        guidanceCode: input.guidanceCode,
        occurredAt: nowIso(),
      },
    ],
    updatedAt: nowIso(),
  };

  saveCase(updatedCase);

  return {
    caseId: updatedCase.id,
    status: updatedCase.status,
    handoverAvailable: status === "not_solved",
  };
}

export function escalateCase(caseId: string): SupportCase {
  const supportCase = getCaseById(caseId);
  if (!supportCase) {
    throw new CaseNotFoundError();
  }

  const updatedCase: SupportCase = {
    ...supportCase,
    status: "escalated",
    updatedAt: nowIso(),
  };
  saveCase(updatedCase);
  return updatedCase;
}

export function getHandoverSummary(caseId: string): HandoverSummaryResponse {
  const supportCase = getCaseById(caseId);
  if (!supportCase) {
    throw new CaseNotFoundError();
  }

  const scenario = findScenarioByCode(supportCase.issueCode);
  const guidanceTitle = supportCase.diagnosis
    ? scenario?.guidances[supportCase.diagnosis.guidanceOfficial.code]?.title ?? null
    : null;

  const latestResolution =
    supportCase.resolutionEvents[supportCase.resolutionEvents.length - 1];

  return {
    caseId: supportCase.id,
    vehicle: { model: demoVehicle.model, modelYear: demoVehicle.modelYear },
    issue: supportCase.issueText,
    conditions: supportCase.answers.map((answer) => answer.label),
    checkedItems: supportCase.diagnosis?.causes.map((cause) => cause.label) ?? [],
    guidance: guidanceTitle,
    result: latestResolution?.outcome === "solved" ? "解決" : "未解決",
  };
}

const NEXT_QUESTION_REASONS: Record<string, string> = {
  opening_from: "原因候補を大きく切り分けるため",
  door_position: "対象箇所を特定し、案内する手順を絞り込むため",
};

export function getCaseDetailForAgent(
  caseId: string
): SupportCaseDetailResponse {
  const supportCase = getCaseById(caseId);
  if (!supportCase) {
    throw new CaseNotFoundError();
  }

  const scenario = findScenarioByCode(supportCase.issueCode);
  const nextQuestion = scenario
    ? getNextQuestion(
        scenario,
        supportCase.answers.map((answer) => answer.questionCode)
      )
    : null;

  const recommendedGuidanceOfficial: Guidance | null =
    scenario && supportCase.diagnosis
      ? scenario.guidances[supportCase.diagnosis.guidanceOfficial.code] ?? null
      : null;

  const recommendedGuidanceCommunity: Guidance | null =
    scenario && supportCase.diagnosis?.guidanceCommunity
      ? scenario.guidances[supportCase.diagnosis.guidanceCommunity.code] ?? null
      : null;

  const evidence = getEvidenceForCase(caseId);

  return {
    case: supportCase,
    user: demoUser,
    vehicle: demoVehicle,
    nextQuestion,
    nextQuestionReason: nextQuestion
      ? NEXT_QUESTION_REASONS[nextQuestion.code] ?? "状況を切り分けるため"
      : null,
    causes: supportCase.diagnosis?.causes ?? [],
    recommendedGuidanceOfficial,
    recommendedGuidanceCommunity,
    evidence,
  };
}

export function getEvidenceForCase(caseId: string): KnowledgeSource[] {
  const supportCase = getCaseById(caseId);
  if (!supportCase || !supportCase.diagnosis) {
    return [];
  }
  const ids = supportCase.diagnosis.causes.flatMap((cause) => cause.evidenceIds);
  return getKnowledgeSourcesByIds(Array.from(new Set(ids)));
}
