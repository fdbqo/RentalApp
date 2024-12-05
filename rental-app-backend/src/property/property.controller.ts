import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Property } from './schemas/property.schema';

@Controller('listings')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async getAllProperties(
    @Query('lenderId') lenderId?: string,
    @Query() filters?: any
  ): Promise<Property[]> {
    if (lenderId) {
      return this.propertyService.findByLenderId(lenderId);
    }
    return this.propertyService.findAllAvailable(filters);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 8))
  async create(@Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() images: Express.Multer.File[]) {
    return this.propertyService.create(createPropertyDto, images);
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