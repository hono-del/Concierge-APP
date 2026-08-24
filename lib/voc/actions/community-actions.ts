"use server";

import { revalidatePath } from "next/cache";
import { store } from "../data/store";

/** Expert Communityでの回答投稿（要件 #16, #6-STEP6）。投稿後、Studioの承認待ちへ送られる。 */
export async function submitAnswer(questionId: string, contributorId: string, answerText: string) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const contributor = store.contributors.find((c) => c.id === contributorId);
  if (!contributor) throw new Error("Contributor not found");

  store.answers.push({
    id,
    questionId,
    contributorId,
    contributor,
    answerText,
    status: "pending",
    createdAt: now,
    knowledgeItemId: null,
  });

  // 質問のステータス更新
  const q = store.questions.find((q) => q.id === questionId);
  if (q) {
    q.status = "answered";
    q.answerCount = store.answers.filter((a) => a.questionId === questionId).length;
  }

  // Gamification（要件 #16）：回答投稿で+10pt
  contributor.points += 10;

  revalidatePath(`/community/questions/${questionId}`);
  revalidatePath("/community");
  revalidatePath("/studio/review");
  revalidatePath("/studio");

  return { id };
}
