"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA28_SUBTEMAS } from "../tema28-data"

export default function Tema28Page() {
  return (
    <CoursePageTemplate
      topicId={28}
      subtemas={TEMA28_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
