"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA10_SUBTEMAS } from "../tema10-data"

export default function Tema10Page() {
  return (
    <CoursePageTemplate
      topicId={10}
      subtemas={TEMA10_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
