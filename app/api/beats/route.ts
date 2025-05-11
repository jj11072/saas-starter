import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { beats, licenses } from "@/lib/db/schema";
import { getUser } from "@/lib/db/queries";
import { eq, and, desc } from "drizzle-orm";
import { getSignedDownloadUrl } from "@/lib/s3";

export async function GET() {
  try {
    console.log('Fetching beats from database...');
    const beatsList = await db
      .select()
      .from(beats)
      .where(eq(beats.isPublished, true))
      .orderBy(desc(beats.createdAt));

    console.log('Found beats:', beatsList.length);

    // Generate signed URLs for each beat's audio and cover image
    const beatsWithSignedUrls = await Promise.all(
      beatsList.map(async (beat) => {
        try {
          // Handle audio URL
          let audioUrl = beat.audioUrl;
          if (beat.audioUrl) {
            const audioKey = beat.audioUrl.split('/').pop();
            if (audioKey) {
              audioUrl = await getSignedDownloadUrl(audioKey, 3600); // 1 hour expiration
              console.log('Generated signed audio URL:', {
                beatId: beat.id,
                originalUrl: beat.audioUrl,
                signedUrl: audioUrl
              });
            }
          }

          // Handle cover image URL
          let coverImageUrl = beat.coverImageUrl;
          if (beat.coverImageUrl) {
            const coverKey = beat.coverImageUrl.split('/').pop();
            if (coverKey) {
              coverImageUrl = await getSignedDownloadUrl(coverKey, 86400); // 24 hour expiration
              console.log('Generated signed cover URL:', {
                beatId: beat.id,
                originalUrl: beat.coverImageUrl,
                signedUrl: coverImageUrl
              });
            }
          }

          return {
            ...beat,
            audioUrl,
            coverImageUrl,
          };
        } catch (error) {
          console.error('Error generating signed URLs for beat:', {
            beatId: beat.id,
            error: error
          });
          return beat;
        }
      })
    );

    console.log('Returning beats with signed URLs');
    return NextResponse.json(beatsWithSignedUrls);
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