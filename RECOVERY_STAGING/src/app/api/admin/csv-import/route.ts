
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function importFromCsv() {
  const seedDir = path.join(process.cwd(), 'seed')
  const stats = {
    topics: 0,
    courses: 0,
    symbols: 0,
    sections: 0,
    lessons: 0,
    errors: [] as string[]
  }
  
  try {
    // 1. Import Topics
    const topicsFile = path.join(seedDir, 'topics_rows.csv')
    if (fs.existsSync(topicsFile)) {
      const topics = parse(fs.readFileSync(topicsFile, 'utf-8'), { columns: true, skip_empty_lines: true })
      for (const t of topics) {
        try {
          await prisma.topic.upsert({
            where: { id: t.id },
            update: { title: t.title, description: t.description, iconName: t.icon, buttonColor: t.button_color, isActive: t.is_active === 'true', sortOrder: parseInt(t.display_order || '0') },
            create: { id: t.id, slug: t.id, title: t.title, description: t.description, iconName: t.icon, buttonColor: t.button_color, isActive: t.is_active === 'true', sortOrder: parseInt(t.display_order || '0') }
          })
          stats.topics++
        } catch (e: any) { stats.errors.push(`Topic ${t.id}: ${e.message}`) }
      }
    }

    // 2. Import Courses
    const coursesFile = path.join(seedDir, 'courses_rows.csv')
    if (fs.existsSync(coursesFile)) {
      const courses = parse(fs.readFileSync(coursesFile, 'utf-8'), { columns: true, skip_empty_lines: true })
      for (const c of courses) {
        try {
          await prisma.course.upsert({
            where: { id: c.id },
            update: { topicId: c.topic_id, title: c.title, description: c.description, order: parseInt(c.order || '0'), isLocked: c.is_locked === 'true', icon: c.icon },
            create: { id: c.id, topicId: c.topic_id, title: c.title, description: c.description, order: parseInt(c.order || '0'), isLocked: c.is_locked === 'true', icon: c.icon }
          })
          stats.courses++
        } catch (e: any) { stats.errors.push(`Course ${c.id}: ${e.message}`) }
      }
    }

    // 3. Import Market Symbols
    const symbolsFile = path.join(seedDir, 'market_symbols_rows.csv')
    if (fs.existsSync(symbolsFile)) {
      const symbols = parse(fs.readFileSync(symbolsFile, 'utf-8'), { columns: true, skip_empty_lines: true })
      for (const s of symbols) {
        try {
          await prisma.market_symbols.upsert({
            where: { symbol: s.symbol },
            update: { name: s.name || s.symbol, type: s.type || 'STOCK', is_active: s.is_active === 'true' },
            create: { symbol: s.symbol, name: s.name || s.symbol, type: s.type || 'STOCK', is_active: s.is_active === 'true' }
          })
          stats.symbols++
        } catch (e: any) { stats.errors.push(`Symbol ${s.symbol}: ${e.message}`) }
      }
    }

    // 4. Import Sections
    const sectionsFile = path.join(seedDir, 'sections_rows.csv')
    if (fs.existsSync(sectionsFile)) {
      const sections = parse(fs.readFileSync(sectionsFile, 'utf-8'), { columns: true, skip_empty_lines: true })
      for (const s of sections) {
        try {
          await prisma.section.upsert({
            where: { id: s.id },
            update: { title: s.title, order: parseInt(s.order || '0'), courseId: s.course_id },
            create: { id: s.id, title: s.title, order: parseInt(s.order || '0'), courseId: s.course_id }
          })
          stats.sections++
        } catch (e: any) { stats.errors.push(`Section ${s.id}: ${e.message}`) }
      }
    }

    // 5. Import Lessons
    const lessonsFile = path.join(seedDir, 'lessons_rows.csv')
    if (fs.existsSync(lessonsFile)) {
      const lessons = parse(fs.readFileSync(lessonsFile, 'utf-8'), { columns: true, skip_empty_lines: true })
      for (const l of lessons) {
        try {
          // Verify section exists if provided
          let sId = l.section_id || null
          if (sId) {
             const exists = await prisma.section.findUnique({ where: { id: sId }})
             if (!exists) sId = null // Detach if section missing to prevent FK error
          }

          await prisma.lesson.upsert({
            where: { id: l.id },
            update: { title: l.title, courseId: l.course_id, sectionId: sId, order: parseInt(l.order || '0'), contentType: l.content_type || 'lesson', xpReward: parseInt(l.xp_reward || '50'), duration: parseInt(l.duration || '5') },
            create: { id: l.id, title: l.title, courseId: l.course_id, sectionId: sId, order: parseInt(l.order || '0'), contentType: l.content_type || 'lesson', xpReward: parseInt(l.xp_reward || '50'), duration: parseInt(l.duration || '5') }
          })
          stats.lessons++
        } catch (e: any) { stats.errors.push(`Lesson ${l.id}: ${e.message}`) }
      }
    }

    return stats
  } catch (err: any) {
    console.error("❌ Fatal Import Error:", err)
    throw err
  }
}

export async function GET() {
  try {
    const stats = await importFromCsv()
    return NextResponse.json({ success: true, stats })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
