import { KnowledgeDetailClient } from "@/components/voc/studio/KnowledgeDetailClient";
import { getKnowledge } from "@/lib/voc/data/queries";

export const dynamic = "force-dynamic";

export default async function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const knowledge = await getKnowledge(id);

  return <KnowledgeDetailClient id={id} serverKnowledge={knowledge} />;
}
