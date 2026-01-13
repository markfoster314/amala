import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({
  region: process.env['AWS_REGION'] ?? 'us-east-1',
});

export const THUMBNAILS_BUCKET =
  process.env['AWS_S3_THUMBNAILS_BUCKET'] ?? 'amala-thumbnails';

/**
 * Upload a thumbnail image to S3
 * @param file Buffer containing the file data
 * @param contentType MIME type of the file (e.g., 'image/jpeg', 'image/png')
 * @returns Public URL of the uploaded file
 */
export async function uploadThumbnail(
  file: Buffer,
  contentType: string
): Promise<string> {
  if (!THUMBNAILS_BUCKET) {
    throw new Error(
      'AWS_S3_THUMBNAILS_BUCKET environment variable is required'
    );
  }

  // Generate a unique filename
  const extension = contentType.split('/')[1] ?? 'jpg';
  const filename = `${randomUUID()}.${extension}`;
  const key = `thumbnails/${filename}`;

  const command = new PutObjectCommand({
    Bucket: THUMBNAILS_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
    // Note: ACL is deprecated. Ensure bucket has public read policy configured in AWS Console
    // Bucket policy should allow public read: { "Effect": "Allow", "Principal": "*", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::bucket-name/*" }
  });

  await s3Client.send(command);

  // Construct public URL
  const region = process.env['AWS_REGION'] ?? 'us-east-1';
  const url = `https://${THUMBNAILS_BUCKET}.s3.${region}.amazonaws.com/${key}`;

  return url;
}
