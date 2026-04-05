import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] })
    }

    try {
        const [topics, courses, lessons, news, threads] = await Promise.all([
            prisma.topic.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ],
                    isActive: true
                },
                take: 5
            }),
            prisma.course.findMany({
                where: {
                    title: { contains: query, mode: 'insensitive' }
                },
                include: { topic: true },
                take: 5
            }),
            prisma.lesson.findMany({
                where: {
                    title: { contains: query, mode: 'insensitive' }
                },
                include: { course: { include: { topic: true } } },
                take: 5
            }),
            prisma.$queryRawUnsafe(`
                SELECT id, title, 'news' as type, CONCAT('/news/', id) as url 
                FROM "public"."news" 
                WHERE "title" ILIKE $1 OR "excerpt" ILIKE $1
                LIMIT 5
            `, `%${query}%`).catch(() => []),
            prisma.forumThread.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { body: { contains: query, mode: 'insensitive' } }
                    ],
                    moderationStatus: 'approved'
                },
                take: 5
            })
        ])

        // Standardize results
        const results = [
            ...(topics as any[]).map(t => ({
                id: t.id,
                title: t.title,
                type: 'topic',
                url: `/courses/${t.id}`
            })),
            ...(courses as any[]).map(c => ({
                id: c.id,
                title: c.title,
                type: 'course',
                url: `/courses/${c.topicId}`
            })),
            ...(lessons as any[]).map(l => ({
                id: l.id,
                title: l.title,
                type: 'lesson',
                url: `/learn/${l.course?.topicId}/${l.courseId}/${l.id}`
            })),
            ...(news as any[]).map(n => ({
                id: n.id,
                title: n.title,
                type: n.type || 'news',
                url: n.url || `/news/${n.id}`
            })),
            ...(threads as any[]).map(th => ({
                id: th.id,
                title: th.title,
                type: 'forum',
                url: `/comunidad/post/${th.id}`
            }))
        ]

        return NextResponse.json({ results })
    } catch (error) {
        console.error("Search API Error:", error)
        return NextResponse.json({ error: "Failed to search" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
