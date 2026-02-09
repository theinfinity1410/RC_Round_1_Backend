/*
  Warnings:

  - You are about to drop the column `correctQuestionIds` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `currentQuestionId` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `quizEndTime` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `quizStartTime` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_currentQuestionId_fkey";

-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "correctQuestionIds",
DROP COLUMN "currentQuestionId",
DROP COLUMN "isCompleted",
ADD COLUMN     "attemptedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "correctCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentQuestionIdx" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "questionIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "lifelines" SET DEFAULT '{"hint":false,"freeze":false,"flip":false}'::json;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "quizEndTime",
DROP COLUMN "quizStartTime",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3);
