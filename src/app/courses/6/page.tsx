"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA6_SUBTEMAS } from "../tema6-data"

export default function Tema6Page() {
  return (
    <CoursePageTemplate
      topicId={6}
      subtemas={TEMA6_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
