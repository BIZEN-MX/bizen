import { NextResponse } from "next/server"
import Mux from "@mux/mux-node"
import { currentUser } from "@clerk/nextjs/server"

const SUPER_ADMINS = ["diego@bizen.mx"]

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase()
    
    if (!email || !SUPER_ADMINS.includes(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return NextResponse.json({ error: "Mux keys not configured" }, { status: 500 })
    }

    const mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET
    });

    // Create a direct upload URL
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "basic", // Sufficient for short mobile videos
      },
      cors_origin: "*", 
    })

    return NextResponse.json({ 
      uploadId: upload.id, 
      uploadUrl: upload.url 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
