"use server";

import {
  askQuickCategory,
  continueConversation,
  generateExpertQuestionDraft,
  startConversation,
} from "../ai/chat-engine";
import { prisma } from "../prisma";
import type { ChatContext, KnowledgeCategory } from "../types";

export async function postChatMessage(text: string, context: ChatContext) {
  return startConversation(text, context.knowledgeMode);
}

export async function postQuickReply(value: string, context: ChatContext) {
  return continueConversation(value, context);
}

export async function postQuickQuestion(category: KnowledgeCategory, context: ChatContext) {
  return askQuickCategory(category, context.knowledgeMode);
}

export async function draftExpertQuestion(context: ChatContext) {
  return generateExpertQuestionDraft(context);
}

export interface ExpertQuestionDraftInput {
  title: string;
  vehicleModel: string;
  symptoms: string[];
  conditions: string[];
  alreadyChecked: string[];
  questionText: string;
  tags: string[];
  rewardPoints: number;
}

export async function submitExpertQuestion(draft: ExpertQuestionDraftInput) {
  const created = await prisma.expertQuestion.create({
    data: {
      title: draft.title,
      vehicleModel: draft.vehicleModel,
      symptomsJson: JSON.stringify(draft.symptoms),
      conditionsJson: JSON.stringify(draft.conditions),
      alreadyCheckedJson: JSON.stringify(draft.alreadyChecked),
      questionText: draft.questionText,
      tagsJson: JSON.stringify(draft.tags),
      rewardPoints: draft.rewardPoints,
      status: "open",
    },
  });
  return { id: created.id };
}
