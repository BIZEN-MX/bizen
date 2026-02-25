"use client"

import CoursePageTemplate from "@/components/CoursePageTemplate"
import { TEMA18_SUBTEMAS } from "../tema18-data"

export default function Tema18Page() {
  return (
    <CoursePageTemplate
      topicId={18}
      subtemas={TEMA18_SUBTEMAS as any}
      getLessonPath={(slug) => `/learn/course-1/unit-1/${slug}/interactive`}
    />
  )
}
