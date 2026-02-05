-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "isJunior" BOOLEAN NOT NULL DEFAULT false,
    "finalResult" INTEGER NOT NULL DEFAULT 0,
    "quizStartTime" TIMESTAMP(3),
    "quizEndTime" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" TEXT NOT NULL,
    "category" BOOLEAN NOT NULL DEFAULT false,
    "questionText" TEXT NOT NULL,
    "answer" INTEGER NOT NULL DEFAULT 0,
    "hint" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "progressId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentQuestionId" TEXT,
    "correctQuestionIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lifelines" JSONB NOT NULL DEFAULT '{"hint":false,"freeze":false,"flip":false}'::json,
    "marks" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("progressId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_key" ON "Progress"("userId");

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_currentQuestionId_fkey" FOREIGN KEY ("currentQuestionId") REFERENCES "Questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
