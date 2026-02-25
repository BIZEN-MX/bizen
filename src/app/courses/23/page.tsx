"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA23_SUBTEMAS } from "../tema23-data"

export default function Tema23Page() {
  return (
    <CoursePageTemplate
      topicId={23}
      subtemas={TEMA23_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
