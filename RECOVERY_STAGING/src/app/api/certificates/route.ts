import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerMicrocred } from '@/lib/supabase/server-microcred'
import { cookies } from 'next/headers'

// GET /api/certificates - Get user's certificates
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            level: true
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    })

    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

// POST /api/certificates - Issue a certificate
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId, url } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    // Check if certificate already exists
    const existing = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Certificate already issued for this course' },
        { status: 400 }
      )
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId: user.id,
        courseId,
        url: url || null
      },
      include: {
        course: true
      }
    })

    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error('Error issuing certificate:', error)
    return NextResponse.json(
      { error: 'Failed to issue certificate' },
      { status: 500 }
    )
  }
}

