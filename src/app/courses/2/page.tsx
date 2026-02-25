"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA2_SUBTEMAS } from "../tema2-data"

export default function Tema2Page() {
  return (
    <CoursePageTemplate
      topicId={2}
      subtemas={TEMA2_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
