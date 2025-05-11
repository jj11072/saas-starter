import { NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { beats, purchases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all beats purchased by the user
    const purchasedBeats = await db
      .select({
        id: beats.id,
        title: beats.title,
        description: beats.description,
        price: beats.price,
        genre: beats.genre,
        bpm: beats.bpm,
        key: beats.key,
        audioUrl: beats.audioUrl,
        coverImageUrl: beats.coverImageUrl,
        purchaseDate: purchases.createdAt,
      })
      .from(purchases)
      .innerJoin(beats, eq(purchases.beatId, beats.id))
      .where(eq(purchases.userId, user.id));

    return NextResponse.json(purchasedBeats);
  } catch (error) {
    console.error("[LIBRARY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 