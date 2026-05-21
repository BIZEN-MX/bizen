/**
 * BIZEN Content Seed Script
 * 
 * This script reads course content from JSON files and populates the database.
 * 
 * Usage:
 *   npm run seed                    # Seed from default content.json
 *   npm run seed custom-content.json # Seed from custom file
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface SeedOption {
  text: string;
  isCorrect: boolean;
}

interface SeedQuestion {
  type: 'mcq' | 'truefalse' | 'short';
  prompt: string;
  order: number;
  options: SeedOption[];
}

interface SeedQuiz {
  title: string;
  passScore: number;
  totalPoints: number;
  questions: SeedQuestion[];
}

interface SeedObjective {
  title: string;
  description?: string;
}

interface SeedLesson {
  title: string;
  contentType: 'video' | 'reading' | 'exercise';
  order: number;
  objectives?: SeedObjective[];
  quizzes?: SeedQuiz[];
}

interface SeedAssignment {
  title: string;
  type: 'file' | 'link' | 'text';
  points: number;
  dueAt?: string | null;
}

interface SeedUnit {
  title: string;
  order: number;
  isLocked: boolean;
  lessons: SeedLesson[];
  assignments?: SeedAssignment[];
}

interface SeedCourse {
  title: string;
  description?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isActive: boolean;
  units: SeedUnit[];
}

interface SeedData {
  courses: SeedCourse[];
}

async function main() {
  console.log('🌱 Starting BIZEN content seed...\n');

  // Get filename from command line args or use default
  const args = process.argv.slice(2);
  const filename = args[0] || 'content.json';
  const filePath = path.join(__dirname, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    console.log('\n💡 Tip: Create a content.json file in the seed/ directory');
    console.log('   or specify a different file: npm run seed my-content.json\n');
    process.exit(1);
  }

  console.log(`📖 Reading content from: ${filename}`);

  // Read and parse JSON
  let data: SeedData;
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (error) {
    console.error('❌ Error parsing JSON file:', error);
    process.exit(1);
  }

  // Validate data structure
  if (!data.courses || !Array.isArray(data.courses)) {
    console.error('❌ Error: Invalid data structure. Expected { courses: [...] }');
    process.exit(1);
  }

  console.log(`✅ Found ${data.courses.length} course(s) to seed\n`);

  let stats = {
    courses: 0,
    units: 0,
    lessons: 0,
    quizzes: 0,
    questions: 0,
    objectives: 0,
    assignments: 0,
  };

  // Process each course
  for (const courseData of data.courses) {
    console.log(`📚 Creating course: ${courseData.title}`);

    // Create course
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description || null,
        level: courseData.level,
        isActive: courseData.isActive,
      },
    });
    stats.courses++;

    // Process units
    for (const unitData of courseData.units) {
      console.log(`  📦 Creating unit: ${unitData.title}`);

      const unit = await prisma.unit.create({
        data: {
          courseId: course.id,
          title: unitData.title,
          order: unitData.order,
          isLocked: unitData.isLocked,
        },
      });
      stats.units++;

      // Process lessons
      for (const lessonData of unitData.lessons) {
        console.log(`    📄 Creating lesson: ${lessonData.title}`);

        const lesson = await prisma.lesson.create({
          data: {
            unitId: unit.id,
            title: lessonData.title,
            contentType: lessonData.contentType,
            order: lessonData.order,
          },
        });
        stats.lessons++;

        // Process objectives
        if (lessonData.objectives) {
          for (const objectiveData of lessonData.objectives) {
            const objective = await prisma.objective.create({
              data: {
                title: objectiveData.title,
                description: objectiveData.description || null,
                level: 'lesson',
              },
            });

            await prisma.lessonObjective.create({
              data: {
                lessonId: lesson.id,
                objectiveId: objective.id,
              },
            });
            stats.objectives++;
          }
        }

        // Process quizzes
        if (lessonData.quizzes) {
          for (const quizData of lessonData.quizzes) {
            console.log(`      ❓ Creating quiz: ${quizData.title}`);

            const quiz = await prisma.quiz.create({
              data: {
                lessonId: lesson.id,
                title: quizData.title,
                passScore: quizData.passScore,
                totalPoints: quizData.totalPoints,
              },
            });
            stats.quizzes++;

            // Process questions
            for (const questionData of quizData.questions) {
              const question = await prisma.question.create({
                data: {
                  quizId: quiz.id,
                  type: questionData.type,
                  prompt: questionData.prompt,
                  order: questionData.order,
                },
              });
              stats.questions++;

              // Process options
              for (const optionData of questionData.options) {
                await prisma.option.create({
                  data: {
                    questionId: question.id,
                    text: optionData.text,
                    isCorrect: optionData.isCorrect,
                  },
                });
              }
            }
          }
        }
      }

      // Process assignments
      if (unitData.assignments) {
        for (const assignmentData of unitData.assignments) {
          console.log(`    📝 Creating assignment: ${assignmentData.title}`);

          await prisma.assignment.create({
            data: {
              unitId: unit.id,
              title: assignmentData.title,
              type: assignmentData.type,
              points: assignmentData.points,
              dueAt: assignmentData.dueAt ? new Date(assignmentData.dueAt) : null,
            },
          });
          stats.assignments++;
        }
      }
    }

    console.log(`✅ Course "${courseData.title}" created successfully!\n`);
  }

  // Print summary
  console.log('🎉 Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   Courses:     ${stats.courses}`);
  console.log(`   Units:       ${stats.units}`);
  console.log(`   Lessons:     ${stats.lessons}`);
  console.log(`   Quizzes:     ${stats.quizzes}`);
  console.log(`   Questions:   ${stats.questions}`);
  console.log(`   Objectives:  ${stats.objectives}`);
  console.log(`   Assignments: ${stats.assignments}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed with error:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

