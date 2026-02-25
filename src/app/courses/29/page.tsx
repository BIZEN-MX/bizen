"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA29_SUBTEMAS } from "../tema29-data"

export default function Tema29Page() {
  return (
    <CoursePageTemplate
      topicId={29}
      subtemas={TEMA29_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
