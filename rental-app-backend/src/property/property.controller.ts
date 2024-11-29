

import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './schemas/property.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Expr } from 'aws-sdk/clients/cloudsearchdomain';

@Controller('listings')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async getAllProperties(@Query('lenderId') lenderId: string): Promise<Property[]> {
    return this.propertyService.findAll(lenderId);
  }

  @Post()
  async create(@Body() createPropertyDto: CreatePropertyDto){
    return this.propertyService.create(createPropertyDto);
  }
  

  @Get()
  async getAllProperties(): Promise<Property[]> {
  return this.propertyService.findAll();
}

  @Get(':id')
  async getPropertyById(@Param('id') id: string): Promise<Property> {
    return this.propertyService.findById(id);
  }

  @Put(':id')
  async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto
  ): Promise<Property> {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  async deleteProperty(@Param('id') id: string): Promise<void> {
    return this.propertyService.delete(id);
  }
}