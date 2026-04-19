
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// WE REMOVED PRISMA IMPORT TO TEST IF DATABASE CONNECTION IS CAUSING THE 500

export const dynamic = "force-dynamic";

export async function GET() {
  const report: any = {
    msg: "HOLA DESDE BIZEN - MODO SUPERVIVENCIA",
    time: new Date().toISOString(),
    cwd: process.cwd(),
    files: []
  };

  try {
    report.files = fs.readdirSync(process.cwd()).slice(0, 15);
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
