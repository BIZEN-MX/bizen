import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()

    if (!userId) {
        redirect('/login')
    }

    // Role validation
    const userProfile = await prisma.profile.findUnique({
        where: { userId },
        select: { role: true }
    })

    if (!userProfile) {
        redirect('/login')
    }

    if (userProfile.role !== 'teacher' && userProfile.role !== 'school_admin') {
        // Kick them out to the student dashboard immediately
        redirect('/dashboard')
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#FBFAF5",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* Validated Server-Side Teacher Layout */}
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    )
}
