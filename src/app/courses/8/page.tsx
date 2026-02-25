"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA8_SUBTEMAS } from "../tema8-data"

export default function Tema8Page() {
  return (
    <CoursePageTemplate
      topicId={8}
      subtemas={TEMA8_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
