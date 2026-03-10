const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    const lessonFiles = [
        'lesson-que-es-el-dinero-para-mi.ts',
        'lesson-como-me-hace-sentir-el-dinero.ts',
        'lesson-dinero-y-autoestima.ts',
        'lesson-mis-primeras-creencias-sobre-el-dinero.ts',
        'lesson-expectativas-vs-realidad-financiera.ts',
        'lesson-paciencia-financiera-y-mentalidad-a-largo-plazo.ts'
    ];

    const slugs = [
        'que-es-el-dinero-para-mi-hoy',
        'como-me-hace-sentir-el-dinero',
        'dinero-y-autoestima',
        'mis-primeras-creencias-sobre-el-dinero',
        'expectativas-vs-realidad-financiera',
        'paciencia-financiera-y-mentalidad-a-largo-plazo'
    ];

    console.log('Migrating lesson content...');

    for (let i = 0; i < lessonFiles.length; i++) {
        const fileName = lessonFiles[i];
        const slug = slugs[i];
        const filePath = path.join(process.cwd(), 'src', 'data', 'lessons', fileName);

        if (fs.existsSync(filePath)) {
            console.log(`Processing content for ${slug}...`);
            const content = fs.readFileSync(filePath, 'utf-8');

            // Clean up the TS to be valid JS we can eval or parse
            // We need everything inside the [ ... ]
            const arrayMatch = content.match(/=\s*\[([\s\S]*)\]\s*$/);
            if (arrayMatch) {
                try {
                    // Rough parsing: We'll split by { ... } objects
                    // This is fragile but might work for our structure.
                    let arrayStr = arrayMatch[1].trim();
                    // Use Function to safely(?) eval the array
                    const stepsArray = new Function(`return [${arrayStr}]`)();

                    // Clear old steps for this lesson
                    await prisma.lessonStep.deleteMany({ where: { lessonId: slug } });

                    // Create new steps
                    for (let j = 0; j < stepsArray.length; j++) {
                        const step = stepsArray[j];
                        await prisma.lessonStep.create({
                            data: {
                                lessonId: slug,
                                order: j + 1,
                                type: step.stepType || 'info',
                                title: step.title || null,
                                body: step.body || null,
                                data: step, // Save whole step as data backup
                                xpReward: step.xpReward || 10
                            }
                        });
                    }
                } catch (e) {
                    console.error(`Failed to parse ${fileName}:`, e.message);
                }
            }
        }
    }

    console.log('Lesson content migration complete!');
    process.exit(0);
}

main().catch(err => {
    console.error('Lesson migration failed:', err);
    process.exit(1);
});
