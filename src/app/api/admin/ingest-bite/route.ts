import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import ytdl from "ytdl-core";
import crypto from "crypto";

// Initialize GCS Client (It will auto-detect local gcloud auth or Cloud Run credentials)
const storage = new Storage();

// UPDATE THIS to the name of your new bucket:
const BUCKET_NAME = "bizen-vids-vault"; 

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return NextResponse.json({ error: "Invalid YouTube URL provided." }, { status: 400 });
    }

    // 1. Get video info from YouTube
    const info = await ytdl.getInfo(videoUrl);
    const videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueId = crypto.randomUUID().split("-")[0];
    const fileName = `${videoTitle}_${uniqueId}.mp4`;

    // 2. Select the optimal video quality (prefer max 1080p MP4)
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highest',
      filter: 'audioandvideo' 
    });

    if (!format) {
      return NextResponse.json({ error: "No suitable video format found." }, { status: 400 });
    }

    // 3. Prepare Google Cloud Storage upload stream
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);
    const writeStream = file.createWriteStream({
      resumable: false, // Better for small files/shorts
      contentType: "video/mp4",
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    // 4. Pipe YouTube stream directly to Google Cloud (RAM efficient)
    return new Promise((resolve, reject) => {
      ytdl(videoUrl, { format })
        .pipe(writeStream)
        .on("finish", async () => {
          // Video is completely uploaded to GCS!
          const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
          
          resolve(NextResponse.json({ 
            success: true, 
            message: "Video imported successfully!", 
            fileName,
            publicUrl,
            originalTitle: info.videoDetails.title
          }));
        })
        .on("error", (err) => {
          console.error("GCS Upload Error:", err);
          reject(NextResponse.json({ error: "Upload to GCS failed." }, { status: 500 }));
        });
    });

  } catch (error: any) {
    console.error("Ingestor Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
