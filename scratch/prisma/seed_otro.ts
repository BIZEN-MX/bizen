import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const topic = { name: "Otro", slug: "otro", description: "Cualquier otro tema financiero que no encaje en las categorías anteriores.", icon: "more-horizontal", orderIndex: 100 }

  console.log('Inserting "Otro" forum topic...')
  
  const created = await prisma.forumTopic.upsert({
    where: { slug: topic.slug },
    update: topic,
    create: topic,
  })
  console.log(`- ${created.name} (${created.slug})`)

  console.log('Done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
