"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA16_SUBTEMAS } from "../tema16-data"

export default function Tema16Page() {
  return (
    <CoursePageTemplate
      topicId={16}
      subtemas={TEMA16_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
