import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { DistanceService } from 'src/google/google.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    private distanceService: DistanceService
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

      await this.distanceService.setDistanceFromUniversity(createdProperty);

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

      await this.distanceService.setDistanceFromUniversity(updatedProperty);

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

  async findAllAvailable(filters?: any): Promise<Property[]> {    
    try {      
      const query: any = {};
      
      if (filters?.searchQuery) {
        query.$or = [
          { 'houseAddress.townCity': { $regex: filters.searchQuery, $options: 'i' } },
          { 'houseAddress.county': { $regex: filters.searchQuery, $options: 'i' } },
          { 'houseAddress.addressLine1': { $regex: filters.searchQuery, $options: 'i' } },
          { 'houseAddress.addressLine2': { $regex: filters.searchQuery, $options: 'i' } }
        ];
      }

      // Handle price range
      if (filters?.minPrice || filters?.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = parseInt(filters.minPrice);
        if (filters.maxPrice) query.price.$lte = parseInt(filters.maxPrice);
      }

      // Handle beds filter
      if (filters?.beds) {
        const totalBeds = parseInt(filters.beds);
        query.$expr = {
          $gte: [{ $add: ['$singleBedrooms', '$doubleBedrooms'] }, totalBeds]
        };
      }

      // Handle distance filter
      if (filters?.distance) {
        query.distanceFromUniversity = { 
          $lte: parseInt(filters.distance)
        };
      }

      return await this.propertyModel.find(query).exec();
    } catch (error) {
      console.error('Error finding properties:', error);
      return [];
    }
  }

  async findByLenderId(lenderId: string): Promise<Property[]> {    
    try {      
      const objectId = new Types.ObjectId(lenderId);
      return await this.propertyModel.find({ lenderId: objectId }).exec();
    } catch (error) {
      return [];
    }
  }
}