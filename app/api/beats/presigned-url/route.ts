import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { getUser } from "@/lib/db/queries";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { filename, contentType } = await req.json();
    
    if (!filename || !contentType) {
      return new NextResponse("Filename and content type are required", { status: 400 });
    }

    // Generate a unique key for the file
    const key = `beats/${user.id}/${Date.now()}-${filename}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return NextResponse.json({ 
      signedUrl, 
      key,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    });
  } catch (error) {
    console.error("[PRESIGNED_URL] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 