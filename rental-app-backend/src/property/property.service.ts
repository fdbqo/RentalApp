import { Injectable, NotFoundException, Req, Res, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from '../property/schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import * as AWS from 'aws-sdk';
import { AnyArn } from 'aws-sdk/clients/groundstation';
import crypto from 'crypto';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class PropertyService {

  //Creates Logs, not 100% sure on its necessity
  private readonly logger = new Logger(PropertyService.name);

  //AWS S3 Bucket Configuration
  AWS_S3_BUCKET_NAME = this.configService.get('S3_BUCKET_NAME');
  s3 = new AWS.S3({
    region: this.configService.get('S3_REGION'),
    accessKeyId: this.configService.get('S3_ACCESS_KEY'),
    secretAccessKey:this.configService.get('S3_SECRET_ACCESS_KEY') 
  });

  //Function for random name generation
  randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    private configService: ConfigService
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const createdProperty = new this.propertyModel(createPropertyDto);
    return createdProperty.save();
  }

  async findAll(): Promise<Property[]> {
    return this.propertyModel.find().exec();
  };

  //Upload Image to S3 Bucket
  //TODO: Implement for multiplle images
  async uploadImage(image){
    this.logger.log('Uploading image' + image + ' to S3');

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
      this.logger.log('Image uploaded to S3');
      return s3Response;
    }catch(e){
      console.log(e);
    }
  }
}