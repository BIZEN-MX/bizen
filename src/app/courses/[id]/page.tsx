"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import CoursePageTemplate from "@/components/CoursePageTemplate"
import { motion } from "framer-motion"

export default function DynamicTopicPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [topicData, setTopicData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

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
        return (
            <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFAF5", gap: 16, flexDirection: "column" }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 40, height: 40, border: "4px solid #E2E8F0", borderTopColor: "#0B71FE", borderRadius: "50%" }}
                />
                <p style={{ fontWeight: 500, color: "#64748B" }}>Cargando tema...</p>
            </div>
        )
    }

    if (error || !topicData) {
        return (
            <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 24, background: "#FBFAF5" }}>
                <p style={{ fontSize: 20, fontWeight: 500, color: "#334155", textAlign: "center" }}>
                    {error || "No se pudo cargar la información del tema."}
                </p>
                <button
                    onClick={() => router.push("/courses")}
                    style={{ padding: "14px 24px", background: "#0B71FE", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 500, cursor: "pointer" }}
                >
                    Volver a Cursos
                </button>
            </div>
        )
    }

    // Map DB topics to CoursePageTemplate expected format
    // Topic (dt) -> Course (subtheme) -> Lesson
    const subtemas = (topicData.courses || []).map((course: any) => ({
        title: course.title,
        lessons: (course.lessons || []).map((lesson: any) => ({
            title: lesson.title,
            slug: lesson.id,
            courseId: course.id
        }))
    }))

    return (
        <CoursePageTemplate
            topicId={id}
            topicTitle={topicData.title}
            subtemas={subtemas}
            getLessonPath={(slug, courseId) => `/learn/${id}/${courseId || 'unknown'}/${slug}/interactive`}
        />
    )
}
