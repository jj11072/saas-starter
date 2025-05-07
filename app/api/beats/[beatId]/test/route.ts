import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { beats, licenses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { beatId: string } }
) {
  try {
    const beatId = parseInt(params.beatId);
    const beat = await db.select()
      .from(beats)
      .where(eq(beats.id, beatId))
      .leftJoin(licenses, eq(beats.id, licenses.beatId))
      .then((results) => {
        if (results.length === 0) return null;
        return {
          ...results[0].beats,
          licenses: results.map(r => r.licenses).filter(Boolean)
        };
      });

    return NextResponse.json({
      beat,
      env: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      }
    });
  } catch (error) {
    console.error("[BEAT_TEST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 