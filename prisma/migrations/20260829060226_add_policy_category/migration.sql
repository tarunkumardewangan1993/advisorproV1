-- CreateEnum
CREATE TYPE "PolicyCategory" AS ENUM ('TERM', 'HEALTH');

-- AlterTable
ALTER TABLE "insurance_policies" ADD COLUMN     "category" "PolicyCategory" NOT NULL DEFAULT 'TERM';

-- CreateIndex
CREATE INDEX "insurance_policies_category_idx" ON "insurance_policies"("category");
