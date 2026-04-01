import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

export async function POST(request: Request) {
  try {
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

    // Get current user
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para subir evidencias.' }, { status: 401 })
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
    const storagePath = `evidences/${user.id}/${fileName}`

    // Now it's safe to read the buffer (already size checked)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('evidences')
      .upload(storagePath, buffer, {
        contentType: file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: true
      })

    if (uploadError) {
      console.error('[Upload:StorageError]', uploadError)
      return NextResponse.json({ error: 'No se pudo guardar la imagen en el almacenamiento.' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('evidences')
      .getPublicUrl(storagePath)

    // Save metadata securely
    try {
      await prisma.fileUpload.create({
        data: {
          userId: user.id,
          userName: userName || user.user_metadata?.full_name || 'Estudiante',
          userEmail: userEmail || user.email || '',
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
    // 3. SAFE FAILURE: Log details, return generic info
    console.error('❌ [Upload:FatalError]:', error)
    return NextResponse.json({ 
      error: 'Error inesperado al procesar la subida.' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

