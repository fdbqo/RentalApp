import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Param,
  Query,
  UseGuards,
  Req,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  }))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB limit
        ],
      }),
    ) file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    const key = await this.uploadService.uploadFile(file, folder);
    const url = await this.uploadService.getSignedUrl(key);
    return { key, url };
  }

  @Get(':key(*)')
  async getSignedUrl(@Param('key') key: string) {
    try {
      console.log('Getting signed URL for key:', key);
      const decodedKey = decodeURIComponent(key);
      const url = await this.uploadService.getSignedUrl(decodedKey);
      return { url };
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  }
} 