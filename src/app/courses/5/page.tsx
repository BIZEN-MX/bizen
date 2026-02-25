"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA5_SUBTEMAS } from "../tema5-data"

export default function Tema5Page() {
  return (
    <CoursePageTemplate
      topicId={5}
      subtemas={TEMA5_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
