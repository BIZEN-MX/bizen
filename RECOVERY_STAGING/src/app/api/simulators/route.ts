import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const simulator = await prisma.simulator.findUnique({
        where: { slug, isActive: true }
      });
      return NextResponse.json(simulator);
    }

    const simulators = await prisma.simulator.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(simulators)
  } catch (error: any) {
    console.error("Error fetching simulators:", error);
    return NextResponse.json(
      { error: "Failed to fetch simulators" },
      { status: 500 }
    )
  }
}
