"use server";

import { revalidatePath } from "next/cache";
import { buildStructuredFromExpertAnswer } from "../ai/structuring";
import { store } from "../data/store";

const KNOWLEDGE_ACCEPT_REWARD_POINTS = 100;

/**
 * Review Workflow（要件 #17〜19）：「Knowledgeに採用」。
 * ExpertAnswerをAIで構造化し、承認済みKnowledgeItemとして追加。回答者へポイントを付与する。
 */
export async function acceptAnswer(answerId: string, editedText?: string) {
  const answer = store.answers.find((a) => a.id === answerId);
  if (!answer) throw new Error("Answer not found");

  const question = store.questions.find((q) => q.id === answer.questionId);
  if (!question) throw new Error("Question not found");

  const contributor = store.contributors.find((c) => c.id === answer.contributorId);
  if (!contributor) throw new Error("Contributor not found");

  const finalText = editedText?.trim() || answer.answerText;
  const base = buildStructuredFromExpertAnswer({
    questionTitle: question.title,
    questionVehicleModel: question.vehicleModel,
    symptoms: question.symptoms,
    conditions: question.conditions,
    answerText: finalText,
    contributorName: contributor.name,
    contributorBadge: contributor.badge,
  });

  const knowledgeId = crypto.randomUUID();
  const now = new Date().toISOString();

  store.knowledge.unshift({
    ...base,
    id: knowledgeId,
    status: "approved",
    rawVocId: null,
    createdAt: now,
    updatedAt: now,
  });

  // Answer更新
  answer.status = editedText ? "edited_accepted" : "accepted";
  answer.answerText = finalText;
  answer.knowledgeItemId = knowledgeId;

  // Question解決
  question.status = "resolved";

  // Contributorにポイント付与
  contributor.points += KNOWLEDGE_ACCEPT_REWARD_POINTS;
  contributor.acceptedAnswers += 1;

  revalidatePath("/studio/review");
  revalidatePath("/studio");
  revalidatePath(`/studio/knowledge/${knowledgeId}`);
  revalidatePath("/community");
  revalidatePath(`/community/questions/${answer.questionId}`);

  return {
    knowledgeId,
    contributor: { id: contributor.id, name: contributor.name, points: contributor.points },
    rewardPoints: KNOWLEDGE_ACCEPT_REWARD_POINTS,
  };
}

export async function rejectAnswer(answerId: string) {
  const answer = store.answers.find((a) => a.id === answerId);
  if (!answer) throw new Error("Answer not found");
  answer.status = "rejected";

  revalidatePath("/studio/review");
  revalidatePath("/studio");
  return { id: answer.id };
}
