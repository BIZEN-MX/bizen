"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA24_SUBTEMAS } from "../tema24-data"

export default function Tema24Page() {
  return (
    <CoursePageTemplate
      topicId={24}
      subtemas={TEMA24_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
