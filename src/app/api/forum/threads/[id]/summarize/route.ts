import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { summarizeThread } from "@/lib/ai/moderation";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createSupabaseServer();
        const { data: { user }, error: authError } = await (supabase as any).auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch thread and top 10 comments for summary
        const thread = await (prisma.forumThread as any).findUnique({
            where: { id },
            select: {
                title: true,
                body: true,
                comments: {
                    where: { moderationStatus: 'approved', isHidden: false },
                    select: { body: true },
                    take: 10,
                    orderBy: { score: 'desc' }
                }
            }
        });

        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        const commentTexts = thread.comments.map((c: any) => c.body);
        const summary = await summarizeThread(thread.title, thread.body, commentTexts);

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("Error generating thread summary:", error);
        return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
    }
}
