import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/api-auth";

export async function GET(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);
        if (!authResult.success) {
            return authResult.response;
        }
        const { user } = authResult.data;

        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { 
                dnaProfile: true, 
                dnaScore: true,
                cardTheme: true,
                level: true,
                xp: true
            }
        });

        return NextResponse.json(profile);

    } catch (error) {
        console.error("API Profile Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
