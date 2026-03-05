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
    const { email, name, planName = 'Plan Emprendedor', userId } = await request.json()

    const stripe = getStripeClient()

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planName,
              description: 'Suscripción BIZEN',
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: 9900, // $99.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      client_reference_id: userId, // Very important for webhooks
      metadata: {
        customer_name: name,
        plan: planName,
        userId: userId || "", // Fallback as string if omitted
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/payment/cancel`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

