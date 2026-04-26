import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Storage } from '@google-cloud/storage'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const BUCKET_NAME = process.env.GOOGLE_CLOUD_BUCKET || 'bizen-uploads'; // Ensure this matches your GCP bucket

// Initialize Google Cloud Storage
// Uses Application Default Credentials (ADC) locally and in GCP
const storage = new Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT || 'bizen-475002' });

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Debes iniciar sesión para subir evidencias.' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = (formData.get('title') as string | null)?.slice(0, 50) || 'Evidencia Misión Diaria'
    const notes = (formData.get('notes') as string | null)?.slice(0, 200) || null
    const userName = (formData.get('userName') as string | null)?.slice(0, 50)
    const userEmail = (formData.get('userEmail') as string | null)?.slice(0, 100)

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No se proporcionó un archivo válido.' }, { status: 400 })
    }

    // 1. INPUT PROTECTION: File Size Limit (Prevents DoS/OOM)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `El archivo es demasiado grande (máximo 5MB). Tu archivo pesa ${(file.size / (1024 * 1024)).toFixed(1)}MB.` 
      }, { status: 400 })
    }

    // 2. INPUT PROTECTION: Extension validation
    const originalName = file.name
    const ext = (originalName.split('.').pop() || 'png').toLowerCase()
    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
       return NextResponse.json({ error: 'Formato no permitido. Usa PNG, JPG o WEBP.' }, { status: 400 })
    }

    // Generate unique & safe filename
    const timestamp = Date.now()
    const baseName = originalName.split('.')[0]
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .slice(0, 30)
    
    const fileName = `${baseName}_${timestamp}.${ext}`
    const storagePath = `evidences/${userId}/${fileName}`

    // Read buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Google Cloud Storage
    const bucket = storage.bucket(BUCKET_NAME)
    const gcsFile = bucket.file(storagePath)

    try {
      await gcsFile.save(buffer, {
        contentType: file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        resumable: false,
        validation: false, // Fast upload
      })
      
      // Intentar hacer el archivo público (puede fallar si el bucket ya tiene políticas públicas forzadas)
      try {
        await gcsFile.makePublic();
      } catch (e) {
        console.warn('Could not make file explicitly public (usually normal if bucket is public by default):', e);
      }
      
    } catch (uploadError) {
      console.error('[Upload:StorageError]', uploadError)
      return NextResponse.json({ error: 'No se pudo guardar la imagen en Google Cloud Storage. Verifica que el bucket exista.' }, { status: 500 })
    }

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${storagePath}`;

    // Save metadata securely
    try {
      await prisma.fileUpload.create({
        data: {
          userId: userId,
          userName: userName || 'Estudiante',
          userEmail: userEmail || '',
          originalName: originalName.slice(0, 100),
          filename: fileName,
          title: title,
          notes: notes,
          size: file.size,
          type: file.type || `image/${ext}`,
          path: publicUrl
        }
      })
    } catch (prismaError: any) {
      console.error('[Upload:PrismaError]', prismaError.message)
    }

    return NextResponse.json({ 
      success: true,
      url: publicUrl,
    }, { status: 200 })

  } catch (error: any) {
    console.error('❌ [Upload:FatalError]:', error)
    return NextResponse.json({ 
      error: 'Error inesperado al procesar la subida.',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

