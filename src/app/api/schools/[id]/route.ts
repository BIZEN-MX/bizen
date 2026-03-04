import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/schools/[id] - Get school by ID with stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Missing school ID" }, { status: 400 })
    }

    // Try to fetch school with all relations, but be prepared for failures
    let school: any = null;
    try {
      school = await prisma.school.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          region: true,
          contactEmail: true,
          licenses: true,
          schoolTopics: {
            include: {
              topic: {
                select: { id: true, title: true, level: true }
              }
            }
          },
          profiles: {
            select: {
              userId: true,
              fullName: true,
              nickname: true,
              role: true,
              xp: true,
              level: true,
              avatar: true,
              currentStreak: true,
              createdAt: true,
            },
            orderBy: { xp: 'desc' },
          },
          _count: {
            select: {
              profiles: true,
              schoolTopics: true,
            }
          }
        }
      })
    } catch (dbErr: any) {
      console.error(`DB Error fetching school ${id}:`, dbErr.message)
      // Try a simpler fetch as fallback
      school = await prisma.school.findUnique({ where: { id } }).catch(() => null)
    }

    if (!school) {
      // Log the search attempt to help debug
      console.warn(`[api/schools] School with ID ${id} not found in database.`)
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    // Safely compute stats even if sub-arrays are missing
    const profiles = school.profiles || []
    const students = profiles.filter((p: any) => p.role === 'student')
    const studentCount = students.length
    const totalXp = students.reduce((sum: number, s: any) => sum + (s.xp || 0), 0)
    const xpPerCapita = studentCount > 0 ? Math.round(totalXp / studentCount) : 0
    const avgLevel = studentCount > 0
      ? Math.round(students.reduce((sum: number, s: any) => sum + (s.level || 0), 0) / studentCount)
      : 0

    // XP distribution buckets
    const xpBuckets = { 'Inicio (0-100)': 0, 'Activo (100-500)': 0, 'Avanzado (500-1000)': 0, 'Elite (1000+)': 0 }
    students.forEach((s: any) => {
      const xpValue = s.xp || 0
      if (xpValue < 100) xpBuckets['Inicio (0-100)']++
      else if (xpValue < 500) xpBuckets['Activo (100-500)']++
      else if (xpValue < 1000) xpBuckets['Avanzado (500-1000)']++
      else xpBuckets['Elite (1000+)']++
    })

    return NextResponse.json({
      ...school,
      studentCount,
      totalXp,
      xpPerCapita,
      avgLevel,
      topStudents: students.slice(0, 10),
      xpBuckets,
    })
  } catch (error: any) {
    console.error('FATAL Error fetching school:', error)
    return NextResponse.json(
      { error: 'Failed to fetch school', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/schools/[id] - Update school
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, region, contactEmail } = body

    const school = await prisma.school.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(region !== undefined && { region }),
        ...(contactEmail && { contactEmail })
      }
    })

    return NextResponse.json(school)
  } catch (error: any) {
    console.error('Error updating school:', error)
    return NextResponse.json(
      { error: 'Failed to update school', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/schools/[id] - Delete school
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.school.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'School deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { error: 'Failed to delete school', details: error.message },
      { status: 500 }
    )
  }
}
