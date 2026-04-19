
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Faltan credenciales de Supabase en .env" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const results: any = { topics: 0, courses: 0, lessons: 0, errors: [] }

    console.log("[migrate] Iniciando rescate desde Supabase...")

    // 1. Rescatar TOPICS
    const { data: topics, error: topicsError } = await supabase.from('topics').select('*')
    if (topicsError) throw topicsError

    for (const topic of topics) {
      try {
        await prisma.topic.upsert({
          where: { id: topic.id },
          update: {
            slug: topic.slug,
            title: topic.title,
            description: topic.description,
            iconName: topic.icon_name,
            buttonColor: topic.button_color,
            isActive: topic.is_active,
            sortOrder: topic.sort_order
          },
          create: {
            id: topic.id,
            slug: topic.slug,
            title: topic.title,
            description: topic.description,
            iconName: topic.icon_name,
            buttonColor: topic.button_color,
            isActive: topic.is_active || true,
            sortOrder: topic.sort_order || 0
          }
        })
        results.topics++
      } catch (e: any) {
        results.errors.push(`Topic ${topic.id}: ${e.message}`)
      }
    }

    // 2. Rescatar COURSES (Units)
    const { data: courses, error: coursesError } = await supabase.from('courses').select('*')
    if (coursesError) throw coursesError

    for (const course of courses) {
      try {
        await prisma.course.upsert({
          where: { id: course.id },
          update: {
            topicId: course.topic_id,
            title: course.title,
            description: course.description,
            order: course.order,
            isLocked: course.is_locked,
            icon: course.icon
          },
          create: {
            id: course.id,
            topicId: course.topic_id,
            title: course.title,
            description: course.description,
            order: course.order || 0,
            isLocked: course.is_locked || false,
            icon: course.icon
          }
        })
        results.courses++
      } catch (e: any) {
        results.errors.push(`Course ${course.id}: ${e.message}`)
      }
    }

    // 3. Rescatar LESSONS
    const { data: lessons, error: lessonsError } = await supabase.from('lessons').select('*')
    if (lessonsError) throw lessonsError

    for (const lesson of lessons) {
      try {
        await prisma.lesson.upsert({
          where: { id: lesson.id },
          update: {
            courseId: lesson.course_id,
            title: lesson.title,
            content: lesson.content,
            type: lesson.type,
            order: lesson.order,
            xpReward: lesson.xp_reward,
            videoUrl: lesson.video_url,
            isFree: lesson.is_free,
            duration: lesson.duration
          },
          create: {
            id: lesson.id,
            courseId: lesson.course_id,
            title: lesson.title,
            content: lesson.content,
            type: lesson.type || 'text',
            order: lesson.order || 0,
            xpReward: lesson.xp_reward || 10,
            videoUrl: lesson.video_url,
            isFree: lesson.is_free || false,
            duration: lesson.duration
          }
        })
        results.lessons++
      } catch (e: any) {
        results.errors.push(`Lesson ${lesson.id}: ${e.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Rescate de datos completado con éxito",
      results
    })

  } catch (error: any) {
    console.error("❌ Error en migración:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
