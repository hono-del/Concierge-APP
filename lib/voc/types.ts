/**
 * VoCベースナレッジ構築モック 共通型定義
 * 出典: docs/input/voc_knowledge_system_overview_requirements.md
 */

export type SourceType =
  | "qa"
  | "blog"
  | "video"
  | "community"
  | "dealer"
  | "expert"
  | "official";

export type SourceStatus = "active" | "disabled" | "error";

export interface VocSource {
  id: string;
  name: string;
  url: string;
  sourceType: SourceType;
  vehicleModel: string;
  status: SourceStatus;
  lastCollectedAt: string | null;
  collectedItems: number;
  createdAt: string;
}

export type RawVocStatus =
  | "new"
  | "processing"
  | "structured"
  | "duplicate"
  | "rejected";

export interface RawVocItem {
  id: string;
  sourceId: string;
  rawTitle: string;
  rawText: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string | null;
  status: RawVocStatus;
  collectedAt: string;
  hasKnowledge: boolean;
}

/** SourceAdapterが収集する最小単位の生データ */
export interface RawSourceItem {
  rawTitle: string;
  rawText: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt?: string;
}

export type KnowledgeCategory =
  | "door"
  | "battery"
  | "infotainment"
  | "warning"
  | "noise"
  | "charging"
  | "adas"
  | "other";

export type KnowledgeStatus = "draft" | "review" | "approved" | "rejected";

export type SafetyLevel = "low" | "medium" | "high";

export interface KnowledgeVehicle {
  maker: string;
  model: string;
  modelYear?: string;
  grade?: string;
  powertrain?: string;
}

export interface KnowledgeConditions {
  weather?: string[];
  temperature?: string;
  vehicleState?: string[];
  frequency?: string;
  timing?: string;
}

export interface KnowledgeCause {
  label: string;
  confidence: number;
}

export interface KnowledgeCheck {
  order: number;
  action: string;
  reason?: string;
}

export interface KnowledgeResolution {
  action: string;
  outcome?: string;
  evidenceCount?: number;
}

export interface KnowledgeSourceRef {
  type: SourceType;
  title: string;
  url?: string;
  author?: string;
  publishedAt?: string;
}

export interface KnowledgeTrust {
  score: number;
  reason: string[];
  officialCorroboration: boolean;
  multipleSourceSupport: boolean;
}

export interface KnowledgeSafety {
  level: SafetyLevel;
  requiresOfficialConfirmation: boolean;
  notes?: string[];
}

export interface KnowledgeItem {
  id: string;
  vehicle: KnowledgeVehicle;
  category: KnowledgeCategory;
  issueTitle: string;
  symptom: string[];
  conditions: KnowledgeConditions;
  possibleCauses: KnowledgeCause[];
  checks: KnowledgeCheck[];
  resolutions: KnowledgeResolution[];
  tips: string[];
  source: KnowledgeSourceRef;
  trust: KnowledgeTrust;
  safety: KnowledgeSafety;
  status: KnowledgeStatus;
  rawVocId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 安全上、Experience Knowledgeのみでは案内できない領域 */
export const SAFETY_CRITICAL_KEYWORDS = [
  "ブレーキ",
  "ステアリング",
  "高電圧",
  "エアバッグ",
  "燃料",
  "火災",
  "発火",
  "車両下",
  "分解整備",
  "分解",
  "リフト",
  "ジャッキ",
  "安全装置",
] as const;

export type ContributorBadge =
  | "NX Owner"
  | "Dealer Staff"
  | "Mechanic"
  | "EV Expert"
  | "Top Contributor";

export interface Contributor {
  id: string;
  name: string;
  badge: ContributorBadge;
  vehicleModel?: string | null;
  knowledgeLevel: number;
  points: number;
  acceptedAnswers: number;
  helpfulRate: number;
  createdAt: string;
}

export type ExpertQuestionStatus = "open" | "answered" | "resolved";

export interface ExpertQuestion {
  id: string;
  title: string;
  vehicleModel: string;
  symptoms: string[];
  conditions: string[];
  alreadyChecked: string[];
  questionText: string;
  tags: string[];
  rewardPoints: number;
  authorId?: string | null;
  status: ExpertQuestionStatus;
  createdAt: string;
  answerCount: number;
}

export type ExpertAnswerStatus =
  | "pending"
  | "accepted"
  | "edited_accepted"
  | "rejected";

export interface ExpertAnswer {
  id: string;
  questionId: string;
  contributorId: string;
  contributor: Contributor;
  answerText: string;
  status: ExpertAnswerStatus;
  createdAt: string;
  knowledgeItemId?: string | null;
}

export interface ExpertQuestionDetail extends ExpertQuestion {
  answers: ExpertAnswer[];
}

/** Knowledge Mode（デモ用トグル） */
export type KnowledgeMode = "official_only" | "official_voc";

export interface ChatSourceBadge {
  label: string;
  sourceType: SourceType;
}

export interface ChatSimilarExperience {
  knowledgeId: string;
  title: string;
  summary: string;
  sourceType: SourceType;
  sourceTitle: string;
  sourceUrl?: string;
  matchScore: number;
}

export interface ChatAnswer {
  kind: "answer";
  mode: KnowledgeMode;
  firstAction: {
    title: string;
    body: string;
  };
  why: string[];
  similarExperiences: ChatSimilarExperience[];
  official: {
    title: string;
    body: string;
    sourceTitle: string;
  } | null;
  tips: string[];
  trust: KnowledgeTrust & { safetyLevel: SafetyLevel };
  matchedKnowledgeId: string | null;
  primarySourceType: SourceType;
  safetyBlocked: boolean;
}

export interface ChatUnknown {
  kind: "unknown";
  reason: string;
}

export type ChatScenario = "hero_door" | null;

export interface ChatContext {
  knowledgeMode: KnowledgeMode;
  scenario: ChatScenario;
  doorOtherOpen?: "open" | "all_closed";
  doorSide?: "left" | "right" | "both";
  noiseIsBrake?: "yes" | "no";
  pendingCategory?: KnowledgeCategory;
  lastUserText?: string;
}

export const DEFAULT_CHAT_CONTEXT: ChatContext = {
  knowledgeMode: "official_voc",
  scenario: null,
};

export interface ChatQuickReplyOption {
  label: string;
  value: string;
}

export type ChatTurnResult =
  | { kind: "intro"; lines: string[]; context: ChatContext }
  | {
      kind: "question";
      text: string;
      options: ChatQuickReplyOption[];
      context: ChatContext;
    }
  | { kind: "answer"; answer: ChatAnswer; context: ChatContext }
  | { kind: "unknown"; reason: string; context: ChatContext };
