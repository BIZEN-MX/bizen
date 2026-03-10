const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration...');

    const topicsMeta = [
        { title: "Mi relación con el dinero", category: "Fundamentos", level: "Fundamentos", icon: "Wallet" },
        { title: "¿Qué es el dinero y por qué existe?", category: "Fundamentos", level: "Fundamentos", icon: "Coins" },
        { title: "¿Cómo entra y sale el dinero de mi vida?", category: "Fundamentos", level: "Fundamentos", icon: "RefreshCw" },
        { title: "Presupuesto: tomar control sin ahogarme", category: "Presupuesto", level: "Presupuesto", icon: "Receipt" },
        { title: "Ahorro con propósito", category: "Ahorro", level: "Ahorro", icon: "PiggyBank" },
        { title: "¿Deuda: cuándo ayuda y cuándo destruye?", category: "Deuda", level: "Deuda", icon: "CreditCard" },
        { title: "Sistema financiero explicado fácil", category: "Fundamentos", level: "Fundamentos", icon: "Landmark" },
        { title: "Impuestos en la vida real", category: "Impuestos", level: "Impuestos", icon: "FileText" },
        { title: "Inflación y poder adquisitivo", category: "Economía", level: "Economía", icon: "TrendingUp" },
        { title: "Introducción a la inversión", category: "Inversión", level: "Inversión", icon: "Presentation" },
        { title: "Instrumentos de inversión básicos", category: "Inversión", level: "Inversión", icon: "BarChart4" },
        { title: "Psicología del inversionista", category: "Inversión", level: "Inversión", icon: "Brain" },
        { title: "Construcción de patrimonio", category: "Patrimonio", level: "Patrimonio", icon: "ShieldCheck" },
        { title: "Errores financieros comunes", category: "Errores", level: "Errores", icon: "AlertTriangle" },
        { title: "Decisiones financieras conscientes", category: "Mentalidad", level: "Mentalidad", icon: "Lightbulb" },
        { title: "Mentalidad emprendedora", category: "Emprender", level: "Emprender", icon: "Rocket" },
        { title: "Oportunidades de negocio", category: "Emprender", level: "Emprender", icon: "Search" },
        { title: "Validar ideas rápido", category: "Emprender", level: "Emprender", icon: "Zap" },
        { title: "Modelo de negocio simple", category: "Negocios", level: "Negocios", icon: "Layout" },
        { title: "Ingresos, costos y utilidad", category: "Negocios", level: "Negocios", icon: "Calculator" },
        { title: "Flujo de efectivo", category: "Negocios", level: "Negocios", icon: "LineChart" },
        { title: "Precios y valor", category: "Negocios", level: "Negocios", icon: "BadgeDollarSign" },
        { title: "Contabilidad básica", category: "Negocios", level: "Negocios", icon: "BookOpen" },
        { title: "Errores comunes al emprender", category: "Errores", level: "Errores", icon: "Skull" },
        { title: "Escalar un negocio", category: "Negocios", level: "Negocios", icon: "TrendingUp" },
        { title: "Dinero y estilo de vida", category: "Bienestar", level: "Bienestar", icon: "Smile" },
        { title: "Dinero y decisiones importantes", category: "Bienestar", level: "Bienestar", icon: "Heart" },
        { title: "Dinero en crisis", category: "Resiliencia", level: "Resiliencia", icon: "ShieldAlert" },
        { title: "Estrés y bienestar financiero", category: "Bienestar", level: "Bienestar", icon: "Coffee" },
        { title: "Mi vida financiera a futuro", category: "Futuro", level: "Futuro", icon: "Target" },
    ];

    for (let i = 0; i < topicsMeta.length; i++) {
        const topicIdx = i + 1;
        const meta = topicsMeta[i];
        const topicId = `tema-${topicIdx.toString().padStart(2, '0')}`;

        console.log(`Processing Topic ${topicIdx}: ${meta.title}`);

        await prisma.topic.upsert({
            where: { id: topicId },
            update: { title: meta.title, level: meta.level, icon: meta.icon },
            create: { id: topicId, title: meta.title, level: meta.level, icon: meta.icon }
        });

        const dataFilePath = path.join(process.cwd(), 'src', 'app', 'courses', `tema${topicIdx}-data.ts`);
        if (fs.existsSync(dataFilePath)) {
            const content = fs.readFileSync(dataFilePath, 'utf-8');

            const parts = content.split(/TEMA\d+_SUBTEMAS[^=]*=/);
            if (parts.length > 1) {
                const jsonStr = parts[1].trim();

                const subthemeRegex = /\{\s*title:\s*"([^"]*)"[\s\S]*?lessons:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
                let sIdx = 0;
                let subthemeMatch;
                while ((subthemeMatch = subthemeRegex.exec(jsonStr)) !== null) {
                    const subTitle = subthemeMatch[1];
                    const lessonsStr = subthemeMatch[2];
                    const courseId = `tema-${topicIdx.toString().padStart(2, '0')}-course-${sIdx + 1}`;

                    await prisma.course.upsert({
                        where: { id: courseId },
                        update: { title: subTitle, order: sIdx + 1 },
                        create: { id: courseId, topicId, title: subTitle, order: sIdx + 1 }
                    });

                    const lessonRegex = /\{\s*title:\s*"([^"]*)"[\s\S]*?slug:\s*"([^"]*)"/g;
                    let lIdx = 0;
                    let lessonMatch;
                    while ((lessonMatch = lessonRegex.exec(lessonsStr)) !== null) {
                        const lTitle = lessonMatch[1];
                        const lSlug = lessonMatch[2];

                        await prisma.lesson.upsert({
                            where: { id: lSlug },
                            update: { title: lTitle, order: lIdx + 1, courseId },
                            create: { id: lSlug, courseId, title: lTitle, order: lIdx + 1, contentType: 'interactive' }
                        });
                        lIdx++;
                    }
                    sIdx++;
                }
            }
        }
    }

    console.log('Migration complete!');
    process.exit(0);
}

main().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
