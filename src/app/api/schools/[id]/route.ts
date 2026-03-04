import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/schools/[id] - Get school by ID with stats
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const school = await prisma.school.findUnique({
      where: { id: params.id },
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

    if (!school) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    // Compute stats
    const students = school.profiles.filter(p => p.role === 'student')
    const studentCount = students.length
    const totalXp = students.reduce((sum, s) => sum + s.xp, 0)
    const xpPerCapita = studentCount > 0 ? Math.round(totalXp / studentCount) : 0
    const avgLevel = studentCount > 0
      ? Math.round(students.reduce((sum, s) => sum + s.level, 0) / studentCount)
      : 0

    // XP distribution buckets
    const xpBuckets = { 'Inicio (0-100)': 0, 'Activo (100-500)': 0, 'Avanzado (500-1000)': 0, 'Elite (1000+)': 0 }
    students.forEach(s => {
      if (s.xp < 100) xpBuckets['Inicio (0-100)']++
      else if (s.xp < 500) xpBuckets['Activo (100-500)']++
      else if (s.xp < 1000) xpBuckets['Avanzado (500-1000)']++
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
  } catch (error) {
    console.error('Error fetching school:', error)
    return NextResponse.json(
      { error: 'Failed to fetch school' },
      { status: 500 }
    )
  }
}

// PATCH /api/schools/[id] - Update school
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, region, contactEmail } = body

    const school = await prisma.school.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(region !== undefined && { region }),
        ...(contactEmail && { contactEmail })
      }
    })

    return NextResponse.json(school)
  } catch (error) {
    console.error('Error updating school:', error)
    return NextResponse.json(
      { error: 'Failed to update school' },
      { status: 500 }
    )
  }
}

// DELETE /api/schools/[id] - Delete school
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.school.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'School deleted successfully' })
  } catch (error) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    )
  }
}
