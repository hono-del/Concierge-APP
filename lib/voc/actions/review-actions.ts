"use server";

import { revalidatePath } from "next/cache";
import { buildStructuredFromExpertAnswer } from "../ai/structuring";
import { toKnowledgeCreateData } from "../data/mappers";
import { prisma } from "../prisma";

const KNOWLEDGE_ACCEPT_REWARD_POINTS = 100;

/**
 * Review Workflow（要件 #17〜19）：「Knowledgeに採用」。
 * ExpertAnswerをAIで構造化し、承認済みKnowledgeItemとして追加。回答者へポイントを付与する。
 */
export async function acceptAnswer(answerId: string, editedText?: string) {
  const answer = await prisma.expertAnswer.findUnique({
    where: { id: answerId },
    include: { question: true, contributor: true },
  });
  if (!answer) throw new Error("Answer not found");

  const finalText = editedText?.trim() || answer.answerText;
  const base = buildStructuredFromExpertAnswer({
    questionTitle: answer.question.title,
    questionVehicleModel: answer.question.vehicleModel,
    symptoms: JSON.parse(answer.question.symptomsJson) as string[],
    conditions: JSON.parse(answer.question.conditionsJson) as string[],
    answerText: finalText,
    contributorName: answer.contributor.name,
    contributorBadge: answer.contributor.badge,
  });

  const knowledge = await prisma.knowledgeItem.create({
    data: toKnowledgeCreateData(base, "approved"),
  });

  await prisma.expertAnswer.update({
    where: { id: answerId },
    data: {
      status: editedText ? "edited_accepted" : "accepted",
      answerText: finalText,
      knowledgeItem: { connect: { id: knowledge.id } },
    },
  });

  await prisma.expertQuestion.update({
    where: { id: answer.questionId },
    data: { status: "resolved" },
  });

  const contributor = await prisma.contributor.update({
    where: { id: answer.contributorId },
    data: {
      points: { increment: KNOWLEDGE_ACCEPT_REWARD_POINTS },
      acceptedAnswers: { increment: 1 },
    },
  });

  revalidatePath("/studio/review");
  revalidatePath("/studio");
  revalidatePath(`/studio/knowledge/${knowledge.id}`);
  revalidatePath("/community");
  revalidatePath(`/community/questions/${answer.questionId}`);
  revalidatePath(`/community/contributors/${contributor.id}`);

  return {
    knowledgeId: knowledge.id,
    contributor: { id: contributor.id, name: contributor.name, points: contributor.points },
    rewardPoints: KNOWLEDGE_ACCEPT_REWARD_POINTS,
  };
}

export async function rejectAnswer(answerId: string) {
  const answer = await prisma.expertAnswer.update({
    where: { id: answerId },
    data: { status: "rejected" },
  });
  revalidatePath("/studio/review");
  revalidatePath("/studio");
  return { id: answer.id };
}
