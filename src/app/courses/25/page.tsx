"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA25_SUBTEMAS } from "../tema25-data"

export default function Tema25Page() {
  return (
    <CoursePageTemplate
      topicId={25}
      subtemas={TEMA25_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
