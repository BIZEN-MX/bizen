import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting sample seed...')

    // 1. Create a Default School
    const school = await prisma.school.upsert({
        where: { id: 'default-school-id' },
        update: {},
        create: {
            id: 'default-school-id',
            name: 'Bizen Academy',
            region: 'México',
            contactEmail: 'admin@bizen.mx',
        },
    })
    console.log('✅ School created:', school.name)

    // 2. Create a License for the School
    const license = await prisma.license.create({
        data: {
            schoolId: school.id,
            plan: 'annual',
            seats: 100,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
    })
    console.log('✅ License created for:', school.name)

    // 3. Create a Sample Course
    const course = await prisma.course.create({
        data: {
            title: 'Marketing de Influencia 101',
            description: 'Aprende las bases del marketing de influencia y cómo crear tu marca personal.',
            level: 'Beginner',
            isActive: true,
        },
    })
    console.log('✅ Course created:', course.title)

    // 4. Link Course to School
    await prisma.schoolCourse.upsert({
        where: {
            schoolId_courseId: {
                schoolId: school.id,
                courseId: course.id
            }
        },
        update: {},
        create: {
            schoolId: school.id,
            courseId: course.id,
            isEnabled: true
        }
    })
    console.log('✅ Course linked to school')

    // 5. Create Units and Lessons
    const unitsData = [
        {
            title: 'Módulo 1: Identidad Digital',
            order: 1,
            lessons: [
                { title: 'Introducción a la Marca Personal', contentType: 'reading', order: 1 },
                { title: 'Definiendo tu Nicho', contentType: 'video', order: 2 },
            ]
        },
        {
            title: 'Módulo 2: Creación de Contenido',
            order: 2,
            lessons: [
                { title: 'Storytelling para Redes Sociales', contentType: 'reading', order: 1 },
                { title: 'Edición Básica de Video', contentType: 'video', order: 2 },
            ]
        }
    ]

    for (const unitData of unitsData) {
        const unit = await prisma.unit.create({
            data: {
                courseId: course.id,
                title: unitData.title,
                order: unitData.order,
            }
        })
        console.log(`  📦 Unit created: ${unit.title}`)

        for (const lessonData of unitData.lessons) {
            const lesson = await prisma.lesson.create({
                data: {
                    unitId: unit.id,
                    title: lessonData.title,
                    contentType: lessonData.contentType,
                    order: lessonData.order,
                    xpReward: 50,
                }
            })
            console.log(`    📖 Lesson created: ${lesson.title}`)

            // Create a simple Quiz for each lesson
            const quiz = await prisma.quiz.create({
                data: {
                    lessonId: lesson.id,
                    title: `Quiz: ${lesson.title}`,
                    passScore: 70,
                    totalPoints: 10,
                }
            })

            // Add one simple question to the quiz
            await prisma.question.create({
                data: {
                    quizId: quiz.id,
                    type: 'mcq',
                    prompt: `¿Cuál es el objetivo principal de ${lesson.title}?`,
                    order: 1,
                    options: {
                        create: [
                            { text: 'Aprender y aplicar conocimientos', isCorrect: true },
                            { text: 'Solo mirar el video', isCorrect: false },
                            { text: 'Ninguno de los anteriores', isCorrect: false },
                        ]
                    }
                }
            })
        }
    }

    console.log('✨ Seed finished successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
