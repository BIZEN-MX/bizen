import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
    const prisma = new PrismaClient();
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
