import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Por favor ingresa un email válido.',
        },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createSupabaseServer()

    // Insert message into database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error saving contact message:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Error al enviar el mensaje. Por favor intenta de nuevo más tarde.',
        },
        { status: 500 }
      )
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: '¡Gracias por contactarnos! Te responderemos pronto.',
        data: {
          id: data.id,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in contact API:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error inesperado. Por favor intenta de nuevo más tarde.',
      },
      { status: 500 }
    )
  }
}

