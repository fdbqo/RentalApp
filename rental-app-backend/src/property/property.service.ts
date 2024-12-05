import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import * as AWS from 'aws-sdk';
import { AnyArn } from 'aws-sdk/clients/groundstation';
import crypto from 'crypto';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class PropertyService {
  //AWS S3 Bucket Configuration
  AWS_S3_BUCKET_NAME = this.configService.get('S3_BUCKET_NAME');
  s3 = new AWS.S3({
    region: this.configService.get('S3_REGION'),
    accessKeyId: this.configService.get('S3_ACCESS_KEY'),
    secretAccessKey:this.configService.get('S3_SECRET_ACCESS_KEY') 
  });

  //Function for random name generation
  randomImageName = (bytes = 8) => crypto.randomBytes(bytes).toString('hex');
  
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    private configService: ConfigService
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

  

  async create(createPropertyDto: CreatePropertyDto, images: any[]): Promise<Property> {
    try {
      const uploadedImages = [];

      for(let i = 0; i < images.length; i++){
        const image = images[i];
        const s3Response = await this.uploadImage(image);
        if(!s3Response || !s3Response.Key){
          throw new Error('Error uploading image to S3');
        }
        uploadedImages.push({
          _id: new Types.ObjectId(),
          key: s3Response.Key,
          name: image.originalname,
          type: image.mimetype,
          uri: image.uri
        });
      }

      const propertyData = {
        ...createPropertyDto,
        lenderId: new Types.ObjectId(createPropertyDto.lenderId),
        images: uploadedImages
      };
      
      const createdProperty = new this.propertyModel(propertyData);
      return createdProperty.save();
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  //Upload Image to S3 Bucket
  //TODO: Implement for multiplle images
  async uploadImage(image){

    //Calls the s3_upload function to upload the image to the S3 bucket
    //Passes through image buffer, bucket name, random image name, and mimetype
    return await this.s3_upload(
      image.buffer,
      this.AWS_S3_BUCKET_NAME,
      this.randomImageName(),
      image.mimetype
    );
  }

  //Takes in the image buffer, bucket name, random image name, and mimetype
  async s3_upload(file, bucket, name, mimetype){

    const targetLocation = String(name);
    console.log('Target Location:', targetLocation);
    const params = {
      Bucket: bucket,
      Key: targetLocation,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.S3_REGION
      }
    };

    try{
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    }catch(e){
      console.log(e);
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