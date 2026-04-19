import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";

// Endpoint designed for Google Cloud Scheduler / Vercel Cron
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const querySecret = req.nextUrl.searchParams.get("secret");

  // Seguridad básica: Previene que usuarios al azar disparen ciclos pesados de base de datos
  // La contraseña del Cron debe coincidir con CRON_SECRET en el .env, o usar la llave de respaldo.
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    querySecret !== "bizen-master-cleanup-xyz"
  ) {
    return NextResponse.json({ error: "No autorizado para tareas de mantenimiento cron." }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // 1. Prune System Errors (Basura técnica vieja) -> 30 días
    const errorCleanup = await prisma.systemError.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    // 2. Prune AuditLogs (Telemetría de UI/Clicks) -> 90 días
    const auditCleanup = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: ninetyDaysAgo,
        },
      },
    });

    const reportMessage = `Mantenimiento Preventivo de Base de Datos completado:\n- \`${errorCleanup.count}\` reportes técnicos SystemError eliminados (más de 30 días).\n- \`${auditCleanup.count}\` rastro de telemetría AuditLogs eliminados (más de 90 días).`;

    await logError(
      reportMessage, 
      "Database Cron Cleanup", 
      "INFO", 
      "System_Cron"
    );

    return NextResponse.json({ 
      success: true, 
      systemErrorsDeleted: errorCleanup.count,
      auditLogsDeleted: auditCleanup.count
    });

  } catch (error: any) {
    await logError(String(error?.message || error), "Database Cron Cleanup Failed", "CRITICAL", "System_Cron");
    return NextResponse.json({ success: false, error: "Fallo rotundo en la poda de base de datos." }, { status: 500 });
  }
}
