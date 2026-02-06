import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contacto@bizen.mx'
const CONTACT_FROM = process.env.RESEND_FROM || 'BIZEN Web <onboarding@resend.dev>'

async function sendContactEmail(name: string, email: string, message: string) {
  const { resend } = await import('@/lib/resend')
  const { data, error } = await resend.emails.send({
    from: CONTACT_FROM,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `Contacto BIZEN: ${name}`,
    html: [
      `<p><strong>Nombre:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Mensaje:</strong></p><pre>${escapeHtml(message)}</pre>`,
    ].join(''),
  })
  if (error) throw error
  return data
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, message: 'Cuerpo de la solicitud inválido.' },
        { status: 400 }
      )
    }
    if (body == null || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: 'Por favor completa todos los campos requeridos.' },
        { status: 400 }
      )
    }
    const { name, email, message } = body as Record<string, unknown>

    const trimmedName = String(name ?? '').trim()
    const trimmedEmail = String(email ?? '').trim().toLowerCase()
    const trimmedMessage = String(message ?? '').trim()

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json(
        {
          success: false,
          message: 'Por favor completa todos los campos requeridos.',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Por favor ingresa un email válido.',
        },
        { status: 400 }
      )
    }

    let resendFailed = false
    let dbFailed = false

    // 1) Try Resend first when key is set (so form works even if DB is broken)
    if (process.env.RESEND_API_KEY) {
      try {
        const data = await sendContactEmail(trimmedName, trimmedEmail, trimmedMessage)
        // Optionally save to DB as well (non-blocking)
        if (process.env.DATABASE_URL) {
          import('@/lib/prisma').then(({ prisma }) =>
            prisma.contactMessage.create({
              data: { name: trimmedName, email: trimmedEmail, message: trimmedMessage },
            })
          ).catch((e) => console.error('[/api/contact] DB save (optional) failed:', e))
        }
        return NextResponse.json(
          {
            success: true,
            message: '¡Gracias por contactarnos! Te responderemos pronto.',
            data: { id: data?.id },
          },
          { status: 201 }
        )
      } catch (emailError: unknown) {
        resendFailed = true
        const err = emailError as { message?: string }
        console.error('[/api/contact] Resend failed:', err?.message ?? emailError)
      }
    }

    // 2) Fallback: save to DB only
    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import('@/lib/prisma')
        const newMessage = await prisma.contactMessage.create({
          data: {
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage,
          },
        })
        return NextResponse.json(
          {
            success: true,
            message: '¡Gracias por contactarnos! Te responderemos pronto.',
            data: { id: newMessage.id },
          },
          { status: 201 }
        )
      } catch (dbError: unknown) {
        dbFailed = true
        const err = dbError as { code?: string; message?: string }
        console.error('[/api/contact] DB save failed:', err?.code ?? err?.message ?? dbError)
      }
    }

    const hasResend = Boolean(process.env.RESEND_API_KEY)
    const hasDb = Boolean(process.env.DATABASE_URL)
    const reason =
      !hasResend && !hasDb
        ? 'not_configured'
        : resendFailed && dbFailed
          ? 'resend_failed_and_db_failed'
          : resendFailed
            ? 'resend_failed'
            : dbFailed
              ? 'db_failed'
              : 'not_configured'
    console.error('[/api/contact] 503 reason:', reason, { hasResend, hasDb, resendFailed, dbFailed })

    return NextResponse.json(
      {
        success: false,
        message: 'El servicio de contacto no está configurado. Por favor escribe a ' + CONTACT_EMAIL,
        contactEmail: CONTACT_EMAIL,
        reason,
      },
      { status: 503 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('[/api/contact] Unexpected error:', err?.message ?? error);
    return NextResponse.json(
      { success: false, message: 'Error al enviar el mensaje. Por favor intenta de nuevo más tarde.' },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


