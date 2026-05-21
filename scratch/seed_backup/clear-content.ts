/**
 * BIZEN Clear Content Script
 * 
 * ⚠️  WARNING: This will DELETE ALL course content from the database!
 * Use this to start fresh before re-seeding.
 * 
 * Usage: npm run seed:clear
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  console.log('⚠️  WARNING: This will DELETE ALL course content!\n');
  console.log('This includes:');
  console.log('  - All courses');
  console.log('  - All units');
  console.log('  - All lessons');
  console.log('  - All quizzes and questions');
  console.log('  - All objectives');
  console.log('  - All assignments');
  console.log('\n❗ User progress, enrollments, and profiles will NOT be deleted.\n');

  const confirmed = await confirm('Type "yes" to continue: ');

  if (!confirmed) {
    console.log('\n✅ Cancelled. No data was deleted.');
    return;
  }

  console.log('\n🗑️  Deleting content...\n');

  // Delete in order (Prisma will handle cascading deletes)
  const deletedOptions = await prisma.option.deleteMany({});
  console.log(`   Deleted ${deletedOptions.count} options`);

  const deletedQuestions = await prisma.question.deleteMany({});
  console.log(`   Deleted ${deletedQuestions.count} questions`);

  const deletedQuizzes = await prisma.quiz.deleteMany({});
  console.log(`   Deleted ${deletedQuizzes.count} quizzes`);

  const deletedLessonObjectives = await prisma.lessonObjective.deleteMany({});
  console.log(`   Deleted ${deletedLessonObjectives.count} lesson objectives`);

  const deletedObjectives = await prisma.objective.deleteMany({});
  console.log(`   Deleted ${deletedObjectives.count} objectives`);

  const deletedProgress = await prisma.progress.deleteMany({});
  console.log(`   Deleted ${deletedProgress.count} progress records`);

  const deletedLessons = await prisma.lesson.deleteMany({});
  console.log(`   Deleted ${deletedLessons.count} lessons`);

  const deletedSubmissions = await prisma.submission.deleteMany({});
  console.log(`   Deleted ${deletedSubmissions.count} submissions`);

  const deletedAssignments = await prisma.assignment.deleteMany({});
  console.log(`   Deleted ${deletedAssignments.count} assignments`);

  const deletedPrerequisites = await prisma.prerequisite.deleteMany({});
  console.log(`   Deleted ${deletedPrerequisites.count} prerequisites`);

  const deletedUnits = await prisma.unit.deleteMany({});
  console.log(`   Deleted ${deletedUnits.count} units`);

  const deletedSchoolCourses = await prisma.schoolCourse.deleteMany({});
  console.log(`   Deleted ${deletedSchoolCourses.count} school courses`);

  const deletedEnrollments = await prisma.enrollment.deleteMany({});
  console.log(`   Deleted ${deletedEnrollments.count} enrollments`);

  const deletedCertificates = await prisma.certificate.deleteMany({});
  console.log(`   Deleted ${deletedCertificates.count} certificates`);

  const deletedAttempts = await prisma.attempt.deleteMany({});
  console.log(`   Deleted ${deletedAttempts.count} quiz attempts`);

  const deletedCourses = await prisma.course.deleteMany({});
  console.log(`   Deleted ${deletedCourses.count} courses`);

  console.log('\n✅ All content cleared successfully!');
  console.log('   You can now run "npm run seed" to add fresh content.\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Clear failed with error:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

