"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA22_SUBTEMAS } from "../tema22-data"

export default function Tema22Page() {
  return (
    <CoursePageTemplate
      topicId={22}
      subtemas={TEMA22_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
