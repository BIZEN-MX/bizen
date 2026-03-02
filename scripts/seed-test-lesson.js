const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- 🌱 Creando lección de prueba ---')

    // 1. Encontrar o crear un curso y unidad base
    let course = await prisma.course.findFirst()
    if (!course) {
        course = await prisma.course.create({
            data: {
                title: 'Curso de Prueba',
                level: 'Básico',
                description: 'Un curso para probar el nuevo motor de lecciones'
            }
        })
    }

    let unit = await prisma.unit.findFirst({ where: { courseId: course.id } })
    if (!unit) {
        unit = await prisma.unit.create({
            data: {
                title: 'Unidad 1: Fundamentos',
                order: 1,
                courseId: course.id
            }
        })
    }

    // 2. Crear la lección
    const lesson = await prisma.lesson.create({
        data: {
            title: 'Tu Primera Lección Dinámica',
            unit_id: unit.id,
            order: 1,
            contentType: 'interactive',
            xpReward: 50,
            steps: {
                create: [
                    {
                        order: 1,
                        type: 'info',
                        title: '¡Bienvenido al Nuevo BIZEN!',
                        body: 'Esta lección se carga dinámicamente desde la base de datos. ¡UI Premium garantizada!',
                        data: {
                            imageUrl: '/billy-mascot-leccion1.png'
                        }
                    },
                    {
                        order: 2,
                        type: 'mcq',
                        title: 'Desafío de Conocimiento',
                        body: '¿Cuál es la principal ventaja de las lecciones dinámicas?',
                        data: {
                            question: '¿Cuál es la principal ventaja de las lecciones dinámicas?',
                            options: [
                                { id: '1', label: 'Escalabilidad infinita', isCorrect: true, explanation: 'Exacto, puedes añadir miles de lecciones sin tocar el código.' },
                                { id: '2', label: 'Son más pesadas', isCorrect: false },
                                { id: '3', label: 'No tienen animaciones', isCorrect: false }
                            ]
                        }
                    },
                    {
                        order: 3,
                        type: 'summary',
                        title: '¡Lección de Prueba Superada!',
                        body: 'Acabas de completar la primera lección cargada 100% desde la base de datos.',
                        data: {
                            imageUrl: '/Lección completada.png'
                        }
                    }
                ]
            }
        }
    })

    console.log(`✅ Lección creada con ID: ${lesson.id}`)
    console.log(`🔗 Puedes verla en: /learn/${course.id}/${unit.id}/${lesson.id}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
