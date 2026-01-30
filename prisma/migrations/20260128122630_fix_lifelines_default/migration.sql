-- AlterTable
ALTER TABLE "Progress" ALTER COLUMN "questionProgress" SET DEFAULT '[]'::json,
ALTER COLUMN "lifelines" SET DEFAULT '{"hint":false,"freeze":false,"flip":false}'::json;
