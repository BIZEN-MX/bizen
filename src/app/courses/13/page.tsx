"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA13_SUBTEMAS } from "../tema13-data"

export default function Tema13Page() {
  return (
    <CoursePageTemplate
      topicId={13}
      subtemas={TEMA13_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
