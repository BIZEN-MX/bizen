
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Get all table names in the current database
    // This query works for PostgreSQL (Cloud SQL)
    const tables: any[] = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const auditResults = [];

    // 2. For each table, get the row count
    for (const row of tables) {
      const tableName = row.table_name;
      try {
        const countResult: any[] = await prisma.$queryRawUnsafe(`
          SELECT COUNT(*) as count FROM "public"."${tableName}"
        `);
        const rowCount = countResult[0]?.count || 0;

        auditResults.push({
          table: tableName,
          rows: Number(rowCount),
          status: Number(rowCount) > 0 ? "🟢 DATA" : "⚪ EMPTY"
        });
      } catch (e) {
        auditResults.push({
          table: tableName,
          rows: 0,
          status: "🔴 ERROR / NO ACCESS"
        });
      }
    }

    return NextResponse.json({
      success: true,
      total_tables: tables.length,
      audit: auditResults
    });

  } catch (error: any) {
    console.error("DB Audit Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
