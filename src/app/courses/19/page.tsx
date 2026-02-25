"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA19_SUBTEMAS } from "../tema19-data"

export default function Tema19Page() {
  return (
    <CoursePageTemplate
      topicId={19}
      subtemas={TEMA19_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
