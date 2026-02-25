'use client'

import React from 'react'

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{
            minHeight: "100vh",
            background: "#f8fafc",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* We can add a simple header or use the existing sidebar if applicable, 
          but for now, a clean layout wrapper is sufficient. */}
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    )
}
