import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  async findAll(lenderId: string): Promise<Property[]> {    
    try {      
      const objectId = new Types.ObjectId(lenderId);
      
      const properties = await this.propertyModel.find({ lenderId: objectId }).exec();
      
      return properties;
    } catch (error) {
      return [];
    }
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      console.log('Received DTO:', createPropertyDto);
      
      const propertyData = {
        ...createPropertyDto,
        lenderId: new Types.ObjectId(createPropertyDto.lenderId),
        images: createPropertyDto.images
      };
      
      console.log('Creating property with data:', propertyData);
      
      const createdProperty = new this.propertyModel(propertyData);
      const savedProperty = await createdProperty.save();
      console.log('Saved property:', savedProperty);
      
      return savedProperty;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }
}