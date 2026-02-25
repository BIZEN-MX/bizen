"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA14_SUBTEMAS } from "../tema14-data"

export default function Tema14Page() {
  return (
    <CoursePageTemplate
      topicId={14}
      subtemas={TEMA14_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
