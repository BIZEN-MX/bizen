import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST() {
  try {
    const topics = [
      { id: 'topic-ideas', name: 'Ideas de Negocio', slug: 'ideas-negocio', description: 'Comparte y discute nuevas ideas de emprendimiento', icon: '💡', orderIndex: 1 },
      { id: 'topic-marketing', name: 'Marketing', slug: 'marketing', description: 'Estrategias de marketing y promoción', icon: '📣', orderIndex: 2 },
      { id: 'topic-finance', name: 'Finanzas', slug: 'finanzas', description: 'Gestión financiera y contabilidad', icon: '💰', orderIndex: 3 },
      { id: 'topic-tech', name: 'Tecnología', slug: 'tecnologia', description: 'Herramientas y soluciones tecnológicas', icon: '💻', orderIndex: 4 },
      { id: 'topic-legal', name: 'Legal', slug: 'legal', description: 'Aspectos legales y regulatorios', icon: '⚖️', orderIndex: 5 },
      { id: 'topic-help', name: 'Ayuda', slug: 'ayuda', description: 'Preguntas generales y solicitudes de ayuda', icon: '❓', orderIndex: 6 },
      { id: 'topic-showcase', name: 'Proyectos', slug: 'proyectos', description: 'Muestra tu proyecto y recibe feedback', icon: '🚀', orderIndex: 7 },
      { id: 'topic-general', name: 'General', slug: 'general', description: 'Discusiones generales sobre emprendimiento', icon: '💬', orderIndex: 8 }
    ]

    let created = 0
    let existing = 0

    for (const topic of topics) {
      const exists = await prisma.forumTopic.findUnique({
        where: { slug: topic.slug }
      })

      if (!exists) {
        await prisma.forumTopic.create({ data: topic })
        created++
        console.log(`✅ Created topic: ${topic.name}`)
      } else {
        existing++
      }
    }

    return NextResponse.json({
      success: true,
      created,
      existing,
      message: `Seeded ${created} topics, ${existing} already existed`
    })
  } catch (error) {
    console.error("Error seeding topics:", error)
    return NextResponse.json({ error: "Failed to seed topics" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

