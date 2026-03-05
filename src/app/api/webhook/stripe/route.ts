import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local manually to ensure it's available for this route
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export async function POST(req: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-01-27.acacia" as any,
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return new NextResponse("Webhook Secret or Signature missing", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.error("Webhook signature verification failed:", error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                // Recuperar el userId pasado en checkout
                const userId = session.client_reference_id || session.metadata?.userId;
                const subscriptionId = session.subscription as string;
                const customerId = session.customer as string;

                if (userId && subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

                    await prisma.profile.update({
                        where: { userId },
                        data: {
                            stripeCustomerId: customerId,
                            subscriptionId: subscription.id,
                            subscriptionStatus: subscription.status,
                            planId: session.metadata?.plan,
                            subscriptionEnds: new Date(subscription.current_period_end * 1000),
                        },
                    });
                    console.log(`[Stripe Webhook] Suscripción creada para usuario ${userId}`);
                } else {
                    console.warn("[Stripe Webhook] Usuario no identificado en el Checkout Session");
                }
                break;
            }
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object as any;

                await prisma.profile.updateMany({
                    where: { subscriptionId: subscription.id },
                    data: {
                        subscriptionStatus: subscription.status,
                        subscriptionEnds: new Date(subscription.current_period_end * 1000),
                    },
                });
                console.log(`[Stripe Webhook] Suscripción ${subscription.id} actualizada a ${subscription.status}`);
                break;
            }
            default:
                console.log(`[Stripe Webhook] Evento no manejado: ${event.type}`);
        }
    } catch (error: any) {
        console.error("[Stripe Webhook] Error al procesar:", error);
        return new NextResponse("Webhook error interno", { status: 500 });
    }

    return NextResponse.json({ received: true });
}
