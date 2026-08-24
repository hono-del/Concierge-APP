"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";

/** Expert Communityでの回答投稿（要件 #16, #6-STEP6）。投稿後、Studioの承認待ちへ送られる。 */
export async function submitAnswer(questionId: string, contributorId: string, answerText: string) {
  const answer = await prisma.expertAnswer.create({
    data: { questionId, contributorId, answerText, status: "pending" },
  });

  await prisma.expertQuestion.update({
    where: { id: questionId },
    data: { status: "answered" },
  });

  // Gamification（要件 #16）：回答投稿で+10pt
  await prisma.contributor.update({
    where: { id: contributorId },
    data: { points: { increment: 10 } },
  });

  revalidatePath(`/community/questions/${questionId}`);
  revalidatePath("/community");
  revalidatePath("/studio/review");
  revalidatePath("/studio");

  return { id: answer.id };
}
