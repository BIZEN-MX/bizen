import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Probar conexión simple
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Conexión a base de datos EXITOSA',
      env: {
        has_db_url: !!process.env.DATABASE_URL,
        db_url_start: process.env.DATABASE_URL?.substring(0, 15) + '...',
      }
    });
  } catch (error: any) {
    console.error('❌ Error de Diagnóstico DB:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      stack: error.stack?.substring(0, 200),
      env: {
        has_db_url: !!process.env.DATABASE_URL,
        db_url_start: process.env.DATABASE_URL?.substring(0, 15) + '...',
      }
    }, { status: 500 });
  }
}
