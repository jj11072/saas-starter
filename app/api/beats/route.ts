import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { beats, licenses } from "@/lib/db/schema";
import { getUser } from "@/lib/db/queries";
import { eq, and, desc } from "drizzle-orm";

export async function GET() {
  try {
    console.log('Fetching beats from database...');
    const beatsList = await db
      .select()
      .from(beats)
      .where(eq(beats.isPublished, true))
      .orderBy(desc(beats.createdAt));

    console.log('Found beats:', beatsList.length);
    return NextResponse.json(beatsList);
  } catch (error) {
    console.error('Error fetching beats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beats' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, genre, bpm, key, audioUrl, coverImageUrl } = body;

    const [beat] = await db
      .insert(beats)
      .values({
        title,
        description,
        price,
        genre,
        bpm,
        key,
        audioUrl,
        coverImageUrl,
        userId: user.id,
        isPublished: true,
      })
      .returning();

    // Create default license for the beat
    await db.insert(licenses).values({
      name: "Standard License",
      description: "Standard license for personal and commercial use",
      price: price,
      terms: "This license allows you to use the beat for personal and commercial projects. You may not resell or redistribute the beat.",
      beatId: beat.id,
    });

    return NextResponse.json(beat);
  } catch (error) {
    console.error("[BEATS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 