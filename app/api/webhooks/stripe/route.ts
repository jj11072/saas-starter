import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/payments/stripe";
import { db } from "@/lib/db/drizzle";
import { purchases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("[STRIPE_WEBHOOK]", error);
    return new NextResponse("Webhook signature verification failed", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Handle beat purchase
        if (session.metadata?.beatId) {
          const beatId = parseInt(session.metadata.beatId);
          const userId = parseInt(session.metadata.userId);
          const licenseId = parseInt(session.metadata.licenseId);

          if (Number.isNaN(beatId) || Number.isNaN(userId) || Number.isNaN(licenseId)) {
            console.error("[STRIPE_WEBHOOK] Invalid metadata:", session.metadata);
            return new NextResponse("Invalid metadata", { status: 400 });
          }

          // Check if purchase already exists
          const existingPurchase = await db.query.purchases.findFirst({
            where: eq(purchases.stripePaymentId, session.payment_intent as string),
          });

          if (existingPurchase) {
            console.log("[STRIPE_WEBHOOK] Purchase already exists:", existingPurchase.id);
            return new NextResponse("Purchase already exists", { status: 200 });
          }

          // Create purchase record
          await db.insert(purchases).values({
            userId,
            beatId,
            licenseId,
            stripePaymentId: session.payment_intent as string,
            amount: session.amount_total ? (session.amount_total / 100).toString() : "0",
            status: "completed",
          });

          console.log("[STRIPE_WEBHOOK] Created purchase for beat:", beatId);
        }
        break;
      }
      default:
        console.log(`[STRIPE_WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK] Error processing webhook:", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
} 