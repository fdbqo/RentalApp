import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.AWS_BUCKET_NAME;
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return key;
  }

  async getSignedUrl(key: string): Promise<string> {
    try {
      console.log('Getting signed URL for key:', key);
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      // Increase expiration time to 24 hours
      return await getSignedUrl(this.s3Client, command, { expiresIn: 86400 });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }
} 