"use server";

import { revalidatePath } from "next/cache";
import {
  askQuickCategory,
  continueConversation,
  generateExpertQuestionDraft,
  startConversation,
} from "../ai/chat-engine";
import { store } from "../data/store";
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
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  store.questions.unshift({
    id,
    title: draft.title,
    vehicleModel: draft.vehicleModel,
    symptoms: draft.symptoms,
    conditions: draft.conditions,
    alreadyChecked: draft.alreadyChecked,
    questionText: draft.questionText,
    tags: draft.tags,
    rewardPoints: draft.rewardPoints,
    authorId: null,
    status: "open",
    createdAt: now,
    answerCount: 0,
  });

  revalidatePath("/community");
  return { id };
}
