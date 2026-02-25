"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA30_SUBTEMAS } from "../tema30-data"

export default function Tema30Page() {
  return (
    <CoursePageTemplate
      topicId={30}
      subtemas={TEMA30_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
