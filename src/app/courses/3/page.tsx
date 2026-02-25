"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA3_SUBTEMAS } from "../tema3-data"

export default function Tema3Page() {
  return (
    <CoursePageTemplate
      topicId={3}
      subtemas={TEMA3_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
