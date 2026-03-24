import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    console.log('[Upload] Starting POST request...');
    const formData = await request.formData()
    console.log('[Upload] FormData parsed');
    const file = formData.get('file') as File | null
    const userName = formData.get('userName') as string | null
    const userEmail = formData.get('userEmail') as string | null
    const title = formData.get('title') as string | null
    const notes = formData.get('notes') as string | null

    if (!file) {
      console.warn('[Upload] Missing file in FormData');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!(file instanceof Blob)) {
      console.warn('[Upload] Received item is not a File/Blob:', typeof file);
      return NextResponse.json({ error: 'Invalid file data' }, { status: 400 })
    }

    // Get current user
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.warn('[Upload:Auth] Anonymous upload attempt blocked');
      return NextResponse.json({ error: 'Debes iniciar sesión para subir fotos de tus evidencias.' }, { status: 401 })
    }

    // --- NEW: Upload to Supabase Storage ---
    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const ext = (originalName.split('.').pop() || 'png').toLowerCase()
    
    // Validate extension
    const allowed = ['png', 'jpg', 'jpeg', 'webp']
    if (!allowed.includes(ext)) {
       return NextResponse.json({ error: 'Formato de imagen no permitido (Usa PNG, JPG o WEBP).' }, { status: 400 })
    }

    const baseName = originalName.split('.')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 30)
    const fileName = `${baseName}_${timestamp}.${ext}`
    const storagePath = `evidences/${user.id}/${fileName}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log(`[Upload] Uploading to Supabase Storage: ${storagePath} (${buffer.length} bytes)`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('evidences') // Bucket name
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('[Upload:Storage] Error:', uploadError)
      return NextResponse.json({ 
        error: 'No se pudo guardar la imagen en el almacenamiento en la nube.', 
        details: uploadError.message,
        hint: 'Asegúrate de que el bucket "evidences" exista en Supabase y sea público.'
      }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('evidences')
      .getPublicUrl(storagePath)

    console.log('[Upload] Storage upload successful:', publicUrl);

    // Save metadata to database
    try {
      await prisma.fileUpload.create({
        data: {
          userId: user.id,
          userName: userName || userEmail || 'Usuario',
          userEmail: userEmail || user.email || '',
          originalName: originalName,
          filename: fileName,
          title: title || 'Evidencia Misión Diaria',
          notes: notes || null,
          size: file.size,
          type: file.type,
          path: publicUrl
        }
      })
    } catch (prismaError: any) {
      console.error('[Upload:Prisma] Failed to save metadata:', prismaError.message)
      // We don't fail the whole request because the file IS on disk, 
      // but metadata is helpful. Actually, for consistency let's return error but it depends.
    }

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'File uploaded successfully',
      fileName: fileName,
      url: publicUrl,
    }, { status: 200 })

  } catch (error: any) {
    console.error('[Upload:Fatal] error:', error)
    return NextResponse.json({ 
      error: 'Error inesperado al subir el archivo.', 
      details: error.message
    }, { status: 500 })
  }
}

// Return 405 for unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

