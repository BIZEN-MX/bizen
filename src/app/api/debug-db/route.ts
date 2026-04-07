import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const challenge = await prisma.dailyChallenge.findFirst();

        return NextResponse.json({
            status: "ok",
            challenge
        });
    } catch (e: any) {
        return NextResponse.json({
            status: "fatal",
            error: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
