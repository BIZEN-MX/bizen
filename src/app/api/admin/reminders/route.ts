import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getResend } from '@/lib/resend';
import { generatePersonalizedMessage } from '@/lib/ai/personalized-email';
import { BizenReminderEmail } from '@/lib/emails/reminder-email';

/**
 * API para enviar recordatorios personalizados usando Gemini y Resend.
 * Úsala para re-enganchar usuarios que llevan tiempo sin entrar.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetEmail, daysInactive = 3 } = body;

    let profiles = [];

    if (targetEmail) {
      // 1. Caso de prueba: enviar a un correo específico
      const user = await prisma.authUser.findFirst({
        where: { email: targetEmail }
      });

      if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }

      const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
      });

      if (profile) {
        profiles.push({ ...profile, email: user.email });
      }
    } else {
      // 2. Caso real: buscar usuarios inactivos
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - daysInactive);

      const inactiveProfiles = await prisma.profile.findMany({
        where: {
          lastActive: { lt: dateLimit }
        },
        take: 5 // Límite de seguridad para el plan gratuito
      });

      // Obtener los correos de AuthUser
      for (const p of inactiveProfiles) {
        const user = await prisma.authUser.findUnique({
          where: { id: p.userId },
          select: { email: true }
        });
        if (user?.email) {
          profiles.push({ ...p, email: user.email });
        }
      }
    }

    if (profiles.length === 0) {
      return NextResponse.json({ message: 'No se encontraron usuarios para notificar.' });
    }

    const resend = await getResend();
    const summary = [];

    for (const user of profiles) {
      // Usar Gemini para generar el mensaje de Billy
      const context = `Nivel: ${user.level}, XP: ${user.xp}, Rol: ${user.role}.`;
      const billyMessage = await generatePersonalizedMessage(user.fullName, 'reminder', context);

      // Enviar via Resend
      const { data, error } = await resend.emails.send({
        from: 'Billy de BIZEN <billy@bizen.mx>', // Cambiar una vez validado el dominio
        to: [user.email],
        subject: `¡Ey ${user.fullName.split(' ')[0]}! No te me pierdas... 🚀`,
        html: BizenReminderEmail({
          name: user.fullName,
          personalizedMessage: billyMessage,
          ctaUrl: 'https://bizen.mx/dashboard'
        }),
      });

      summary.push({
        email: user.email,
        sent: !error,
        id: data?.id,
        error: error
      });
    }

    return NextResponse.json({
      success: true,
      processed: summary.length,
      details: summary
    });

  } catch (error: any) {
    console.error('Reminder API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
