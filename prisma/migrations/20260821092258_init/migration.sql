-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL DEFAULT 'NX',
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastCollectedAt" DATETIME,
    "collectedItems" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RawVoc" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "rawTitle" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'new',
    "collectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RawVoc_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rawVocId" TEXT,
    "vehicleMaker" TEXT NOT NULL DEFAULT 'LEXUS',
    "vehicleModel" TEXT NOT NULL DEFAULT 'NX',
    "vehicleModelYear" TEXT,
    "vehicleGrade" TEXT,
    "vehiclePowertrain" TEXT,
    "category" TEXT NOT NULL,
    "issueTitle" TEXT NOT NULL,
    "symptomsJson" TEXT NOT NULL,
    "conditionsJson" TEXT NOT NULL,
    "causesJson" TEXT NOT NULL,
    "checksJson" TEXT NOT NULL,
    "resolutionsJson" TEXT NOT NULL,
    "tipsJson" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceTitle" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceAuthor" TEXT,
    "publishedAt" DATETIME,
    "trustScore" INTEGER NOT NULL,
    "trustReasonJson" TEXT NOT NULL,
    "officialCorroboration" BOOLEAN NOT NULL DEFAULT false,
    "multipleSourceSupport" BOOLEAN NOT NULL DEFAULT false,
    "safetyLevel" TEXT NOT NULL DEFAULT 'low',
    "requiresOfficialConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "safetyNotesJson" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "expertAnswerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "KnowledgeItem_rawVocId_fkey" FOREIGN KEY ("rawVocId") REFERENCES "RawVoc" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "KnowledgeItem_expertAnswerId_fkey" FOREIGN KEY ("expertAnswerId") REFERENCES "ExpertAnswer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contributor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "vehicleModel" TEXT,
    "knowledgeLevel" INTEGER NOT NULL DEFAULT 1,
    "points" INTEGER NOT NULL DEFAULT 0,
    "acceptedAnswers" INTEGER NOT NULL DEFAULT 0,
    "helpfulRate" INTEGER NOT NULL DEFAULT 80,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ExpertQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "symptomsJson" TEXT NOT NULL,
    "conditionsJson" TEXT NOT NULL,
    "alreadyCheckedJson" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "tagsJson" TEXT NOT NULL,
    "rewardPoints" INTEGER NOT NULL DEFAULT 50,
    "authorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExpertQuestion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Contributor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExpertAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "answerText" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExpertAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExpertQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExpertAnswer_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeItem_rawVocId_key" ON "KnowledgeItem"("rawVocId");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeItem_expertAnswerId_key" ON "KnowledgeItem"("expertAnswerId");
