
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ALIVE",
    message: "Si ves esto, el servidor funciona. El problema es PRISMA o la llave de la DB.",
    env: {
      HAS_DB_URL: !!process.env.BIZEN_DATABASE_URL,
      HAS_CLERK_SECRET: !!process.env.CLERK_SECRET_KEY,
      NODE_ENV: process.env.NODE_ENV,
      VPC_EGRESS: "Check cloudbuild.yaml"
    }
  });
}
