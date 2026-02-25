"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA7_SUBTEMAS } from "../tema7-data"

export default function Tema7Page() {
  return (
    <CoursePageTemplate
      topicId={7}
      subtemas={TEMA7_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
