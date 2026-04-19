import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local manually to ensure it's available for this route
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: { stripeCustomerId: true },
        });

        if (!profile || !profile.stripeCustomerId) {
            return NextResponse.json({ error: "No Stripe customer found for this user in DB" }, { status: 400 });
        }

        if (profile.stripeCustomerId.startsWith("cus_test_admin")) {
            return NextResponse.json({
                error: "Perfil en modo Administrador. El sistema reconoce un pago ficticio para mostrarte el botón, pero no se puede abrir el portal de Stripe porque no existe una tarjeta bancaria real vinculada."
            }, { status: 400 });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2025-01-27.acacia" as any,
        });

        // Dynamic Base URL detection
        const origin = req.headers.get('origin') || 'https://bizen.mx'
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || origin).replace(/\/$/, '')

        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripeCustomerId,
            return_url: `${baseUrl}/profile`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Error creating portal session:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
