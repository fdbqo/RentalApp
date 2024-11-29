import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

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

  async findById(id: string): Promise<Property> {
    try {
      const property = await this.propertyModel.findById(id).exec();
      if (!property) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
      return property;
    } catch (error) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    try {
      const updatedProperty = await this.propertyModel
        .findByIdAndUpdate(id, updatePropertyDto, { new: true })
        .exec();
      
      if (!updatedProperty) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
      
      return updatedProperty;
    } catch (error) {
      throw new NotFoundException(`Error updating property: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.propertyModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
    } catch (error) {
      throw new NotFoundException(`Error deleting property: ${error.message}`);
    }
  }
}