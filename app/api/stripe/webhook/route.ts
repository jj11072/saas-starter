import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { purchases, type NewPurchase } from '@/lib/db/schema';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      break;

    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Check if this is a beat purchase (has beatId in metadata)
      if (session.metadata?.beatId) {
        const newPurchase: NewPurchase = {
          userId: Number(session.metadata.userId),
          beatId: Number(session.metadata.beatId),
          licenseId: Number(session.metadata.licenseId),
          amount: (session.amount_total! / 100).toString(), // Convert from cents to string
          status: "completed",
          stripePaymentId: session.payment_intent as string,
        };
        await db.insert(purchases).values(newPurchase);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
