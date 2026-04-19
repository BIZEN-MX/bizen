import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SUBTEMAS_BY_COURSE, TOPIC_TITLES } from "@/data/lessons/courseLessonsOrder";

export async function GET() {
  try {
    const lessonsDir = path.join(process.cwd(), "src", "data", "lessons");
    const results = [];
    let totalLessonsCount = 0;
    let missingLessonsCount = 0;
    let validLessonsCount = 0;

    for (let c = 0; c < SUBTEMAS_BY_COURSE.length; c++) {
      const topicName = TOPIC_TITLES[c] || `Tema ${c + 1}`;
      const subtemas = SUBTEMAS_BY_COURSE[c];
      
      const topicData = {
        topicNum: c + 1,
        topicName,
        totalDeclared: 0,
        missing: [] as string[],
        valid: [] as string[]
      };

      if (!subtemas) {
        results.push(topicData);
        continue;
      }

      for (const st of subtemas) {
        if (!st.lessons) continue;
        for (const lesson of st.lessons) {
          topicData.totalDeclared++;
          totalLessonsCount++;
          
          const slug = lesson.slug;
          const fileName = `lesson-${slug}.ts`;
          const filePath = path.join(lessonsDir, fileName);
          
          if (fs.existsSync(filePath)) {
            topicData.valid.push(slug);
            validLessonsCount++;
          } else {
            topicData.missing.push(slug);
            missingLessonsCount++;
          }
        }
      }

      results.push(topicData);
    }

    return NextResponse.json({
      summary: {
        totalDeclared: totalLessonsCount,
        validCount: validLessonsCount,
        missingCount: missingLessonsCount,
      },
      topics: results
    });

  } catch (error: any) {
    console.error("Audit API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
