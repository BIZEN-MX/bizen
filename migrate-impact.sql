-- SQL MIGRATION: Instead of prisma db push, we'll manually create the new tables
-- This avoids Prisma trying to "fix" other non-public tables like auth.identities

CREATE TABLE IF NOT EXISTS "public"."foundations" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "logo" TEXT,
  "description" TEXT,
  "website" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "foundations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."school_impacts" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "foundation_id" TEXT NOT NULL,
  "season" TEXT NOT NULL,
  "donated_amount" DOUBLE PRECISION NOT NULL,
  "beneficiary_count" INTEGER NOT NULL,
  "report_url" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "school_impacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."impact_targets" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "current_value" DOUBLE PRECISION NOT NULL,
  "target_value" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "deadline" TIMESTAMP(3),
  "school_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "impact_targets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."donation_evidence" (
  "id" TEXT NOT NULL,
  "school_impact_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "image_url" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "donation_evidence_pkey" PRIMARY KEY ("id")
);

-- Add foreign keys
ALTER TABLE "public"."school_impacts" ADD CONSTRAINT "school_impacts_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."school_impacts" ADD CONSTRAINT "school_impacts_foundation_id_fkey" FOREIGN KEY ("foundation_id") REFERENCES "public"."foundations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."donation_evidence" ADD CONSTRAINT "donation_evidence_school_impact_id_fkey" FOREIGN KEY ("school_impact_id") REFERENCES "public"."school_impacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
