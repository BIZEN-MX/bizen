import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.topic.update({
    where: { id: "tema-02" },
    data: { title: "Finanzas personales" }
  })
  
  await prisma.topic.update({
    where: { id: "tema-03" },
    data: { title: "Finanzas Bursátiles" }
  })

  await prisma.topic.update({
    where: { id: "tema-04" },
    data: { title: "Finanzas para mi negocio" }
  })
  
  console.log("Topics updated successfully in the database!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
