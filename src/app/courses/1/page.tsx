"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA1_SUBTEMAS } from "../tema1-data"

export default function Tema1Page() {
  return (
    <CoursePageTemplate
      topicId={1}
      subtemas={TEMA1_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
