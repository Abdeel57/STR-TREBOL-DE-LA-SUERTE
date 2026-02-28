-- AlterTable
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "titleColor" TEXT;
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "subtitleColor" TEXT;
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "descriptionColor" TEXT;

