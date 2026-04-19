/**
 * Delete all data for a specific user from the database
 * Usage: node scripts/delete-user-data.js <userId>
 * Example: node scripts/delete-user-data.js abc123-def456-ghi789
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUserData(userId) {
  if (!userId) {
    console.error('❌ Error: Please provide a userId');
    console.log('Usage: node scripts/delete-user-data.js <userId>');
    process.exit(1);
  }

  console.log(`\n🗑️  Deleting all data for user: ${userId}\n`);

  try {
    // Start transaction to delete all user data
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete QuizAnswers (via cascade when QuizAttempts are deleted)
      // 2. Delete QuizAttempts
      const quizAttempts = await tx.quizAttempt.deleteMany({
        where: { userId }
      });
      console.log(`✅ Deleted ${quizAttempts.count} quiz attempts (and related answers)`);

      // 3. Delete PageVisits
      const pageVisits = await tx.pageVisit.deleteMany({
        where: { userId }
      });
      console.log(`✅ Deleted ${pageVisits.count} page visits`);

      // 4. Delete SectionCompletions
      const sectionCompletions = await tx.sectionCompletion.deleteMany({
        where: { userId }
      });
      console.log(`✅ Deleted ${sectionCompletions.count} section completions`);

      // 5. Delete UserSectionCompletions
      const userSectionCompletions = await tx.userSectionCompletion.deleteMany({
        where: { userId }
      });
      console.log(`✅ Deleted ${userSectionCompletions.count} user section completions`);

      // 6. Delete UserModuleProgress
      const userModuleProgress = await tx.userModuleProgress.deleteMany({
        where: { userId }
      });
      console.log(`✅ Deleted ${userModuleProgress.count} user module progress records`);

      // 7. Delete Progress
      const progress = await tx.progress.deleteMany({
        where: { userId }
      });
      console.log(`✅ Deleted ${progress.count} progress records`);

      // 8. Delete DiagnosticQuiz
      const diagnosticQuiz = await tx.diagnosticQuiz.deleteMany({
        where: { userId }
      });
      console.log(`✅ Deleted ${diagnosticQuiz.count} diagnostic quiz records`);

      return {
        quizAttempts: quizAttempts.count,
        pageVisits: pageVisits.count,
        sectionCompletions: sectionCompletions.count,
        userSectionCompletions: userSectionCompletions.count,
        userModuleProgress: userModuleProgress.count,
        progress: progress.count,
        diagnosticQuiz: diagnosticQuiz.count,
      };
    });

    console.log(`\n✅ Successfully deleted all data for user ${userId}`);
    console.log('Summary:', result);
    
  } catch (error) {
    console.error('❌ Error deleting user data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get userId from command line arguments
const userId = process.argv[2];

// Confirm before deleting
if (userId) {
  console.log(`\n⚠️  WARNING: This will permanently delete ALL data for user: ${userId}`);
  console.log('This includes:');
  console.log('  - Quiz attempts and answers');
  console.log('  - Page visits');
  console.log('  - Section completions');
  console.log('  - Module progress');
  console.log('  - Diagnostic quiz results');
  console.log('\nPress Ctrl+C to cancel, or wait 3 seconds to proceed...\n');
  
  setTimeout(() => {
    deleteUserData(userId)
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
  console.error('❌ Error: Please provide a userId');
  console.log('Usage: node scripts/delete-user-data.js <userId>');
  process.exit(1);
}


