import { getKnowledge } from "../data/queries";
import { prisma } from "../prisma";
import type {
  ChatAnswer,
  ChatContext,
  ChatSimilarExperience,
  ChatTurnResult,
  KnowledgeCategory,
  KnowledgeItem,
} from "../types";

/**
 * Chat Retrieval / Hero Scenario / Unknown Detection のMockロジック。
 * 出典: docs/input/voc_knowledge_system_overview_requirements.md #9〜14
 *
 * 「検索するKnowledge Base」ではなく、Vehicle/Symptom/Condition/Safety/Trust/Resolution/Recencyの
 * 優先順位（#13）に沿って、事前に構造化されたKnowledgeから最も適した案内を選ぶ。
 */

async function loadKnowledge(id: string): Promise<KnowledgeItem> {
  const k = await getKnowledge(id);
  if (!k) throw new Error(`Knowledge not found: ${id}`);
  return k;
}

function toSimilarExperience(k: KnowledgeItem, matchScore: number): ChatSimilarExperience {
  return {
    knowledgeId: k.id,
    title: k.issueTitle,
    summary: k.resolutions[0]?.action ?? k.checks[0]?.action ?? "",
    sourceType: k.source.type,
    sourceTitle: k.source.title,
    sourceUrl: k.source.url,
    matchScore,
  };
}

async function buildAnswerFromKnowledge(opts: {
  mode: ChatContext["knowledgeMode"];
  firstActionKnowledgeId: string;
  similarIds: string[];
  officialId?: string;
  whyExtra?: string[];
  extraTips?: string[];
}): Promise<ChatAnswer> {
  const primary = await loadKnowledge(opts.firstActionKnowledgeId);
  const official = opts.officialId ? await loadKnowledge(opts.officialId) : null;
  const similar = await Promise.all(
    opts.similarIds.map((id, i) => loadKnowledge(id).then((k) => toSimilarExperience(k, 0.9 - i * 0.1)))
  );

  const useVoc = opts.mode === "official_voc";
  const firstAction = useVoc
    ? {
        title: "まずここを確認してください",
        body: primary.checks.map((c) => c.action).join(" → ") || primary.resolutions[0]?.action || "",
      }
    : {
        title: "まずここを確認してください",
        body:
          (official ?? primary).checks.map((c) => c.action).join(" → ") ||
          (official ?? primary).resolutions[0]?.action ||
          "",
      };

  const why = useVoc
    ? [...(opts.whyExtra ?? []), `・同じNXで似た症状のKnowledgeが${similar.length}件あります`]
    : ["・オーナーズマニュアルに基づく一般的な確認事項です", "・改善しない場合は販売店へご相談ください"];

  return {
    kind: "answer",
    mode: opts.mode,
    firstAction,
    why,
    similarExperiences: useVoc ? similar : [],
    official: official
      ? {
          title: official.issueTitle,
          body: official.checks.map((c) => c.action).join(" → "),
          sourceTitle: official.source.title,
        }
      : null,
    tips: useVoc ? [...primary.tips, ...(opts.extraTips ?? [])] : [],
    trust: {
      score: useVoc ? primary.trust.score : 100,
      reason: useVoc ? primary.trust.reason : ["公式情報"],
      officialCorroboration: useVoc ? primary.trust.officialCorroboration : true,
      multipleSourceSupport: useVoc ? primary.trust.multipleSourceSupport : false,
      safetyLevel: primary.safety.level,
    },
    matchedKnowledgeId: useVoc ? primary.id : official?.id ?? primary.id,
    primarySourceType: useVoc ? primary.source.type : "official",
    safetyBlocked: false,
  };
}

async function buildSafetyBlockedAnswer(officialId: string): Promise<ChatAnswer> {
  const official = await loadKnowledge(officialId);
  return {
    kind: "answer",
    mode: "official_voc",
    firstAction: {
      title: "安全のため、まず公式情報をご確認ください",
      body: "安全に関わるため、Experience Knowledgeのみでは案内できません。公式情報の確認、または販売店・専門スタッフへのご相談を優先してください。",
    },
    why: ["・ブレーキ等、安全に直結する装置に関わる可能性があるため"],
    similarExperiences: [],
    official: {
      title: official.issueTitle,
      body: official.checks.map((c) => c.action).join(" → "),
      sourceTitle: official.source.title,
    },
    tips: [],
    trust: {
      score: 100,
      reason: ["公式情報"],
      officialCorroboration: true,
      multipleSourceSupport: false,
      safetyLevel: "high",
    },
    matchedKnowledgeId: official.id,
    primarySourceType: "official",
    safetyBlocked: true,
  };
}

const DOOR_KEYWORDS = ["ドア", "e-latch", "elatch", "イーラッチ"];
const NOISE_KEYWORDS = ["異音", "音がする", "コトコト", "カタカタ"];
const BATTERY_KEYWORDS = ["バッテリー", "上がった", "12v"];
const INFOTAINMENT_KEYWORDS = ["bluetooth", "ブルートゥース", "carplay", "カープレイ", "ナビ", "フリーズ", "画面"];
const WARNING_KEYWORDS = ["警告灯", "警告ランプ"];

function normalize(text: string): string {
  return text.toLowerCase();
}

export function detectQuickCategory(text: string): KnowledgeCategory | null {
  const t = normalize(text);
  if (DOOR_KEYWORDS.some((k) => t.includes(k))) return "door";
  if (NOISE_KEYWORDS.some((k) => t.includes(k))) return "noise";
  if (BATTERY_KEYWORDS.some((k) => t.includes(k))) return "battery";
  if (INFOTAINMENT_KEYWORDS.some((k) => t.includes(k))) return "infotainment";
  if (WARNING_KEYWORDS.some((k) => t.includes(k))) return "warning";
  return null;
}

function isHeroDoorTrigger(text: string): boolean {
  const t = normalize(text);
  const hasDoor = DOOR_KEYWORDS.some((k) => t.includes(k));
  const hasOutside = t.includes("外から") || t.includes("外側");
  const hasCannotOpen = t.includes("開かない") || t.includes("開けない");
  return hasDoor && hasOutside && hasCannotOpen;
}

/** Unknown Detection（要件 #14）に該当する典型パターン（低温時のみ発生するe-Latch不具合など） */
function isUnknownPattern(text: string): boolean {
  const t = normalize(text);
  const hasElatch = t.includes("e-latch") || t.includes("elatch") || t.includes("イーラッチ") || (t.includes("ドア") && t.includes("低い"));
  const hasCondition = t.includes("外気温") || t.includes("低い") || t.includes("寒い") || t.includes("冷え");
  const hasIntermittent = t.includes("数分") || t.includes("直る") || t.includes("再現");
  return hasElatch && hasCondition && hasIntermittent;
}

export async function startConversation(
  text: string,
  knowledgeMode: ChatContext["knowledgeMode"]
): Promise<ChatTurnResult> {
  const baseContext: ChatContext = { knowledgeMode, scenario: null, lastUserText: text };

  if (isHeroDoorTrigger(text)) {
    return {
      kind: "intro",
      lines: ["急いで解決します。", "まず症状に近い事例から確認します。"],
      context: { ...baseContext, scenario: "hero_door" },
    };
  }

  if (isUnknownPattern(text)) {
    return {
      kind: "unknown",
      reason: "現在のKnowledgeだけでは信頼できる解決方法を特定できませんでした。",
      context: baseContext,
    };
  }

  const category = detectQuickCategory(text);
  if (category) {
    return askQuickCategory(category, knowledgeMode);
  }

  return {
    kind: "unknown",
    reason: "現在のKnowledgeだけでは信頼できる解決方法を特定できませんでした。",
    context: baseContext,
  };
}

export async function askQuickCategory(
  category: KnowledgeCategory,
  knowledgeMode: ChatContext["knowledgeMode"]
): Promise<ChatTurnResult> {
  const context: ChatContext = { knowledgeMode, scenario: null, pendingCategory: category };

  if (category === "door") {
    return {
      kind: "intro",
      lines: ["急いで解決します。", "まず症状に近い事例から確認します。"],
      context: { ...context, scenario: "hero_door" },
    };
  }

  if (category === "noise") {
    return {
      kind: "question",
      text: "ブレーキを踏んだ時に音がしますか？",
      options: [
        { label: "はい", value: "brake_yes" },
        { label: "いいえ", value: "brake_no" },
      ],
      context,
    };
  }

  if (category === "battery") {
    const answer = await buildAnswerFromKnowledge({
      mode: knowledgeMode,
      firstActionKnowledgeId: knowledgeMode === "official_voc" ? "k-battery-voc" : "k-battery-official",
      similarIds: knowledgeMode === "official_voc" ? ["k-battery-voc"] : [],
      officialId: "k-battery-official",
      whyExtra: ["・長期駐車後に発生しやすい症状として報告されています"],
    });
    return { kind: "answer", answer, context };
  }

  if (category === "infotainment") {
    const answer = await buildAnswerFromKnowledge({
      mode: knowledgeMode,
      firstActionKnowledgeId: knowledgeMode === "official_voc" ? "k-carplay-voc" : "k-carplay-official",
      similarIds: knowledgeMode === "official_voc" ? ["k-carplay-voc", "k-navi-freeze-voc"] : [],
      officialId: "k-carplay-official",
    });
    return { kind: "answer", answer, context };
  }

  if (category === "warning") {
    const answer = await buildAnswerFromKnowledge({
      mode: "official_voc",
      firstActionKnowledgeId: "k-warning-official",
      similarIds: [],
      officialId: "k-warning-official",
      whyExtra: ["・警告灯は安全に関わる場合があるため、公式情報を優先しています"],
    });
    return { kind: "answer", answer, context };
  }

  return {
    kind: "unknown",
    reason: "現在のKnowledgeだけでは信頼できる解決方法を特定できませんでした。",
    context,
  };
}

export async function continueConversation(
  value: string,
  context: ChatContext
): Promise<ChatTurnResult> {
  // ── 異音シナリオ：ブレーキ関連かどうかでSafety Gateを分岐 ──
  if (context.pendingCategory === "noise") {
    if (value === "brake_yes") {
      const answer = await buildSafetyBlockedAnswer("k-brake-noise-official");
      return { kind: "answer", answer, context };
    }
    const answer = await buildAnswerFromKnowledge({
      mode: context.knowledgeMode,
      firstActionKnowledgeId: context.knowledgeMode === "official_voc" ? "k-noise-voc" : "k-brake-noise-official",
      similarIds: context.knowledgeMode === "official_voc" ? ["k-noise-voc", "k-noise-expert"] : [],
      officialId: undefined,
      whyExtra: ["・ブレーキ以外の足回りからの異音として報告されています"],
    });
    return { kind: "answer", answer, context };
  }

  // ── Hero Door Scenario ──
  if (context.scenario === "hero_door") {
    if (!context.doorOtherOpen) {
      if (value === "all_closed") {
        const answer = await buildAnswerFromKnowledge({
          mode: "official_voc",
          firstActionKnowledgeId: "k-battery-official",
          similarIds: [],
          officialId: "k-battery-official",
          whyExtra: ["・すべてのドアが開かない場合、電源系（スマートキー電池・12Vバッテリー）の可能性が高いため"],
        });
        return { kind: "answer", answer, context };
      }
      return {
        kind: "question",
        text: "開かないのは片側だけですか？",
        options: [
          { label: "左後席だけ", value: "left" },
          { label: "右後席だけ", value: "right" },
          { label: "両方", value: "both" },
        ],
        context: { ...context, doorOtherOpen: "open" },
      };
    }

    if (!context.doorSide) {
      const side = value as "left" | "right" | "both";
      if (side === "both") {
        const answer = await buildAnswerFromKnowledge({
          mode: context.knowledgeMode,
          firstActionKnowledgeId: context.knowledgeMode === "official_voc" ? "k-door-outside-voc" : "k-door-official",
          similarIds: context.knowledgeMode === "official_voc" ? ["k-door-outside-voc"] : [],
          officialId: "k-door-official",
        });
        return { kind: "answer", answer, context: { ...context, doorSide: side } };
      }

      const answer = await buildAnswerFromKnowledge({
        mode: context.knowledgeMode,
        firstActionKnowledgeId:
          context.knowledgeMode === "official_voc" ? "k-elatch-response-voc" : "k-door-official",
        similarIds:
          context.knowledgeMode === "official_voc"
            ? ["k-elatch-response-voc2", "k-door-outside-voc"]
            : [],
        officialId: "k-door-official",
        whyExtra: ["・他のドアは正常です", `・後席の${side === "left" ? "左" : "右"}側のみ発生しています`],
        extraTips: [],
      });
      return { kind: "answer", answer, context: { ...context, doorSide: side } };
    }
  }

  return {
    kind: "unknown",
    reason: "現在のKnowledgeだけでは信頼できる解決方法を特定できませんでした。",
    context,
  };
}

/** Chat内の会話サマリからExpert Community向けの質問案を自動生成する（要件 #14, Mock） */
export async function generateExpertQuestionDraft(context: ChatContext) {
  const symptoms: string[] = [];
  const alreadyChecked: string[] = ["ドアロック設定", "スマートキーの電池"];
  let title = "LEXUS NXのトラブルについて経験のある方はいませんか？";
  let questionText = "";
  const tags = ["NX"];

  if (context.lastUserText?.includes("e-Latch") || context.lastUserText?.includes("elatch")) {
    title = "外気温が低い時だけe-Latchが反応しない症状について経験のある方はいませんか？";
    symptoms.push("外気温が低い時のみ左後席のe-Latchが反応しない", "数分待つと直ることがある");
    tags.push("door", "e-latch", "低温");
    questionText =
      "LEXUS NXで、外気温が低い時だけ左後席のe-Latchが反応しない症状について経験のある方はいませんか？\n数分待つと直ることがあるのですが、再現条件がよく分かりません。同じ症状の原因や、現場で有効だった確認方法・一時的な対処方法があれば教えてください。";
  } else {
    symptoms.push(context.lastUserText ?? "症状の詳細は本文をご確認ください");
    questionText = `LEXUS NXで次のような症状が発生しています。「${context.lastUserText ?? ""}」\n同じ症状の原因や、現場で有効だった確認方法があれば教えてください。`;
  }

  return {
    title,
    vehicleModel: "NX450h+",
    symptoms,
    conditions: ["外気温が低い時"],
    alreadyChecked,
    questionText,
    tags,
    rewardPoints: 50,
  };
}

export async function countApprovedKnowledge(): Promise<number> {
  return prisma.knowledgeItem.count({ where: { status: "approved" } });
}
