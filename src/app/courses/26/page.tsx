"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA26_SUBTEMAS } from "../tema26-data"

export default function Tema26Page() {
  return (
    <CoursePageTemplate
      topicId={26}
      subtemas={TEMA26_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
