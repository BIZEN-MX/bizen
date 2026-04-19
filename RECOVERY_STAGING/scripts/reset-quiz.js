/**
 * Reset a specific quiz for a user
 * Usage: node scripts/reset-quiz.js <userId> <moduleId> <sectionId> <pageNumber>
 * Example: node scripts/reset-quiz.js abc123 1 1 4
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetQuiz(userId, moduleId, sectionId, pageNumber) {
  if (!userId || !moduleId || !sectionId || !pageNumber) {
    console.error('❌ Error: Please provide all parameters');
    console.log('Usage: node scripts/reset-quiz.js <userId> <moduleId> <sectionId> <pageNumber>');
    console.log('Example: node scripts/reset-quiz.js abc123 1 1 4');
    process.exit(1);
  }

  console.log(`\n🔄 Resetting quiz for:`);
  console.log(`   User: ${userId}`);
  console.log(`   Module: ${moduleId}`);
  console.log(`   Section: ${sectionId}`);
  console.log(`   Page: ${pageNumber}\n`);

  try {
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find and delete the quiz attempt (this cascades to delete QuizAnswers)
      const quizAttempt = await tx.quizAttempt.findUnique({
        where: {
          userId_moduleId_sectionId_pageNumber: {
            userId,
            moduleId: parseInt(moduleId),
            sectionId: parseInt(sectionId),
            pageNumber: parseInt(pageNumber),
          }
        },
        include: {
          answers: true
        }
      });

      if (!quizAttempt) {
        console.log('⚠️  No quiz found to reset');
        return { deleted: false };
      }

      // 2. Delete the quiz attempt (answers are deleted via cascade)
      await tx.quizAttempt.delete({
        where: {
          userId_moduleId_sectionId_pageNumber: {
            userId,
            moduleId: parseInt(moduleId),
            sectionId: parseInt(sectionId),
            pageNumber: parseInt(pageNumber),
          }
        }
      });

      console.log(`✅ Deleted quiz attempt with ${quizAttempt.answers.length} answers`);

      // 3. Update SectionCompletion to decrement quizzesCompleted
      const sectionCompletion = await tx.sectionCompletion.findUnique({
        where: {
          userId_moduleId_sectionId: {
            userId,
            moduleId: parseInt(moduleId),
            sectionId: parseInt(sectionId),
          }
        }
      });

      if (sectionCompletion) {
        const newQuizzesCompleted = Math.max(0, sectionCompletion.quizzesCompleted - 1);
        const isComplete = (sectionCompletion.pagesVisited === sectionCompletion.totalPages && 
                           newQuizzesCompleted === sectionCompletion.quizzesTotal);

        await tx.sectionCompletion.update({
          where: {
            userId_moduleId_sectionId: {
              userId,
              moduleId: parseInt(moduleId),
              sectionId: parseInt(sectionId),
            }
          },
          data: {
            quizzesCompleted: newQuizzesCompleted,
            isComplete: isComplete,
            updatedAt: new Date()
          }
        });

        console.log(`✅ Updated section completion: ${newQuizzesCompleted}/${sectionCompletion.quizzesTotal} quizzes completed`);
      }

      return { deleted: true, answersCount: quizAttempt.answers.length };
    });

    console.log('\n✅ Quiz reset successfully!');
    console.log('Summary:', result);
    
  } catch (error) {
    console.error('❌ Error resetting quiz:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get parameters from command line arguments
const [userId, moduleId, sectionId, pageNumber] = process.argv.slice(2);

if (userId && moduleId && sectionId && pageNumber) {
  console.log(`\n⚠️  WARNING: This will reset the quiz for:`);
  console.log(`   User: ${userId}`);
  console.log(`   Module ${moduleId}, Section ${sectionId}, Page ${pageNumber}`);
  console.log(`\nPress Ctrl+C to cancel, or wait 3 seconds to proceed...\n`);
  
  setTimeout(() => {
    resetQuiz(userId, moduleId, sectionId, pageNumber)
      .then(() => {
        console.log('\n✅ Done!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
      });
  }, 3000);
} else {
  console.error('❌ Error: Please provide all parameters');
  console.log('Usage: node scripts/reset-quiz.js <userId> <moduleId> <sectionId> <pageNumber>');
  console.log('Example: node scripts/reset-quiz.js abc123 1 1 4');
  process.exit(1);
}

