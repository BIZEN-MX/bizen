/**
 * List all userIds that have data in the database
 * Shows their quiz attempts to help identify them
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('\n📊 Finding all users with data in the database...\n');

    // Get all unique userIds from various tables
    const quizUsers = await prisma.quizAttempt.findMany({
      select: { userId: true },
      distinct: ['userId']
    });

    const diagnosticUsers = await prisma.diagnosticQuiz.findMany({
      select: { userId: true }
    });

    const progressUsers = await prisma.sectionCompletion.findMany({
      select: { userId: true },
      distinct: ['userId']
    });

    // Combine and deduplicate
    const allUserIds = new Set([
      ...quizUsers.map(u => u.userId),
      ...diagnosticUsers.map(u => u.userId),
      ...progressUsers.map(u => u.userId),
    ]);

    console.log(`Found ${allUserIds.size} unique users with data:\n`);

    // Show details for each user
    for (const userId of allUserIds) {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`👤 User ID: ${userId}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      // Diagnostic quiz
      const diagnostic = await prisma.diagnosticQuiz.findUnique({
        where: { userId }
      });
      if (diagnostic) {
        console.log(`  📝 Diagnostic Quiz: ${diagnostic.score}/${diagnostic.totalQuestions} (${diagnostic.scorePct}%)`);
        if (diagnostic.studentName) {
          console.log(`     Name: ${diagnostic.studentName}`);
        }
        console.log(`     Completed: ${diagnostic.completedAt.toISOString()}`);
      }

      // Quiz attempts
      const quizAttempts = await prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: [
          { moduleId: 'asc' },
          { sectionId: 'asc' },
          { pageNumber: 'asc' }
        ]
      });
      
      if (quizAttempts.length > 0) {
        console.log(`  🎯 Quiz Attempts (${quizAttempts.length}):`);
        quizAttempts.forEach(attempt => {
          console.log(`     M${attempt.moduleId}S${attempt.sectionId}P${attempt.pageNumber}: ${attempt.score}/${attempt.totalQuestions} (${attempt.quizType})`);
        });
      }

      // Section completions
      const sections = await prisma.sectionCompletion.findMany({
        where: { userId },
        orderBy: [
          { moduleId: 'asc' },
          { sectionId: 'asc' }
        ]
      });

      if (sections.length > 0) {
        console.log(`  ✅ Sections Completed (${sections.filter(s => s.isComplete).length}/${sections.length}):`);
        sections.forEach(sec => {
          const status = sec.isComplete ? '✓' : '○';
          console.log(`     ${status} M${sec.moduleId}S${sec.sectionId}: ${sec.quizzesCompleted}/${sec.quizzesTotal} quizzes`);
        });
      }

      // Page visits count
      const visitCount = await prisma.pageVisit.count({
        where: { userId }
      });
      console.log(`  👁️  Total page visits: ${visitCount}`);

      console.log('');
    }

    console.log(`\n💡 To delete a user's data, run:`);
    console.log(`   node scripts/delete-user-data.js <userId>`);
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();


