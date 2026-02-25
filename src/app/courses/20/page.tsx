"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA20_SUBTEMAS } from "../tema20-data"

export default function Tema20Page() {
  return (
    <CoursePageTemplate
      topicId={20}
      subtemas={TEMA20_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
