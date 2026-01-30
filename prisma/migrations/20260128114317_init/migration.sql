-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "isJunior" BOOLEAN NOT NULL DEFAULT false,
    "finalResult" INTEGER NOT NULL DEFAULT 0,
    "lifelineFlip" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "questionText" TEXT NOT NULL,
    "answer" VARCHAR(255) NOT NULL,
    "hint" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "progressId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentQuestionId" INTEGER,
    "questionProgress" JSONB NOT NULL DEFAULT '[]'::json,
    "currentQuestionStartTime" TIMESTAMP(3),
    "lifelines" JSONB NOT NULL DEFAULT '{"freeze":false,"flip":false,"hint":false}'::json,
    "marks" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("progressId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_key" ON "Progress"("userId");

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_currentQuestionId_fkey" FOREIGN KEY ("currentQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
