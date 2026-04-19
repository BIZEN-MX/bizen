import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createSupabaseServer();
    
    // 1. Verificar Autenticación
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse('Unauthorized: Please login to access BIZEN content.', { status: 401 });
    }

    // 2. Verificar Permisos / Paywall (Usamos la cookie o el perfil)
    const hasAccess = request.cookies.get('bizen_has_access')?.value === '1';
    
    // Si no tiene acceso premium, bloqueamos (a menos que seas admin)
    // Nota: Aquí podrías añadir excepciones para ciertos PDFs gratuitos si quisieras
    if (!hasAccess) {
      return new NextResponse('Premium Access Required', { status: 403 });
    }

    // 3. Buscar el archivo en la zona segura
    const fileName = slug.endsWith('.pdf') ? slug : `${slug}.pdf`;
    const filePath = path.join(process.cwd(), 'src/assets/premium-content', fileName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // 4. Entregar el archivo como un stream
    const fileBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'X-Content-Type-Options': 'nosniff', // Seguridad extra
      },
    });

  } catch (error) {
    console.error('❌ Error serving protected PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
