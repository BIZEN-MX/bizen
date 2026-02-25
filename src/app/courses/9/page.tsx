"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA9_SUBTEMAS } from "../tema9-data"

export default function Tema9Page() {
  return (
    <CoursePageTemplate
      topicId={9}
      subtemas={TEMA9_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
