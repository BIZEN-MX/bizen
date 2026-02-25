"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA27_SUBTEMAS } from "../tema27-data"

export default function Tema27Page() {
  return (
    <CoursePageTemplate
      topicId={27}
      subtemas={TEMA27_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
