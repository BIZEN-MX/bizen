"use client"

import { useState } from "react"

export default function MarkCompletePage() {
  const [moduleId, setModuleId] = useState("1")
  const [sectionId, setSectionId] = useState("1")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function markComplete() {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch("/api/progress/force-complete-section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId: parseInt(moduleId),
          sectionId: parseInt(sectionId),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`Success! Section ${sectionId} of Module ${moduleId} marked as complete. Found ${data.quizCount} completed quizzes.`)
      } else {
        setResult(`Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page-root" style={{ 
      minHeight: "100vh", 
      background: "#f8fafc",
      fontFamily: 'inherit'
    }}>
      <style>{`
        .admin-page-root { padding-left: 280px !important; }
        @media (max-width: 1160px) { .admin-page-root { padding-left: 220px !important; } }
        @media (max-width: 767px) { .admin-page-root { padding-left: 0 !important; padding-bottom: 100px !important; } }
      `}</style>
      <div style={{ padding: "clamp(24px, 4vw, 48px)", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }}>
      <div style={{
        maxWidth: 600,
        margin: "0 auto",
        background: "#fff",
        padding: 40,
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Mark Section Complete</h1>
            <p style={{ color: "#666", marginBottom: 32 }}>
              Use this to manually mark sections as complete if you&apos;ve already finished the quizzes.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Module ID:
          </label>
          <input
            type="number"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            min="1"
            max="6"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 16,
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Section ID:
          </label>
          <input
            type="number"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            min="1"
            max="3"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 16,
            }}
          />
        </div>

        <button
          onClick={markComplete}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#0F62FE",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Marking..." : "Mark as Complete"}
        </button>

        {result && (
          <div style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 8,
            background: result.startsWith("Success") ? "#d4edda" : "#f8d7da",
            color: result.startsWith("Success") ? "#155724" : "#721c24",
            fontSize: 14,
          }}>
            {result}
          </div>
        )}


        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            onClick={() => window.location.href = "/module/1/sections"}
            style={{
              color: "#0F62FE",
              textDecoration: "none",
              fontSize: 14,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ← Back to Module 1 Sections
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

