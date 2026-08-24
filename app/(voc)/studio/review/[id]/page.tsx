import { ReviewDetailClient } from "@/components/voc/studio/ReviewDetailClient";
import { detectQuickCategory } from "@/lib/voc/ai/chat-engine";
import { buildStructuredFromExpertAnswer, detectSafetyLevel } from "@/lib/voc/ai/structuring";
import {
  getExpertAnswerDetail,
  getOfficialKnowledgeByCategory,
  listKnowledgeByCategory,
} from "@/lib/voc/data/queries";

export const dynamic = "force-dynamic";

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getExpertAnswerDetail(id);

  let serverDetail = null;

  if (detail) {
    const { answer, question } = detail;
    const category = detectQuickCategory(`${question.title} ${answer.answerText}`) ?? "other";
    const safetyLevel = detectSafetyLevel(`${question.title} ${answer.answerText}`);
    const structured = buildStructuredFromExpertAnswer({
      questionTitle: question.title,
      questionVehicleModel: question.vehicleModel,
      symptoms: question.symptoms,
      conditions: question.conditions,
      answerText: answer.answerText,
      contributorName: answer.contributor.name,
      contributorBadge: answer.contributor.badge,
    });
    const [similarKnowledge, official] = await Promise.all([
      listKnowledgeByCategory(category),
      getOfficialKnowledgeByCategory(category),
    ]);

    serverDetail = {
      answer: {
        id: answer.id,
        answerText: answer.answerText,
        status: answer.status,
        createdAt: answer.createdAt,
        contributor: {
          name: answer.contributor.name,
          badge: answer.contributor.badge,
          knowledgeLevel: answer.contributor.knowledgeLevel,
          points: answer.contributor.points,
        },
      },
      question: {
        title: question.title,
        vehicleModel: question.vehicleModel,
        questionText: question.questionText,
        tags: question.tags,
        symptoms: question.symptoms,
        conditions: question.conditions,
        rewardPoints: question.rewardPoints,
      },
      category,
      safetyLevel,
      structured,
      similarKnowledge: similarKnowledge.map((k) => ({
        id: k.id,
        issueTitle: k.issueTitle,
        source: { type: k.source.type },
      })),
      official: official
        ? {
            issueTitle: official.issueTitle,
            checks: official.checks.map((c) => ({ action: c.action })),
          }
        : null,
    };
  }

  return <ReviewDetailClient serverId={id} serverDetail={serverDetail} />;
}
