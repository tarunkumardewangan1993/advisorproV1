-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ADVISOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "PremiumFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'SINGLE');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('ACTIVE', 'LAPSED', 'MATURED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('SIP', 'LUMPSUM');

-- CreateEnum
CREATE TYPE "FundStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('CALL', 'MEETING', 'EMAIL', 'WHATSAPP', 'VISIT', 'OTHER');

-- CreateTable
CREATE TABLE "counters" (
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "counters_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "userUid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "mobile" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADVISOR',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "leadUid" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "mobile" TEXT,
    "source" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "followUpDate" TIMESTAMP(3),
    "convertedToClientId" TEXT,
    "revertedFromClientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "clientUid" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "mobile" TEXT,
    "dob" TIMESTAMP(3),
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_policies" (
    "id" TEXT NOT NULL,
    "policyUid" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "insurer" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "sumAssured" DECIMAL(14,2) NOT NULL,
    "premiumAmount" DECIMAL(14,2) NOT NULL,
    "premiumFrequency" "PremiumFrequency" NOT NULL DEFAULT 'YEARLY',
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "maturityDate" TIMESTAMP(3),
    "status" "PolicyStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "insurance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mutual_funds" (
    "id" TEXT NOT NULL,
    "fundUid" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "folioNumber" TEXT NOT NULL,
    "amcName" TEXT NOT NULL,
    "schemeName" TEXT NOT NULL,
    "investmentType" "InvestmentType" NOT NULL DEFAULT 'SIP',
    "sipAmount" DECIMAL(14,2),
    "sipDueDate" TIMESTAMP(3),
    "investedAmount" DECIMAL(14,2) NOT NULL,
    "currentValue" DECIMAL(14,2),
    "startDate" TIMESTAMP(3) NOT NULL,
    "status" "FundStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "mutual_funds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL DEFAULT 'CALL',
    "notes" TEXT NOT NULL,
    "interactionDate" TIMESTAMP(3) NOT NULL,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_userUid_idx" ON "users"("userUid");

-- CreateIndex
CREATE INDEX "users_mobile_idx" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "leads_convertedToClientId_key" ON "leads"("convertedToClientId");

-- CreateIndex
CREATE UNIQUE INDEX "leads_revertedFromClientId_key" ON "leads"("revertedFromClientId");

-- CreateIndex
CREATE INDEX "leads_leadUid_idx" ON "leads"("leadUid");

-- CreateIndex
CREATE INDEX "leads_mobile_idx" ON "leads"("mobile");

-- CreateIndex
CREATE INDEX "leads_advisorId_deletedAt_idx" ON "leads"("advisorId", "deletedAt");

-- CreateIndex
CREATE INDEX "leads_followUpDate_idx" ON "leads"("followUpDate");

-- CreateIndex
CREATE INDEX "clients_clientUid_idx" ON "clients"("clientUid");

-- CreateIndex
CREATE INDEX "clients_mobile_idx" ON "clients"("mobile");

-- CreateIndex
CREATE INDEX "clients_email_idx" ON "clients"("email");

-- CreateIndex
CREATE INDEX "clients_advisorId_deletedAt_idx" ON "clients"("advisorId", "deletedAt");

-- CreateIndex
CREATE INDEX "insurance_policies_policyUid_idx" ON "insurance_policies"("policyUid");

-- CreateIndex
CREATE INDEX "insurance_policies_advisorId_deletedAt_idx" ON "insurance_policies"("advisorId", "deletedAt");

-- CreateIndex
CREATE INDEX "insurance_policies_clientId_idx" ON "insurance_policies"("clientId");

-- CreateIndex
CREATE INDEX "insurance_policies_dueDate_idx" ON "insurance_policies"("dueDate");

-- CreateIndex
CREATE INDEX "mutual_funds_fundUid_idx" ON "mutual_funds"("fundUid");

-- CreateIndex
CREATE INDEX "mutual_funds_advisorId_deletedAt_idx" ON "mutual_funds"("advisorId", "deletedAt");

-- CreateIndex
CREATE INDEX "mutual_funds_clientId_idx" ON "mutual_funds"("clientId");

-- CreateIndex
CREATE INDEX "mutual_funds_sipDueDate_idx" ON "mutual_funds"("sipDueDate");

-- CreateIndex
CREATE INDEX "interactions_advisorId_deletedAt_idx" ON "interactions"("advisorId", "deletedAt");

-- CreateIndex
CREATE INDEX "interactions_clientId_idx" ON "interactions"("clientId");

-- CreateIndex
CREATE INDEX "interactions_followUpDate_idx" ON "interactions"("followUpDate");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_convertedToClientId_fkey" FOREIGN KEY ("convertedToClientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_revertedFromClientId_fkey" FOREIGN KEY ("revertedFromClientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_policies" ADD CONSTRAINT "insurance_policies_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_policies" ADD CONSTRAINT "insurance_policies_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutual_funds" ADD CONSTRAINT "mutual_funds_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutual_funds" ADD CONSTRAINT "mutual_funds_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Partial unique indexes (non-deleted rows only) — Prisma's schema DSL cannot
-- express a WHERE clause on @@unique, so these are hand-authored. They make a
-- soft-deleted record's UID/mobile/email immediately reusable.
CREATE UNIQUE INDEX "users_uid_active_unique" ON "users" ("userUid") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "users_mobile_active_unique" ON "users" ("mobile") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "users_email_active_unique" ON "users" ("email") WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "clients_uid_active_unique" ON "clients" ("clientUid") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "clients_mobile_active_unique" ON "clients" ("mobile") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "clients_email_active_unique" ON "clients" ("email") WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "leads_uid_active_unique" ON "leads" ("leadUid") WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "policies_uid_active_unique" ON "insurance_policies" ("policyUid") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "funds_uid_active_unique" ON "mutual_funds" ("fundUid") WHERE "deletedAt" IS NULL;
