import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";
import { seedContributors } from "../lib/voc/mock-data/contributors";
import { seedKnowledge } from "../lib/voc/mock-data/knowledge";
import { seedQuestions } from "../lib/voc/mock-data/questions";
import { seedRawVoc } from "../lib/voc/mock-data/raw-voc";
import { seedSources } from "../lib/voc/mock-data/sources";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("VoCナレッジ モックデータのSeedを開始します…");

  await prisma.expertAnswer.deleteMany();
  await prisma.expertQuestion.deleteMany();
  await prisma.contributor.deleteMany();
  await prisma.knowledgeItem.deleteMany();
  await prisma.rawVoc.deleteMany();
  await prisma.source.deleteMany();

  for (const source of seedSources) {
    const items = seedRawVoc.filter((r) => r.sourceId === source.id);
    await prisma.source.create({
      data: {
        id: source.id,
        name: source.name,
        url: source.url,
        sourceType: source.sourceType,
        vehicleModel: source.vehicleModel,
        status: "active",
        lastCollectedAt: new Date(),
        collectedItems: items.length,
      },
    });
  }
  console.log(`Source: ${seedSources.length}件`);

  for (const raw of seedRawVoc) {
    await prisma.rawVoc.create({
      data: {
        id: raw.id,
        sourceId: raw.sourceId,
        rawTitle: raw.rawTitle,
        rawText: raw.rawText,
        sourceName: raw.sourceName,
        sourceUrl: raw.sourceUrl,
        publishedAt: new Date(raw.publishedAt),
        status: "structured",
        collectedAt: new Date(raw.publishedAt),
      },
    });
  }
  console.log(`RawVoc: ${seedRawVoc.length}件`);

  for (const contributor of seedContributors) {
    await prisma.contributor.create({
      data: {
        id: contributor.id,
        name: contributor.name,
        badge: contributor.badge,
        vehicleModel: contributor.vehicleModel,
        knowledgeLevel: contributor.knowledgeLevel,
        points: contributor.points,
        acceptedAnswers: contributor.acceptedAnswers,
        helpfulRate: contributor.helpfulRate,
      },
    });
  }
  console.log(`Contributor: ${seedContributors.length}件`);

  for (const question of seedQuestions) {
    await prisma.expertQuestion.create({
      data: {
        id: question.id,
        title: question.title,
        vehicleModel: question.vehicleModel,
        symptomsJson: JSON.stringify(question.symptoms),
        conditionsJson: JSON.stringify(question.conditions),
        alreadyCheckedJson: JSON.stringify(question.alreadyChecked),
        questionText: question.questionText,
        tagsJson: JSON.stringify(question.tags),
        rewardPoints: question.rewardPoints,
        status: question.status,
      },
    });

    for (const answer of question.answers) {
      await prisma.expertAnswer.create({
        data: {
          id: answer.id,
          questionId: question.id,
          contributorId: answer.contributorId,
          answerText: answer.answerText,
          status: answer.status === "accepted" ? "accepted" : "pending",
        },
      });
    }
  }
  console.log(`ExpertQuestion: ${seedQuestions.length}件`);

  for (const k of seedKnowledge) {
    await prisma.knowledgeItem.create({
      data: {
        id: k.id,
        rawVocId: k.rawVocId,
        vehicleMaker: k.vehicle.maker,
        vehicleModel: k.vehicle.model,
        vehicleModelYear: k.vehicle.modelYear,
        vehicleGrade: k.vehicle.grade,
        vehiclePowertrain: k.vehicle.powertrain,
        category: k.category,
        issueTitle: k.issueTitle,
        symptomsJson: JSON.stringify(k.symptom),
        conditionsJson: JSON.stringify(k.conditions),
        causesJson: JSON.stringify(k.possibleCauses),
        checksJson: JSON.stringify(k.checks),
        resolutionsJson: JSON.stringify(k.resolutions),
        tipsJson: JSON.stringify(k.tips),
        sourceType: k.source.type,
        sourceTitle: k.source.title,
        sourceUrl: k.source.url,
        sourceAuthor: k.source.author,
        trustScore: k.trust.score,
        trustReasonJson: JSON.stringify(k.trust.reason),
        officialCorroboration: k.trust.officialCorroboration,
        multipleSourceSupport: k.trust.multipleSourceSupport,
        safetyLevel: k.safety.level,
        requiresOfficialConfirmation: k.safety.requiresOfficialConfirmation,
        safetyNotesJson: k.safety.notes ? JSON.stringify(k.safety.notes) : null,
        status: k.status,
        expertAnswerId: k.fromExpertAnswer
          ? seedQuestions
              .find((q) => q.id === k.fromExpertAnswer!.questionId)
              ?.answers.find((a) => a.linkedKnowledgeId === k.id)?.id
          : null,
      },
    });
  }
  console.log(`KnowledgeItem: ${seedKnowledge.length}件`);

  console.log("Seed完了。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
