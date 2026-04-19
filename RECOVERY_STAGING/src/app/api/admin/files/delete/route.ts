import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user (for admin verification)
    const supabase = await createSupabaseServer();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Parse request body
    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json({ error: 'ID de archivo requerido' }, { status: 400 });
    }

    // Get file info from database
    const file = await prisma.fileUpload.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    // Delete physical file from disk
    const filePath = join(process.cwd(), 'public', file.path);
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
        console.log('✅ Physical file deleted:', filePath);
      } catch (error) {
        console.error('⚠️ Error deleting physical file:', error);
        // Continue to delete database record even if physical file deletion fails
      }
    } else {
      console.log('⚠️ Physical file not found:', filePath);
    }

    // Delete database record
    await prisma.fileUpload.delete({
      where: { id: fileId }
    });

    console.log('✅ Database record deleted for file:', fileId);

    return NextResponse.json({
      success: true,
      message: 'Archivo eliminado correctamente'
    });

  } catch (error) {
    console.error('❌ Error deleting file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Error al eliminar el archivo: ' + errorMessage },
      { status: 500 }
    );
  }
}

