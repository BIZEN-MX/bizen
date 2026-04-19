const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const prisma = new PrismaClient()

async function main() {
    console.log('--- 🚀 Desplegando Tablas de Contenido Dinámico ---')

    const sqlPath = path.join(__dirname, '../migrations/add_dynamic_content_tables.sql')

    if (!fs.existsSync(sqlPath)) {
        console.error('❌ Error: El archivo de migración no existe en ' + sqlPath)
        process.exit(1)
    }

    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Separar comandos por punto y coma y filtrar comentarios/vacíos
    const commands = sql
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

    console.log(`Ejecutando ${commands.length} comandos SQL...`)

    for (let cmd of commands) {
        try {
            await prisma.$executeRawUnsafe(cmd)
            console.log('✅ Comando ejecutado con éxito.')
        } catch (err) {
            if (err.message.includes('already exists')) {
                console.log('ℹ️ Omitiendo (ya existe): ' + cmd.substring(0, 50) + '...')
            } else {
                console.error('❌ Error ejecutando comando: ' + cmd)
                console.error(err.message)
            }
        }
    }

    console.log('--- 🎉 Despliegue completado ---')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
