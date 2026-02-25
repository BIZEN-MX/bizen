"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA15_SUBTEMAS } from "../tema15-data"

export default function Tema15Page() {
  return (
    <CoursePageTemplate
      topicId={15}
      subtemas={TEMA15_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
