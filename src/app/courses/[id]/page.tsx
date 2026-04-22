"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import CoursePageTemplate from "@/components/CoursePageTemplate"
import PageLoader from "@/components/PageLoader"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"

export default function DynamicTopicPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [topicData, setTopicData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        // Redirect legacy 'course-1' format to 'tema-01'
        if (id.startsWith('course-')) {
            const num = id.replace('course-', '').padStart(2, '0')
            router.replace(`/courses/tema-${num}`)
            return
        }

        async function fetchTopic() {
            try {
                setLoading(true)
                // Use the courses API which includes topic + lessons/sections
                const res = await fetch(`/api/topics/${id}`)
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Tema no encontrado")
                    throw new Error("Error al cargar el tema")
                }
                const data = await res.json()
                
                // Normalize URL if fallback was used (e.g. lesson slug matched to parent topic)
                if (data.id && data.id !== id) {
                    router.replace(`/courses/${data.id}`)
                    return
                }

                setTopicData(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTopic()
    }, [id])

    if (loading) {
        return <PageLoader />
    }

    if (error || !topicData) {
        return (
            <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 p-6 bg-[#FBFAF5]">
                <p className="text-[20px] font-medium text-slate-700 text-center m-0">
                    {error || "No se pudo cargar la información del tema."}
                </p>
                <button
                    onClick={() => router.push("/courses?noredirect=true")}
                    className="px-6 py-3.5 bg-blue-600 text-white border-none rounded-xl text-[16px] font-medium cursor-pointer hover:bg-blue-700 transition"
                >
                    Volver a Cursos
                </button>
            </div>
        )
    }

    // Map DB topics to CoursePageTemplate expected format
    // Topic (dt) -> Course (subtheme) -> Lesson
    let subtemas = (topicData.courses || []).map((course: any) => ({
        title: course.title,
        lessons: (course.lessons || []).map((lesson: any) => ({
            title: lesson.title,
            slug: lesson.id,
            courseId: course.id
        }))
    }))

    // FALLBACK/OVERRIDE: For Temas 1-4, use the static data to ensure new lessons (like exams) are shown
    // even if not yet synced to the production database via API.
    const topicNum = parseInt(id.replace('tema-', ''))
    if (topicNum >= 1 && topicNum <= 4) {
        const staticData = SUBTEMAS_BY_COURSE[topicNum - 1]
        if (staticData) {
            subtemas = staticData.map((s: any) => ({
                title: s.title,
                lessons: s.lessons.map((l: any) => ({
                    title: l.title,
                    slug: l.slug,
                    level: l.level
                }))
            }))
        }
    }

    return (
        <CoursePageTemplate
            topicId={id}
            topicTitle={topicData.title}
            subtemas={subtemas}
            getLessonPath={(slug, courseId) => `/learn/${id}/${courseId || 'unknown'}/${slug}/interactive`}
        />
    )
}
