-- AlterTable
ALTER TABLE "Progress" ALTER COLUMN "lifelines" SET DEFAULT '{"hint":false,"freeze":false,"flip":false}'::json;

-- AlterTable
ALTER TABLE "Questions" ALTER COLUMN "answer" SET DEFAULT '',
ALTER COLUMN "answer" SET DATA TYPE TEXT;
