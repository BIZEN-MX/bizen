import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
    const prisma = new PrismaClient();
    try {
        const tables = await prisma.$queryRawUnsafe(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        let challenges = null;
        let challengeError = null;
        try {
            challenges = await prisma.dailyChallenge.findFirst();
        } catch (e) {
            challengeError = {
                message: e.message,
                name: e.name,
                code: e.code,
                meta: e.meta
            };
        }

        return NextResponse.json({
            status: "ok",
            tables,
            challengeError,
            challenges
        });
    } catch (e) {
        return NextResponse.json({
            status: "fatal",
            error: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
