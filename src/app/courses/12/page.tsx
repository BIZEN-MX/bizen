"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA12_SUBTEMAS } from "../tema12-data"

export default function Tema12Page() {
  return (
    <CoursePageTemplate
      topicId={12}
      subtemas={TEMA12_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
