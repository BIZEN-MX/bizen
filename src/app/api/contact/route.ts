import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export const runtime = 'nodejs'

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contacto@bizen.mx'
const CONTACT_FROM = process.env.RESEND_FROM || 'BIZEN Web <onboarding@resend.dev>'

async function sendContactEmail(name: string, email: string, message: string) {
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
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Por favor completa todos los campos requeridos.',
        },
        { status: 400 }
      )
    }

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedMessage = message.trim()

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

    // 1) Try Resend first when key is set (so form works even if DB is broken)
    if (process.env.RESEND_API_KEY) {
      try {
        const data = await sendContactEmail(trimmedName, trimmedEmail, trimmedMessage)
        // Optionally save to DB as well (non-blocking)
        if (process.env.DATABASE_URL) {
          prisma.contactMessage.create({
            data: { name: trimmedName, email: trimmedEmail, message: trimmedMessage },
          }).catch((e) => console.error('[/api/contact] DB save (optional) failed:', e))
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
        console.error('[/api/contact] Resend failed:', emailError)
      }
    }

    // 2) Fallback: save to DB only
    if (process.env.DATABASE_URL) {
      try {
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
        const err = dbError as { code?: string; message?: string }
        console.error('[/api/contact] DB save failed:', err?.code ?? err?.message ?? dbError)
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: 'El servicio de contacto no está configurado. Por favor escribe a ' + CONTACT_EMAIL,
      },
      { status: 503 }
    )
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('[/api/contact] Unexpected error:', err?.message ?? error)
    return NextResponse.json(
      { success: false, message: 'Error al enviar el mensaje. Por favor intenta de nuevo más tarde.' },
      { status: 500 }
    )
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}


