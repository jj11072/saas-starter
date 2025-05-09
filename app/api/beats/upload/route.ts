import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { getUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { beats, licenses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const coverImage = formData.get("image") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const genre = formData.get("genre") as string;
    const bpm = formData.get("bpm") as string;
    const key = formData.get("key") as string;

    console.log('Received form data:', {
      hasAudioFile: !!audioFile,
      hasCoverImage: !!coverImage,
      title,
      price,
      genre,
      bpm,
      key
    });

    // Validate required fields
    if (!audioFile) {
      return new NextResponse("Audio file is required", { status: 400 });
    }

    if (!title || !description || !price || !genre || !bpm || !key) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    // Validate price
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return new NextResponse("Invalid price", { status: 400 });
    }

    // Validate file types
    if (!audioFile.type.startsWith('audio/')) {
      return new NextResponse("Invalid audio file type", { status: 400 });
    }

    if (coverImage && !coverImage.type.startsWith('image/')) {
      return new NextResponse("Invalid image file type", { status: 400 });
    }

    // Generate unique filenames
    const audioExt = audioFile.name.split(".").pop();
    const imageExt = coverImage?.name.split(".").pop();
    const audioFilename = `${uuidv4()}.${audioExt}`;
    const imageFilename = coverImage ? `${uuidv4()}.${imageExt}` : null;

    // Save files
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const imageBuffer = coverImage ? Buffer.from(await coverImage.arrayBuffer()) : null;

    const audioPath = join(process.cwd(), "public", "uploads", "audio", audioFilename);
    const imagePath = imageFilename ? join(process.cwd(), "public", "uploads", "images", imageFilename) : null;

    await writeFile(audioPath, audioBuffer);
    if (imagePath && imageBuffer) {
      await writeFile(imagePath, imageBuffer);
    }

    // Upload audio file to S3
    try {
      console.log('Starting audio file upload...');
      const audioKey = `beats/${user.id}/${Date.now()}-${audioFilename}`;
      console.log('Generated audio key:', audioKey);

      const audioUrl = await uploadToS3(audioBuffer, audioKey, audioFile.type);
      console.log('Audio upload successful:', audioUrl);

      // Upload cover image if provided
      let coverImageUrl = null;
      if (coverImage && imageBuffer && imageFilename) {
        console.log('Starting cover image upload...');
        const imageKey = `covers/${user.id}/${Date.now()}-${imageFilename}`;
        console.log('Generated image key:', imageKey);
        
        coverImageUrl = await uploadToS3(imageBuffer, imageKey, coverImage.type);
        console.log('Cover image upload successful:', coverImageUrl);
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
      console.error("[S3_UPLOAD] Detailed error:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        audioFile: {
          name: audioFile.name,
          type: audioFile.type,
          size: audioFile.size
        },
        coverImage: coverImage ? {
          name: coverImage.name,
          type: coverImage.type,
          size: coverImage.size
        } : null
      });
      return new NextResponse("Failed to upload files", { status: 500 });
    }
  } catch (error) {
    console.error("[BEATS_UPLOAD] Detailed error:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
} 