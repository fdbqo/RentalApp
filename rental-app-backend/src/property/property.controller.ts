import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './schemas/property.schema';
import { GetChatDto } from 'src/chats/dto/get-chat.dto';
import { ChatsService } from 'src/chats/chats.service';

@Controller('listings')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService, private readonly chatsService:ChatsService) {}

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
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
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
  @Get(':id/chats')
  async getPropertyChats(
    @Param('id') id: string,
    @Query() getChatDto: GetChatDto
  ) {
    return this.chatsService.findByProperty(id, new GetChatDto(getChatDto));
  }
}