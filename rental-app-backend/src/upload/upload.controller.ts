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

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB limit
    }
  }))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }), // 500MB limit
        ],
      }),
    ) file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    const key = await this.uploadService.uploadFile(file, folder);
    const url = this.uploadService.getPublicUrl(key);
    return { key, url };
  }

  @Get('*path')
  async getImageUrl(@Param('path') key: string) {
    try {
      const decodedKey = decodeURIComponent(key);
      const url = this.uploadService.getPublicUrl(decodedKey);
      return { url };
    } catch (error) {
      console.error('Error getting public URL:', error);
      throw error;
    }
  }
} 