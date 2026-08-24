/**
 * コンシェルジュAPP（デジOM）共通型定義
 * 出典: docs/design/database-design.md, docs/design/api-specification.md
 */

export type ExperienceLevel = "new" | "experienced";

export type VehicleStatus = "normal" | "attention" | "warning";

export interface User {
  id: string;
  displayName: string;
  experienceLevel: ExperienceLevel;
  previousVehicle?: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  model: string;
  modelYear: number;
  region?: string;
  status: VehicleStatus;
  enabledFeatures: string[];
  availableUpgrades: string[];
  imageEmoji: string;
  imageUrl?: string;
  ownershipMonths?: number;
  nextMaintenanceDate?: string;
}

export type FeatureSettingState =
  | "configured"
  | "not_configured"
  | "partial"
  | "learning";

export type FeatureUsageState =
  | "unused"
  | "in_use"
  | "partial_use"
  | "mastered";

export type FeaturePriority = "S" | "A" | "B";

export interface VehicleFeature {
  id: string;
  name: string;
  category: string;
  icon: string;
  priority: FeaturePriority;
  tagline: string;
  description: string;
  differenceNote?: string;
  settingStatus?: {
    state: FeatureSettingState;
    label: string;
  };
  usageStatus?: {
    state: FeatureUsageState;
    label: string;
  };
  steps?: Array<{ label: string; detail: string }>;
  ctaLabel?: string;
}

export type RecommendationType = "onboarding" | "feature" | "ota" | "upgrade";

export interface Recommendation {
  id: string;
  vehicleId: string;
  type: RecommendationType;
  title: string;
  reason: string;
  priority: number;
  href: string;
  imageUrl?: string;
  detailedDescription?: string;
  reasons?: string[];
  benefits?: string[];
}

export interface OtaChangeItem {
  id: string;
  title: string;
  description: string;
  presentation: "short" | "image" | "steps" | "video";
}

export interface OtaUpdate {
  id: string;
  vehicleId: string;
  version: string;
  summary: string;
  appliedAt: string;
  changes: OtaChangeItem[];
}

export type KnowledgeSourceType =
  | "owners_manual"
  | "faq"
  | "support_case"
  | "product_info"
  | "community_tip"
  | "video";

export interface KnowledgeSource {
  id: string;
  type: KnowledgeSourceType;
  title: string;
  version?: string;
  url?: string;
  durationSeconds?: number;
  publisher?: string;
}

export interface QuestionOption {
  code: string;
  label: string;
}

export interface Question {
  code: string;
  prompt: string;
  sequence: number;
  options: QuestionOption[];
}

export interface GuidanceStep {
  id: string;
  title: string;
  body: string;
  icon: string;
  warning?: string;
  /** 操作手順を示す補助イラスト・写真（任意） */
  imageUrl?: string;
}

export type ApprovalStatus = "draft" | "reviewed" | "approved";

/** official = 公式情報（マニュアル・FAQ）ベース、community = オーナー体験談・動画等の実践情報ベース */
export type GuidanceTrack = "official" | "community";

export interface Guidance {
  code: string;
  title: string;
  estimatedSeconds: number;
  steps: GuidanceStep[];
  approvalStatus: ApprovalStatus;
  sourceIds: string[];
  track: GuidanceTrack;
  /** community trackで表示する「参考情報である」旨の注意書き */
  disclaimer?: string;
}

export type ConfidenceLabel = "high" | "medium" | "low";

/** Web上の口コミ・SNS投稿を模したデモ用のダミーコメント（実在の投稿ではない） */
export interface SimilarCaseComment {
  author: string;
  source: string;
  text: string;
}

export interface CauseCandidate {
  code: string;
  label: string;
  priority: number;
  confidenceLabel: ConfidenceLabel;
  evidenceIds: string[];
  /** 「同じ症状の事例が◯件あります」という文脈で表示する、デモ用の類似事例件数 */
  similarCaseCount?: number;
  /** 診断結果画面に表示する、Webから拾ったような体験談コメント（デモ用ダミー） */
  similarComments?: SimilarCaseComment[];
}

export interface TroubleshootingScenario {
  code: string;
  title: string;
  version: number;
  status: ApprovalStatus | "approved" | "retired";
  matchKeywords: string[];
  questions: Question[];
  evaluateCauses: (answers: Record<string, string>) => CauseCandidate[];
  guidances: Record<string, Guidance>;
  fallbackSampleIssues: string[];
  /**
   * false の場合、安全に関わる事象としてcommunity trackの案内を出さない（公式情報のみ提示）。
   * 未指定時はtrue（community trackを許可）として扱う。
   */
  communityTrackAllowed?: boolean;
}

export type CaseStatus =
  | "in_progress"
  | "solved"
  | "not_solved"
  | "escalated";

export interface CaseAnswerRecord {
  questionCode: string;
  optionCode?: string;
  answerText?: string;
  label: string;
}

export type ResolutionOutcome = "solved" | "not_solved" | "need_info";

export type ResolutionChannel = "owner" | "call_center" | "dealer";

export type AgentResolutionOutcome =
  | "solved"
  | "not_solved"
  | "dealer"
  | "technical_support";

export interface ResolutionEvent {
  id: string;
  outcome: ResolutionOutcome | AgentResolutionOutcome;
  channel: ResolutionChannel;
  guidanceCode?: string;
  occurredAt: string;
}

export interface DiagnosisResult {
  causes: CauseCandidate[];
  guidanceOfficial: Pick<Guidance, "code" | "title">;
  guidanceCommunity: Pick<Guidance, "code" | "title"> | null;
}

export interface SupportCase {
  id: string;
  userId: string;
  vehicleId: string;
  issueCode: string;
  issueText: string;
  status: CaseStatus;
  currentQuestionCode: string | null;
  answers: CaseAnswerRecord[];
  diagnosis: DiagnosisResult | null;
  resolutionEvents: ResolutionEvent[];
  createdAt: string;
  updatedAt: string;
}

/** POST /api/v1/support-cases のリクエスト */
export interface CreateSupportCaseRequest {
  userId: string;
  vehicleId: string;
  issueText: string;
}

/** POST /api/v1/support-cases のレスポンス */
export interface CreateSupportCaseResponse {
  id: string;
  issueCode: string;
  status: CaseStatus;
  nextQuestion: Question | null;
}

/** POST /api/v1/support-cases/{caseId}/answers のリクエスト */
export interface AnswerQuestionRequest {
  questionCode: string;
  optionCode?: string;
  answerText?: string;
}

/** POST /api/v1/support-cases/{caseId}/answers のレスポンス */
export interface AnswerQuestionResponse {
  caseId: string;
  nextQuestion: Question | null;
  diagnosis: DiagnosisResult | null;
}

/**
 * POST /api/v1/support-cases/{caseId}/answers/batch のリクエスト。
 * 複数の質問への回答を1回でまとめて送信する（状況確認フローの往復削減用）。
 * finalize: true の場合、未回答の質問があっても残りをスキップし、その時点の回答内容で診断を確定する。
 */
export interface AnswerQuestionsBatchRequest {
  answers: AnswerQuestionRequest[];
  finalize?: boolean;
}

/** POST /api/v1/support-cases/{caseId}/resolution のリクエスト */
export interface RegisterResolutionRequest {
  outcome: ResolutionOutcome | AgentResolutionOutcome;
  channel: ResolutionChannel;
  guidanceCode?: string;
}

/** POST /api/v1/support-cases/{caseId}/resolution のレスポンス */
export interface RegisterResolutionResponse {
  caseId: string;
  status: CaseStatus;
  handoverAvailable: boolean;
}

/** GET /api/v1/support-cases/{caseId}/handover のレスポンス */
export interface HandoverSummaryResponse {
  caseId: string;
  vehicle: { model: string; modelYear: number };
  issue: string;
  conditions: string[];
  checkedItems: string[];
  guidance: string | null;
  result: string;
}

/** GET /api/v1/support-cases/{caseId} のレスポンス（Agent向け） */
export interface SupportCaseDetailResponse {
  case: SupportCase;
  user: User;
  vehicle: Vehicle;
  nextQuestion: Question | null;
  nextQuestionReason: string | null;
  causes: CauseCandidate[];
  recommendedGuidanceOfficial: Guidance | null;
  recommendedGuidanceCommunity: Guidance | null;
  evidence: KnowledgeSource[];
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
}

export interface CxIssueSummary {
  issueCode: string;
  issueTitle: string;
  totalCases: number;
  selfResolvedRate: number;
  callCenterRate: number;
  dealerRate: number;
}

export interface CxInsight {
  id: string;
  title: string;
  description: string;
}

export interface CxImprovementAction {
  id: string;
  title: string;
  description: string;
}
