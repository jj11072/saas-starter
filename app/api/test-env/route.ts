import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME,
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
  });
} 