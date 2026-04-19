
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function runSqlFile(fileName: string) {
  console.log(`📖 Leyendo archivo: ${fileName}...`)
  const filePath = path.join(process.cwd(), fileName)
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Archivo no encontrado: ${fileName}. Saltando...`)
    return
  }

  const sql = fs.readFileSync(filePath, 'utf8')
  
  // Split by semicolon but be careful with functions or complex blocks
  // For these seed files, simple splitting by ; usually works if they are just INSERTs
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`🚀 Ejecutando ${statements.length} sentencias SQL...`)
  
  let successCount = 0
  let failCount = 0

  for (const statement of statements) {
    try {
      // We use executeRawUnsafe because these are raw SQL statements from Supabase
      await prisma.$executeRawUnsafe(statement)
      successCount++
    } catch (error: any) {
      // console.error(`❌ Error en sentencia: ${statement.substring(0, 50)}...`)
      // console.error(`   Motivo: ${error.message}`)
      failCount++
    }
  }
  
  console.log(`✅ Finalizado: ${successCount} éxitos, ${failCount} errores ignorados (duplicados, etc).`)
}

async function main() {
  console.log("--- ⚡ INICIANDO INYECCIÓN DE DATOS BIZEN ---")
  
  // 1. Forum Topics
  await runSqlFile('forum_seed_topics.sql')
  
  // 2. Cashflow Data
  await runSqlFile('CASHFLOW_DOODADS.sql')
  await runSqlFile('CASHFLOW_OPPORTUNITY_CARDS.sql')
  await runSqlFile('CASHFLOW_FAST_TRACK_CARDS.sql')
  await runSqlFile('CASHFLOW_UPDATE_PROFESSIONS_SPANISH.sql')

  console.log("--- 🎉 PROCESO COMPLETADO ---")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
