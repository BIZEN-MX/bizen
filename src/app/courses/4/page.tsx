"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA4_SUBTEMAS } from "../tema4-data"

export default function Tema4Page() {
  return (
    <CoursePageTemplate
      topicId={4}
      subtemas={TEMA4_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
