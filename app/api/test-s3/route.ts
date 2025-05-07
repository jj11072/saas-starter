import { NextResponse } from "next/server";
import { uploadToS3, getSignedDownloadUrl } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log('S3 Configuration:', {
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    });

    // Create a test file
    const testContent = "This is a test file for S3 integration";
    const buffer = Buffer.from(testContent);
    
    // Upload to S3
    const key = `test-${Date.now()}.txt`;
    console.log('Attempting to upload test file:', key);
    
    const uploadUrl = await uploadToS3(buffer, key, "text/plain");
    console.log('Upload successful:', uploadUrl);
    
    // Get signed download URL (expires in 1 hour)
    const downloadUrl = await getSignedDownloadUrl(key);
    console.log('Generated signed URL:', downloadUrl);
    
    return NextResponse.json({
      success: true,
      uploadUrl,
      downloadUrl,
      key
    });
  } catch (error) {
    console.error("[S3_TEST] Detailed error:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: "Failed to test S3 integration",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 