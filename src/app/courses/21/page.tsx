"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA21_SUBTEMAS } from "../tema21-data"

export default function Tema21Page() {
  return (
    <CoursePageTemplate
      topicId={21}
      subtemas={TEMA21_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
