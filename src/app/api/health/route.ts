import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Evitar que Next.js cachee esta ruta (queremos el estado en tiempo real)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const startTime = Date.now();
    
    // 1. Verificar conexión a la Base de Datos (Prisma/PostgreSQL)
    // Hacemos una consulta muy ligera para probar que el proxy y la BD responden
    await prisma.$queryRaw`SELECT 1`;
    
    const dbLatency = Date.now() - startTime;

    // 2. Construir respuesta exitosa
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
        database: {
          status: "connected",
          latency_ms: dbLatency
        },
        memory: {
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + " MB",
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB"
        }
      },
      { 
        status: 200,
        headers: {
          // Deshabilitar caché para el health check
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error("❌ Health Check Error:", error);
    
    // 3. Respuesta de error si la BD falla o el sistema está comprometido
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: {
          status: "disconnected",
          error: error instanceof Error ? error.message : "Error desconocido de conexión"
        }
      },
      { 
        status: 503, // 503 Service Unavailable
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  }
}
