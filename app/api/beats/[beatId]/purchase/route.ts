import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { beats, licenses } from "@/lib/db/schema";
import { getUser } from "@/lib/db/queries";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function GET(
  req: Request,
  context: { params: { beatId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const beatId = parseInt(context.params.beatId);
    if (Number.isNaN(beatId)) {
      return new NextResponse("Invalid Beat ID", { status: 400 });
    }

    const beat = await db
      .select()
      .from(beats)
      .where(eq(beats.id, beatId))
      .leftJoin(licenses, eq(beats.id, licenses.beatId))
      .then((results) => {
        if (results.length === 0) return null;
        return {
          ...results[0].beats,
          licenses: results.map((r) => r.licenses).filter(Boolean),
        };
      });

    if (!beat) {
      return new NextResponse("Beat not found", { status: 404 });
    }

    const license = beat.licenses[0];
    if (!license) {
      return new NextResponse("No license available", { status: 400 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: beat.title,
              description: `License: ${license.name}`,
            },
            unit_amount: Math.round(Number(license.price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/beats/${beatId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/beats/${beatId}`,
      metadata: {
        beatId: beat.id.toString(),
        licenseId: license.id.toString(),
        userId: user.id.toString(),
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("[BEAT_PURCHASE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
