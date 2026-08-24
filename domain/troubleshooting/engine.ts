import type {
  DiagnosisResult,
  Question,
  TroubleshootingScenario,
} from "@/types";
import { troubleshootingScenarios } from "./scenarios";

/**
 * Troubleshooting Engine
 * Owner UIとAgent UIで共用する決定論的な診断ロジック。
 * 出典: docs/design/system-architecture.md, docs/output/detailed_requirements_specification.md 4.2
 */

interface GuidancePair {
  official: string;
  community: string;
}

const CAUSE_TO_GUIDANCE: Record<string, GuidancePair> = {
  elatch_switch_left: {
    official: "check_door_switch_and_lock_official",
    community: "check_manual_release_community",
  },
  elatch_switch_right: {
    official: "check_door_switch_and_lock_official",
    community: "check_manual_release_community",
  },
  elatch_switch_both: {
    official: "check_door_switch_and_lock_official",
    community: "check_manual_release_community",
  },
  battery_voltage_low: {
    official: "check_door_switch_and_lock_official",
    community: "check_manual_release_community",
  },
};

export function findScenarioByIssueText(
  issueText: string
): TroubleshootingScenario | null {
  const normalized = issueText.trim();
  if (!normalized) {
    return null;
  }

  return (
    troubleshootingScenarios.find((scenario) =>
      scenario.matchKeywords.some((keyword) => normalized.includes(keyword))
    ) ?? null
  );
}

export function findScenarioByCode(
  issueCode: string
): TroubleshootingScenario | null {
  return (
    troubleshootingScenarios.find((scenario) => scenario.code === issueCode) ??
    null
  );
}

export function getFirstQuestion(
  scenario: TroubleshootingScenario
): Question | null {
  return scenario.questions[0] ?? null;
}

export function getNextQuestion(
  scenario: TroubleshootingScenario,
  answeredCodes: string[]
): Question | null {
  const sorted = [...scenario.questions].sort(
    (a, b) => a.sequence - b.sequence
  );
  return (
    sorted.find((question) => !answeredCodes.includes(question.code)) ?? null
  );
}

export function evaluateDiagnosis(
  scenario: TroubleshootingScenario,
  answers: Record<string, string>
): DiagnosisResult {
  const causes = [...scenario.evaluateCauses(answers)].sort(
    (a, b) => a.priority - b.priority
  );
  const topCause = causes[0];
  const guidancePair = topCause ? CAUSE_TO_GUIDANCE[topCause.code] : undefined;

  const officialCode = guidancePair?.official ?? Object.keys(scenario.guidances)[0];
  const officialGuidance = officialCode ? scenario.guidances[officialCode] : undefined;

  const communityAllowed = scenario.communityTrackAllowed !== false;
  const communityCode = communityAllowed ? guidancePair?.community : undefined;
  const communityGuidance = communityCode ? scenario.guidances[communityCode] : undefined;

  return {
    causes,
    guidanceOfficial: officialGuidance
      ? { code: officialGuidance.code, title: officialGuidance.title }
      : { code: "", title: "案内を準備しています" },
    guidanceCommunity: communityGuidance
      ? { code: communityGuidance.code, title: communityGuidance.title }
      : null,
  };
}

export function getSampleIssues(): string[] {
  const [firstScenario] = troubleshootingScenarios;
  return firstScenario?.fallbackSampleIssues ?? [];
}
