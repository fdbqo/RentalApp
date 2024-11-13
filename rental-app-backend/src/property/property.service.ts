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
      const propertyData = {
        ...createPropertyDto,
        lenderId: new Types.ObjectId(createPropertyDto.lenderId),
        images: createPropertyDto.images.map(img => ({
          _id: new Types.ObjectId(),
          uri: img.uri
        }))
      };
      
      const createdProperty = new this.propertyModel(propertyData);
      return createdProperty.save();
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }
}