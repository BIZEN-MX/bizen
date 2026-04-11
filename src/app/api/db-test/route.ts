import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('[DB Test] Checking connection...')
    // Try a simple query
    const count = await prisma.profile.count()
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection is healthy!',
      profileCount: count,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('[DB Test] Connection failed:', error.message)
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message,
      code: error.code || 'UNKNOWN',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
