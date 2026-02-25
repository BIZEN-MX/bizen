"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA11_SUBTEMAS } from "../tema11-data"

export default function Tema11Page() {
  return (
    <CoursePageTemplate
      topicId={11}
      subtemas={TEMA11_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
