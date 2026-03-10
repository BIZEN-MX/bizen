const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LESSON_ID = 'como-me-hace-sentir-el-dinero';

async function main() {
    console.log(`Populating lesson: ${LESSON_ID}`);

    // Delete existing steps
    await prisma.lessonStep.deleteMany({
        where: { lessonId: LESSON_ID }
    });

    const steps = [
        {
            order: 1,
            type: 'info',
            title: 'Cómo me hace sentir el dinero',
            body: 'El dinero no solo se piensa. También se siente.\n\nSentir emociones con el dinero es normal.\n\nEl problema aparece cuando una emoción fuerte toma el control y decides sin analizar.',
            data: {
                stepType: 'info',
                title: 'Cómo me hace sentir el dinero',
                body: 'El dinero no solo se piensa. También se siente.\n\nSentir emociones con el dinero es normal.\n\nEl problema aparece cuando una emoción fuerte toma el control y decides sin analizar.',
                isAssessment: false
            }
        },
        {
            order: 2,
            type: 'mcq',
            title: 'Diagnóstico',
            body: 'Cuando tienes que pagar algo importante, ¿qué sientes primero?',
            data: {
                stepType: 'mcq',
                question: 'Cuando tienes que pagar algo importante, ¿qué sientes primero?',
                options: [
                    { id: 'opt1', label: 'Presión', isCorrect: true },
                    { id: 'opt2', label: 'Tranquilidad', isCorrect: true },
                    { id: 'opt3', label: 'Nervios', isCorrect: true },
                    { id: 'opt4', label: 'Indiferencia', isCorrect: true }
                ],
                isAssessment: false,
                continueLabel: 'Guardar baseline'
            }
        },
        {
            order: 3,
            type: 'info',
            title: 'Señales de emoción dominante',
            body: 'Una emoción domina cuando aparecen señales como:\n\n**Urgencia** (“lo quiero ya”)\n**Justificación rápida** (“me lo merezco”)\n**Evitar pensar en consecuencias** (“luego veo”)\n**Impulso físico** (ansiedad, emoción, estrés)\n\nEstas señales ayudan a detectar si estás decidiendo con emoción o con calma.',
            data: {
                stepType: 'info',
                title: 'Señales de emoción dominante',
                body: 'Una emoción domina cuando aparecen señales como:\n\n**Urgencia** (“lo quiero ya”)\n**Justificación rápida** (“me lo merezco”)\n**Evitar pensar en consecuencias** (“luego veo”)\n**Impulso físico** (ansiedad, emoción, estrés)\n\nEstas señales ayudan a detectar si estás decidiendo con emoción o con calma.',
                isAssessment: false
            }
        },
        {
            order: 4,
            type: 'mcq',
            title: 'Ejercicio',
            body: 'Sofía ve una oferta limitada...',
            data: {
                stepType: 'mcq',
                question: 'Sofía ve una oferta limitada. Piensa: “Si no lo compro hoy, pierdo la oportunidad” y siente urgencia.\n\nSegún las señales de la flashcard, ¿qué emoción está dominando?',
                options: [
                    { id: 'opt1', label: 'Tranquilidad', isCorrect: false },
                    { id: 'opt2', label: 'Emoción', isCorrect: true, explanation: 'Urgencia + “lo quiero ya” = emoción dominando.' },
                    { id: 'opt3', label: 'Paciencia', isCorrect: false },
                    { id: 'opt4', label: 'Indiferencia', isCorrect: false }
                ],
                isAssessment: true
            }
        },
        {
            order: 5,
            type: 'true_false',
            title: 'Ejercicio',
            body: 'Reconocer lo que siento...',
            data: {
                stepType: 'true_false',
                statement: 'Reconocer lo que siento antes de comprar puede ayudarme a decidir mejor.',
                correctValue: true,
                explanation: 'Nombrar la emoción reduce impulsos.',
                isAssessment: true
            }
        },
        {
            order: 6,
            type: 'info',
            title: 'La emoción es información',
            body: 'La emoción no es enemiga. Es información.\n\nPero no debería decidir por ti.\n\nRegla simple: “Pausa antes de pagar” cuando haya urgencia, estrés o impulso.',
            data: {
                stepType: 'info',
                title: 'La emoción es información',
                body: 'La emoción no es enemiga. Es información.\n\nPero no debería decidir por ti.\n\nRegla simple: “Pausa antes de pagar” cuando haya urgencia, estrés o impulso.',
                isAssessment: false
            }
        },
        {
            order: 7,
            type: 'mcq',
            title: 'Diagnóstico de escenario',
            body: 'Diego está enojado...',
            data: {
                stepType: 'mcq',
                question: 'Diego está enojado por una discusión. Entra a una tienda online y agrega cosas al carrito que no planeaba.\n\n¿Qué señal de emoción dominando aparece más clara?',
                options: [
                    { id: 'opt1', label: 'Justificación rápida', isCorrect: true, explanation: 'Comprar para regular emoción suele venir con justificación rápida o impulso.' },
                    { id: 'opt2', label: 'Planeación', isCorrect: false },
                    { id: 'opt3', label: 'Comparación de precios', isCorrect: false },
                    { id: 'opt4', label: 'Meta a largo plazo', isCorrect: false }
                ],
                isAssessment: true
            }
        },
        {
            order: 8,
            type: 'match',
            title: 'Relaciona',
            body: 'Elige la emoción más lógica',
            data: {
                stepType: 'match',
                question: 'Relaciona cada situación con la emoción más lógica:',
                leftItems: [
                    { id: 'l1', label: 'Ves que tu saldo es menor' },
                    { id: 'l2', label: 'Guardas para una meta' },
                    { id: 'l3', label: 'Te llega un cobro inesperado' },
                    { id: 'l4', label: 'Compras algo deseado' }
                ],
                rightItems: [
                    { id: 'r1', label: 'Ansiedad' },
                    { id: 'r2', label: 'Tranquilidad' },
                    { id: 'r3', label: 'Estrés' },
                    { id: 'r4', label: 'Emoción' }
                ],
                correctPairs: [
                    { leftId: 'l1', rightId: 'r1' },
                    { leftId: 'l2', rightId: 'r2' },
                    { leftId: 'l3', rightId: 'r3' },
                    { leftId: 'l4', rightId: 'r4' }
                ],
                isAssessment: true
            }
        },
        {
            order: 9,
            type: 'info',
            title: 'Tipos de compra',
            body: '**Planeada**: sabes por qué y para qué.\n**Impulsiva**: nace de emoción fuerte (urgencia, estrés, presión, euforia).\n\nLa compra impulsiva suele traer “culpa” después.',
            data: {
                stepType: 'info',
                title: 'Tipos de compra',
                body: '**Planeada**: sabes por qué y para qué.\n**Impulsiva**: nace de emoción fuerte (urgencia, estrés, presión, euforia).\n\nLa compra impulsiva suele traer “culpa” después.',
                isAssessment: false
            }
        },
        {
            order: 10,
            type: 'mcq',
            title: 'Mariana',
            body: 'Mariana dice: “Estoy estresada...”',
            data: {
                stepType: 'mcq',
                question: 'Mariana dice: “Estoy estresada, me merezco comprar esto aunque no me alcance”.\n\n¿Cuál es el error principal?',
                options: [
                    { id: 'opt1', label: 'Mezclar emoción con justificación financiera', isCorrect: true, explanation: 'La emoción explica lo que sientes, pero no vuelve buena una decisión mala.' },
                    { id: 'opt2', label: 'Hacer un presupuesto', isCorrect: false },
                    { id: 'opt3', label: 'Analizar consecuencias', isCorrect: false },
                    { id: 'opt4', label: 'Comparar opciones', isCorrect: false }
                ],
                isAssessment: true
            }
        },
        {
            order: 11,
            type: 'multi_select',
            title: 'Señales de compra impulsiva',
            body: '¿Cuáles señales indican compra impulsiva?',
            data: {
                stepType: 'multi_select',
                question: '¿Cuáles señales indican compra impulsiva? (Selecciona todas las correctas)',
                options: [
                    { id: 'opt1', label: 'Querer decidir rápido', isCorrect: true },
                    { id: 'opt2', label: 'Ignorar si estaba planeado', isCorrect: true },
                    { id: 'opt3', label: 'Justificar después', isCorrect: true },
                    { id: 'opt4', label: 'Sentir impulso inmediato', isCorrect: true }
                ],
                isAssessment: true,
                explanation: 'Todas son correctas. El impulso suele venir con urgencia, justificación y cero análisis.'
            }
        },
        {
            order: 12,
            type: 'info',
            title: 'Método rápido: 4 pasos',
            body: 'Antes de comprar:\n\n1. Nombrar lo que siento\n2. Pausar 30 segundos\n3. Evaluar si lo necesito o solo lo deseo\n4. Decidir con calma',
            data: {
                stepType: 'info',
                title: 'Método rápido: 4 pasos',
                body: 'Antes de comprar:\n\n1. Nombrar lo que siento\n2. Pausar 30 segundos\n3. Evaluar si lo necesito o solo lo deseo\n4. Decidir con calma',
                isAssessment: false
            }
        },
        {
            order: 13,
            type: 'order',
            title: 'Ordenar proceso',
            body: 'Ordena el método de 4 pasos',
            data: {
                stepType: 'order',
                question: 'Ordena el método de 4 pasos:',
                items: [
                    { id: 'i1', label: 'Nombrar lo que siento', correctOrder: 1 },
                    { id: 'i2', label: 'Pausar', correctOrder: 2 },
                    { id: 'i3', label: 'Evaluar si lo necesito', correctOrder: 3 },
                    { id: 'i4', label: 'Decidir', correctOrder: 4 }
                ],
                isAssessment: true
            }
        },
        {
            order: 14,
            type: 'mcq',
            title: 'Reflexión final',
            body: '¿Qué emoción aparece con más frecuencia?',
            data: {
                stepType: 'mcq',
                question: '¿Qué emoción aparece con más frecuencia cuando piensas en dinero?',
                options: [
                    { id: 'opt1', label: 'Presión', isCorrect: true },
                    { id: 'opt2', label: 'Motivación', isCorrect: true },
                    { id: 'opt3', label: 'Tranquilidad', isCorrect: true },
                    { id: 'opt4', label: 'Preocupación', isCorrect: true }
                ],
                isAssessment: false,
                continueLabel: 'Finalizar lección'
            }
        },
        {
            order: 15,
            type: 'summary',
            title: 'Lección completada',
            body: 'Ahora puedes detectar cuándo una emoción está dominando una decisión con dinero.',
            data: {
                stepType: 'summary',
                title: 'Lección completada',
                body: 'Ahora puedes detectar cuándo una emoción está dominando una decisión con dinero.',
                isAssessment: false
            }
        }
    ];

    for (const step of steps) {
        await prisma.lessonStep.create({
            data: {
                lessonId: LESSON_ID,
                order: step.order,
                type: step.type,
                title: step.title,
                body: step.body,
                data: step.data,
                xpReward: 50
            }
        });
    }

    console.log('Successfully populated lesson steps.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
