import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// These environment variables should only be accessed on the server side
const getS3Config = () => {
  if (typeof window !== 'undefined') {
    throw new Error('S3 configuration can only be accessed on the server side');
  }

  if (!process.env.AWS_REGION) {
    throw new Error("AWS_REGION environment variable is not set");
  }

  if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error("AWS_ACCESS_KEY_ID environment variable is not set");
  }

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_SECRET_ACCESS_KEY environment variable is not set");
  }

  if (!process.env.AWS_BUCKET_NAME) {
    throw new Error("AWS_BUCKET_NAME environment variable is not set");
  }

  return {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    bucket: process.env.AWS_BUCKET_NAME,
  };
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export { s3Client };

// Helper function to determine content type
function getContentType(filename: string): string {
  const extension = filename.toLowerCase().split('.').pop();
  switch (extension) {
    case 'wav':
      return 'audio/wav';
    case 'mp3':
      return 'audio/mpeg';
    case 'm4a':
      return 'audio/mp4';
    case 'ogg':
      return 'audio/ogg';
    default:
      return 'audio/wav'; // Default to wav if unknown
  }
}

export async function uploadToS3(
  fileBuffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const config = getS3Config();

  if (!fileBuffer || !key || !contentType) {
    throw new Error('Missing required parameters for S3 upload');
  }

  const finalContentType = getContentType(key);

  console.log('Uploading to S3:', {
    key,
    contentType: finalContentType,
    fileSize: fileBuffer.length
  });

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: finalContentType,
    ContentDisposition: 'inline',
    ACL: 'public-read', // Make the object publicly readable
  });

  try {
    await s3Client.send(command);
    const url = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
    
    console.log('Successfully uploaded to S3:', {
      key,
      url,
      contentType: finalContentType
    });

    return url;
  } catch (error) {
    console.error('Error uploading to S3:', {
      key,
      error,
      bucket: config.bucket,
      region: config.region
    });
    throw error;
  }
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600) {
  const contentType = getContentType(key);
  
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ResponseContentDisposition: 'inline',
    ResponseCacheControl: 'no-cache',
    ResponseContentType: contentType,
    ResponseExpires: new Date(Date.now() + expiresIn * 1000),
  });

  try {
    // Generate a signed URL that's valid for the specified duration
    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn,
      signableHeaders: new Set(['host', 'x-amz-content-sha256', 'x-amz-date']),
    });
    
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
} 