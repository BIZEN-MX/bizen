import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { cookies } from 'next/headers'

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
  })
}

/**
 * POST /api/payment/verify-session
 * Verifies a Stripe Checkout session and sets bizen_has_access cookie if payment succeeded.
 * Called by /payment/success after user returns from Stripe.
 */
export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json()
    if (!session_id || typeof session_id !== 'string') {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 })
    }

    const stripe = getStripeClient()
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const cookieStore = await cookies()
    cookieStore.set('bizen_has_access', '1', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/payment/verify-session] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 500 }
    )
  }
}
