import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Property } from './schemas/property.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Expr } from 'aws-sdk/clients/cloudsearchdomain';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createPropertyDto: CreatePropertyDto, @UploadedFile() image: Express.Multer.File){
    return this.propertyService.create(createPropertyDto, image);
  }
  

  @Get()
  async getAllProperties(): Promise<Property[]> {
  return this.propertyService.findAll();
}
}