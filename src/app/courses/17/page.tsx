"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA17_SUBTEMAS } from "../tema17-data"

export default function Tema17Page() {
  return (
    <CoursePageTemplate
      topicId={17}
      subtemas={TEMA17_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
