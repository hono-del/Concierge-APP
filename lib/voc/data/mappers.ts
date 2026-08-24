import type {
  ContributorModel as PrismaContributor,
  ExpertAnswerModel as PrismaExpertAnswer,
  ExpertQuestionModel as PrismaExpertQuestion,
  KnowledgeItemModel as PrismaKnowledgeItem,
  RawVocModel as PrismaRawVoc,
  SourceModel as PrismaSource,
} from "../../../generated/prisma/models";
import type {
  Contributor,
  ExpertAnswer,
  ExpertQuestion,
  KnowledgeCategory,
  KnowledgeItem,
  KnowledgeStatus,
  RawVocItem,
  RawVocStatus,
  SafetyLevel,
  SourceStatus,
  SourceType,
  VocSource,
} from "../types";

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function mapSource(row: PrismaSource): VocSource {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    sourceType: row.sourceType as SourceType,
    vehicleModel: row.vehicleModel,
    status: row.status as SourceStatus,
    lastCollectedAt: row.lastCollectedAt ? row.lastCollectedAt.toISOString() : null,
    collectedItems: row.collectedItems,
    createdAt: row.createdAt.toISOString(),
  };
}

export function mapRawVoc(
  row: PrismaRawVoc & { knowledge?: { id: string } | null }
): RawVocItem {
  return {
    id: row.id,
    sourceId: row.sourceId,
    rawTitle: row.rawTitle,
    rawText: row.rawText,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    status: row.status as RawVocStatus,
    collectedAt: row.collectedAt.toISOString(),
    hasKnowledge: Boolean(row.knowledge),
  };
}

export function mapKnowledgeItem(row: PrismaKnowledgeItem): KnowledgeItem {
  return {
    id: row.id,
    vehicle: {
      maker: row.vehicleMaker,
      model: row.vehicleModel,
      modelYear: row.vehicleModelYear ?? undefined,
      grade: row.vehicleGrade ?? undefined,
      powertrain: row.vehiclePowertrain ?? undefined,
    },
    category: row.category as KnowledgeCategory,
    issueTitle: row.issueTitle,
    symptom: parseJson(row.symptomsJson, []),
    conditions: parseJson(row.conditionsJson, {}),
    possibleCauses: parseJson(row.causesJson, []),
    checks: parseJson(row.checksJson, []),
    resolutions: parseJson(row.resolutionsJson, []),
    tips: parseJson(row.tipsJson, []),
    source: {
      type: row.sourceType as SourceType,
      title: row.sourceTitle,
      url: row.sourceUrl ?? undefined,
      author: row.sourceAuthor ?? undefined,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : undefined,
    },
    trust: {
      score: row.trustScore,
      reason: parseJson(row.trustReasonJson, []),
      officialCorroboration: row.officialCorroboration,
      multipleSourceSupport: row.multipleSourceSupport,
    },
    safety: {
      level: row.safetyLevel as SafetyLevel,
      requiresOfficialConfirmation: row.requiresOfficialConfirmation,
      notes: row.safetyNotesJson ? parseJson(row.safetyNotesJson, []) : undefined,
    },
    status: row.status as KnowledgeStatus,
    rawVocId: row.rawVocId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapContributor(row: PrismaContributor): Contributor {
  return {
    id: row.id,
    name: row.name,
    badge: row.badge as Contributor["badge"],
    vehicleModel: row.vehicleModel,
    knowledgeLevel: row.knowledgeLevel,
    points: row.points,
    acceptedAnswers: row.acceptedAnswers,
    helpfulRate: row.helpfulRate,
    createdAt: row.createdAt.toISOString(),
  };
}

export function mapExpertAnswer(
  row: PrismaExpertAnswer & { contributor: PrismaContributor }
): ExpertAnswer {
  return {
    id: row.id,
    questionId: row.questionId,
    contributorId: row.contributorId,
    contributor: mapContributor(row.contributor),
    answerText: row.answerText,
    status: row.status as ExpertAnswer["status"],
    createdAt: row.createdAt.toISOString(),
  };
}

/** AI構造化結果（KnowledgeItemのid/createdAt/updatedAt/statusを除いた形）をPrisma create用データへ変換する */
export function toKnowledgeCreateData(
  base: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt" | "status">,
  status: KnowledgeStatus
) {
  return {
    rawVocId: base.rawVocId ?? undefined,
    vehicleMaker: base.vehicle.maker,
    vehicleModel: base.vehicle.model,
    vehicleModelYear: base.vehicle.modelYear,
    vehicleGrade: base.vehicle.grade,
    vehiclePowertrain: base.vehicle.powertrain,
    category: base.category,
    issueTitle: base.issueTitle,
    symptomsJson: JSON.stringify(base.symptom),
    conditionsJson: JSON.stringify(base.conditions),
    causesJson: JSON.stringify(base.possibleCauses),
    checksJson: JSON.stringify(base.checks),
    resolutionsJson: JSON.stringify(base.resolutions),
    tipsJson: JSON.stringify(base.tips),
    sourceType: base.source.type,
    sourceTitle: base.source.title,
    sourceUrl: base.source.url,
    sourceAuthor: base.source.author,
    trustScore: base.trust.score,
    trustReasonJson: JSON.stringify(base.trust.reason),
    officialCorroboration: base.trust.officialCorroboration,
    multipleSourceSupport: base.trust.multipleSourceSupport,
    safetyLevel: base.safety.level,
    requiresOfficialConfirmation: base.safety.requiresOfficialConfirmation,
    safetyNotesJson: base.safety.notes ? JSON.stringify(base.safety.notes) : null,
    status,
  };
}

export function mapExpertQuestion(
  row: PrismaExpertQuestion & { answers?: unknown[] }
): ExpertQuestion {
  return {
    id: row.id,
    title: row.title,
    vehicleModel: row.vehicleModel,
    symptoms: parseJson(row.symptomsJson, []),
    conditions: parseJson(row.conditionsJson, []),
    alreadyChecked: parseJson(row.alreadyCheckedJson, []),
    questionText: row.questionText,
    tags: parseJson(row.tagsJson, []),
    rewardPoints: row.rewardPoints,
    authorId: row.authorId,
    status: row.status as ExpertQuestion["status"],
    createdAt: row.createdAt.toISOString(),
    answerCount: row.answers?.length ?? 0,
  };
}
