import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.local manually to ensure it's available for this route
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-01-27.acacia' as any,
    typescript: true,
  })
}

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
    if (!secretKey) {
      console.error('[Stripe] Missing STRIPE_SECRET_KEY in environment')
      return NextResponse.json({ error: 'Configuración incompleta: STRIPE_SECRET_KEY no está definida en el servidor.' }, { status: 500 })
    }

    const body = await request.json()
    const { email, name, planName = 'Plan Emprendedor', userId } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia' as any,
      typescript: true,
    })

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: planName,
              description: 'Suscripción BIZEN',
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: 17900, // $179.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      // Solo enviar client_reference_id si existe un userId válido (no null/undefined)
      ...(userId ? { client_reference_id: String(userId) } : {}),
      metadata: {
        customer_name: name || "",
        plan: planName,
        userId: userId ? String(userId) : "",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/payment/cancel`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error al crear sesión de pago:', error)
    return NextResponse.json(
      {
        error: error.message || 'Error interno al procesar el pago',
        details: error.type || 'UnknownStripeError'
      },
      { status: 500 }
    )
  }
}

