# Stripe Payment Integration Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Secret Key (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...

# Your app URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

## Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** > **API keys**
3. Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)
4. Add it to your `.env.local` file

## Testing

Use Stripe's test card numbers:
- **Card**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

## Current Configuration

- **Plan**: Plan Emprendedor
- **Price**: $99/month (recurring subscription)
- **Currency**: USD
- **Payment Method**: Card

## Payment Flow

1. User clicks "Plan Emprendedor" on landing page → redirects to `/payment`
2. User fills in name and email
3. User clicks "Completar pago" → creates Stripe Checkout session
4. User is redirected to Stripe Checkout
5. After payment:
   - **Success** → `/payment/success`
   - **Cancel** → `/payment/cancel`

