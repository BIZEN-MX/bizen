
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Iniciando semillero del foro...");

    // 1. Crear Categorías (ForumTopic)
    const categories = [
      {
        name: "Ahorro e Inversión",
        slug: "ahorro-e-inversion",
        description: "Domina el arte de poner a trabajar tu dinero.",
        icon: "💰",
        orderIndex: 1,
      },
      {
        name: "Emprendimiento",
        slug: "emprendimiento",
        description: "De la idea a la realidad: crea y escala tu negocio.",
        icon: "🚀",
        orderIndex: 2,
      },
      {
        name: "Cripto y Web3",
        slug: "cripto-y-web3",
        description: "Explora el futuro de las finanzas descentralizadas.",
        icon: "🔗",
        orderIndex: 3,
      },
      {
        name: "Comunidad BIZEN",
        slug: "comunidad-bizen",
        description: "Habla sobre la plataforma, sugerencias y networking.",
        icon: "🤝",
        orderIndex: 4,
      },
    ];

    for (const cat of categories) {
      await prisma.forumTopic.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
    }

    // 2. Crear Tags (ForumTag)
    const tags = [
      { name: "Principiante", slug: "principiante" },
      { name: "Estrategia", slug: "estrategia" },
      { name: "Noticias", slug: "noticias" },
      { name: "Duda", slug: "duda" },
      { name: "Exito", slug: "exito" },
    ];

    for (const tag of tags) {
      await prisma.forumTag.upsert({
        where: { slug: tag.slug },
        update: tag,
        create: tag,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Foro alimentado con éxito",
      categoriesCount: categories.length,
      tagsCount: tags.length
    });
  } catch (error: any) {
    console.error("Error al alimentar el foro:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
