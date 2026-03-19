import React from 'react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_URL)!
    const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() { return cookieStore.getAll() },
            setAll() { /* handled in middleware */ }
        },
    })

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    // Role validation
    const userProfile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
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
