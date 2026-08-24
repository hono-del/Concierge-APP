import { QuestionDetailClient } from "@/components/voc/community/QuestionDetailClient";
import { getExpertQuestion, listContributors } from "@/lib/voc/data/queries";

export const dynamic = "force-dynamic";

export default async function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // インメモリストアから検索（localhost では取得できるが Vercel 別インスタンスでは null になる場合がある）
  const [question, contributors] = await Promise.all([
    getExpertQuestion(id),
    listContributors(),
  ]);

  const defaultContributor = contributors.find((c) => c.id === "c-tkato") ?? contributors[0] ?? null;

  // question が null の場合は Client Component 側で localStorage からフォールバック
  return (
    <QuestionDetailClient
      serverQuestion={question}
      id={id}
      defaultContributor={defaultContributor}
    />
  );
}
