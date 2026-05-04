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

    // Additional safety check for unauthorized accounts
    const user = await (await auth()).sessionClaims; // This is not reliable for email usually
    // Better to get the full user from Clerk if we want the email on server side
    // Or just rely on the role check IF we successfully update the DB.
    
    // Actually, Clerk's currentUser is available
    const { currentUser } = await import('@clerk/nextjs/server');
    const fullUser = await currentUser();
    const email = fullUser?.emailAddresses[0]?.emailAddress.toLowerCase();

    if (userProfile.role !== 'teacher' && userProfile.role !== 'school_admin' && userProfile.role !== 'admin') {
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
