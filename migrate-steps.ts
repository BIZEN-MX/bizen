import { PrismaClient } from "@prisma/client";
import { lessonRegistry } from "./src/data/lessons/registry";

const prisma = new PrismaClient();

async function migrate() {
  console.log("Starting step migration...");
  
  const dbLessons = await prisma.lesson.findMany();
  let migratedLessons = 0;
  let totalSteps = 0;

  for (const lesson of dbLessons) {
    const steps = lessonRegistry[lesson.id];
    
    if (steps && steps.length > 0) {
      // Clear existing just in case
      await prisma.lessonStep.deleteMany({
        where: { lessonId: lesson.id }
      });
      
      const createData = steps.map((step, index) => {
        // Extract type, defaulting appropriately
        const stepType = step.stepType || (step as any).type || "text";
        
        // Remove functions, keep purely serializable data
        const serializableStep = JSON.parse(JSON.stringify(step));
        
        return {
          lessonId: lesson.id,
          order: index + 1,
          type: stepType,
          title: serializableStep.title || null,
          body: serializableStep.content || serializableStep.text || null,
          data: serializableStep,
          xpReward: serializableStep.xp || 10
        };
      });

      await prisma.lessonStep.createMany({
        data: createData
      });
      
      migratedLessons++;
      totalSteps += steps.length;
    }
  }

  console.log(`Finished! Migrated ${totalSteps} steps into ${migratedLessons} lessons in the DB.`);
}

migrate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
