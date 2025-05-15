import { NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { beats, licenses } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    const { 
      title, 
      description, 
      price, 
      genre, 
      bpm, 
      key, 
      audioUrl, 
      coverImageUrl 
    } = data;

    // Validate required fields
    if (!title || !description || !price || !genre || !bpm || !key || !audioUrl) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    // Validate price
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return new NextResponse("Invalid price", { status: 400 });
    }

    // Create beat record in database
    console.log('Creating beat record in database...');
    const [beat] = await db
      .insert(beats)
      .values({
        title,
        description,
        price: price,
        genre,
        bpm: parseInt(bpm),
        key,
        audioUrl,
        coverImageUrl,
        userId: user.id,
        isPublished: true,
      })
      .returning();

    console.log('Beat record created:', beat.id);

    // Create default license for the beat
    console.log('Creating default license...');
    await db.insert(licenses).values({
      name: "Standard License",
      description: "Standard license for personal and commercial use",
      price: price,
      terms: "This license allows you to use the beat for personal and commercial projects. You may not resell or redistribute the beat.",
      beatId: beat.id,
    });

    console.log('License created successfully');
    return NextResponse.json(beat);
  } catch (error) {
    console.error("[BEATS_UPLOAD] Detailed error:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
} 