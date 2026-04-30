import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // 1. Verificar Autenticación
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized: Please login to access BIZEN content.', { status: 401 });
    }

    // 2. Verificar Permisos / Paywall (Usamos la cookie o el perfil)
    let hasAccess = request.cookies.get('bizen_has_access')?.value === '1';
    
    // Si no tiene el cookie de acceso general, comprobamos si compró el ebook específico
    if (!hasAccess) {
      const SLUG_TO_PRODUCT_ID: Record<string, number> = {
        "Bolsa_de_Valores_desde_Cero": 5,
        "Bizen_Ebook_Inflacion_vs_Rendimiento_2": 6,
        "Finanzas_Personales_desde_Cero": 7,
        "Bizen_ElCostoDeEsperar_3": 8,
        "BIZEN_Historia_del_Dinero": 20,
      };

      const productId = SLUG_TO_PRODUCT_ID[slug];
      
      if (productId) {
        const { prisma } = await import('@/lib/prisma');
        const inventoryItem = await prisma.userInventoryItem.findFirst({
          where: {
            userId: userId,
            productId: String(productId)
          }
        });
        
        if (inventoryItem) {
          hasAccess = true;
        }
      }
    }

    // Si no tiene acceso premium ni ha comprado el ebook, bloqueamos
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
