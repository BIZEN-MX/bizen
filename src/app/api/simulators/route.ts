import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    
    const { data: simulators, error } = await supabase
      .from("simulators")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(simulators)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch simulators" },
      { status: 500 }
    )
  }
}


