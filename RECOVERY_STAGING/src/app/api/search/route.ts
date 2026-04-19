import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
            prisma.newsItem.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { excerpt: { contains: query, mode: 'insensitive' } }
                    ],
                },
                take: 5
            }).catch(() => []),
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
        console.error("❌ [Search:API_FAIL]:", error)
        return NextResponse.json({ 
            error: "La búsqueda ha fallado temporalmente. Intenta de nuevo." 
        }, { status: 500 })
    }
}
