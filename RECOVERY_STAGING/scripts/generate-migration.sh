#!/bin/bash
# Hardcoded connection string for reliability
DB_URL="postgresql://postgres.qkrttsukyuujjovrjhjk:Yeyo.312603.@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

echo "Using Database URL: $DB_URL"

# Run migrate diff
npx prisma migrate diff \
  --from-url "$DB_URL" \
  --to-schema-datamodel prisma/schema.prisma \
  --script > migration.sql

echo "✅ Migration SQL generated in migration.sql"
