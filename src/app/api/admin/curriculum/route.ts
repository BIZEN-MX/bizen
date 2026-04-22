import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

const SUPER_ADMINS = ["diego@bizen.mx"]

async function isSuperAdmin(): Promise<boolean> {
  try {
    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase()
    return !!(email && SUPER_ADMINS.includes(email))
  } catch {
    return false
  }
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

// ─── GET: Full curriculum tree ───────────────────────────────────────────────
export async function GET(request: NextRequest) {
  if (!(await isSuperAdmin())) return unauthorized()

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") // "topics" | "lesson"
  const id = searchParams.get("id")

  try {
    if (type === "topics" || !type) {
      // Return full curriculum tree: Topics → Lessons (direct relation now allowed)
      const topics = await prisma.topic.findMany({
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          title: true,
          displayOrder: true,
          description: true,
          icon: true,
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              order: true,
              contentType: true,
              xpReward: true,
              duration: true,
              _count: { select: { steps: true } }
            }
          }
        }
      })
      return NextResponse.json({ topics })
    }

    if (type === "lesson" && id) {
      // Return single lesson with all steps
      const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: {
          steps: { orderBy: { order: "asc" } },
          topic: { select: { id: true, title: true } }
        }
      })
      if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
      return NextResponse.json({ lesson })
    }

    return NextResponse.json({ error: "Invalid query" }, { status: 400 })
  } catch (error: any) {
    console.error("[Admin Curriculum GET]", error)
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}

// ─── POST: Create Topic, Lesson, or Step ─────────────────────────────
export async function POST(request: NextRequest) {
  if (!(await isSuperAdmin())) return unauthorized()

  try {
    const body = await request.json()
    const { entity } = body

    if (entity === "topic") {
      const { title, description, icon, order } = body
      const maxOrder = await prisma.topic.aggregate({ _max: { displayOrder: true } })
      const topic = await prisma.topic.create({
        data: {
          title,
          description: description || "",
          icon: icon || "BookOpen",
          level: "beginner",
          displayOrder: order ?? (maxOrder._max.displayOrder ?? 0) + 1
        }
      })
      return NextResponse.json({ topic }, { status: 201 })
    }

    if (entity === "lesson") {
      const { topicId, title, contentType, xpReward, duration, order } = body
      const maxOrder = await prisma.lesson.aggregate({ _max: { order: true }, where: { topicId } })
      const lesson = await prisma.lesson.create({
        data: {
          topicId,
          title,
          contentType: contentType || "interactive",
          xpReward: xpReward || 50,
          duration: duration || 5,
          order: order ?? (maxOrder._max.order ?? 0) + 1
        }
      })
      return NextResponse.json({ lesson }, { status: 201 })
    }

    if (entity === "step") {
      const { lessonId, type, title, body: stepBody, data, xpReward, order } = body
      const maxOrder = await prisma.lessonStep.aggregate({ _max: { order: true }, where: { lessonId } })
      const step = await prisma.lessonStep.create({
        data: {
          lessonId,
          type,
          title: title || null,
          body: stepBody || null,
          data: data || {},
          xpReward: xpReward || 10,
          order: order ?? (maxOrder._max.order ?? 0) + 1
        }
      })
      return NextResponse.json({ step }, { status: 201 })
    }

    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 })
  } catch (error: any) {
    console.error("[Admin Curriculum POST]", error)
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}

// ─── PATCH: Update Topic, Lesson, or Step ────────────────────────────
export async function PATCH(request: NextRequest) {
  if (!(await isSuperAdmin())) return unauthorized()

  try {
    const body = await request.json()
    const { entity, id } = body

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    if (entity === "topic") {
      const { title, description, icon, order } = body
      const topic = await prisma.topic.update({
        where: { id },
        data: { ...(title !== undefined && { title }), ...(description !== undefined && { description }), ...(icon !== undefined && { icon }), ...(order !== undefined && { displayOrder: order }) }
      })
      return NextResponse.json({ topic })
    }

    if (entity === "lesson") {
      const { title, contentType, xpReward, duration, order } = body
      const lesson = await prisma.lesson.update({
        where: { id },
        data: { ...(title !== undefined && { title }), ...(contentType !== undefined && { contentType }), ...(xpReward !== undefined && { xpReward }), ...(duration !== undefined && { duration }), ...(order !== undefined && { order }) }
      })
      return NextResponse.json({ lesson })
    }

    if (entity === "step") {
      const { type, title, body: stepBody, data, xpReward, order } = body
      const step = await prisma.lessonStep.update({
        where: { id },
        data: { ...(type !== undefined && { type }), ...(title !== undefined && { title }), ...(stepBody !== undefined && { body: stepBody }), ...(data !== undefined && { data }), ...(xpReward !== undefined && { xpReward }), ...(order !== undefined && { order }) }
      })
      return NextResponse.json({ step })
    }

    return NextResponse.json({ error: "Invalid entity" }, { status: 400 })
  } catch (error: any) {
    console.error("[Admin Curriculum PATCH]", error)
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}

// ─── DELETE: Remove Topic, Lesson, or Step ───────────────────────────
export async function DELETE(request: NextRequest) {
  if (!(await isSuperAdmin())) return unauthorized()

  try {
    const { searchParams } = new URL(request.url)
    const entity = searchParams.get("entity")
    const id = searchParams.get("id")

    if (!id || !entity) return NextResponse.json({ error: "entity and id are required" }, { status: 400 })

    if (entity === "topic") await prisma.topic.delete({ where: { id } })
    else if (entity === "lesson") await prisma.lesson.delete({ where: { id } })
    else if (entity === "step") await prisma.lessonStep.delete({ where: { id } })
    else return NextResponse.json({ error: "Invalid entity" }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[Admin Curriculum DELETE]", error)
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}
