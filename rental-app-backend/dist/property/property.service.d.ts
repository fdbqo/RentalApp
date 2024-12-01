import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
export declare class PropertyService {
    private propertyModel;
    private configService;
    private readonly logger;
    AWS_S3_BUCKET_NAME: any;
    s3: AWS.S3;
    randomImageName: (bytes?: number) => string;
    constructor(propertyModel: Model<PropertyDocument>, configService: ConfigService);
    findAll(lenderId: string): Promise<Property[]>;
    uploadImage(image: any): Promise<AWS.S3.ManagedUpload.SendData>;
    s3_upload(file: any, bucket: any, name: any, mimetype: any): Promise<AWS.S3.ManagedUpload.SendData>;
    create(createPropertyDto: CreatePropertyDto, images: any[]): Promise<Property>;
    catch(error: any): void;
    findById(id: string): Promise<Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    delete(id: string): Promise<void>;
}
