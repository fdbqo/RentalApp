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
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    const key = await this.uploadService.uploadFile(file, folder);
    const url = await this.uploadService.getSignedUrl(key);
    return { key, url };
  }

  @Get('*')
  async getSignedUrl(@Req() request: Request) {
    const key = request.url.replace('/upload/', '');
    const decodedKey = decodeURIComponent(key);
    const url = await this.uploadService.getSignedUrl(decodedKey);
    return { url };
  }
} 