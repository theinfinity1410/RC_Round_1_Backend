/*
  Warnings:

  - You are about to drop the column `streak` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `lifelineFlip` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "streak",
ALTER COLUMN "questionProgress" SET DEFAULT '[]'::json,
ALTER COLUMN "lifelines" SET DEFAULT '{"hint":false,"freeze":false,"flip":false}'::json;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "lifelineFlip";
