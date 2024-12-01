"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PropertyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const property_schema_1 = require("./schemas/property.schema");
const AWS = require("aws-sdk");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
let PropertyService = PropertyService_1 = class PropertyService {
    constructor(propertyModel, configService) {
        this.propertyModel = propertyModel;
        this.configService = configService;
        this.logger = new common_1.Logger(PropertyService_1.name);
        this.AWS_S3_BUCKET_NAME = this.configService.get('S3_BUCKET_NAME');
        this.s3 = new AWS.S3({
            region: this.configService.get('S3_REGION'),
            accessKeyId: this.configService.get('S3_ACCESS_KEY'),
            secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY')
        });
        this.randomImageName = (bytes = 8) => crypto_1.default.randomBytes(bytes).toString('hex');
    }
    async findAll(lenderId) {
        try {
            const objectId = new mongoose_2.Types.ObjectId(lenderId);
            const properties = await this.propertyModel.find({ lenderId: objectId }).exec();
            return properties;
        }
        catch (error) {
            return [];
        }
    }
    async uploadImage(image) {
        this.logger.log('Uploading image' + image + ' to S3');
        return await this.s3_upload(image.buffer, this.AWS_S3_BUCKET_NAME, this.randomImageName(), image.mimetype);
    }
    async s3_upload(file, bucket, name, mimetype) {
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
        try {
            let s3Response = await this.s3.upload(params).promise();
            this.logger.log('Image uploaded to S3');
            return s3Response;
        }
        catch (e) {
            console.log(e);
        }
    }
    async create(createPropertyDto, images) {
        const uploadedImages = [];
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const s3Response = await this.uploadImage(image);
            console.log('S3 Response:', s3Response);
            if (!s3Response || !s3Response.Key) {
                throw new Error('Error uploading image to S3');
            }
            uploadedImages.push({
                _id: new mongoose_2.Types.ObjectId(),
                uri: s3Response.Key
            });
        }
        const propertyData = {
            ...createPropertyDto,
            lenderId: new mongoose_2.Types.ObjectId(createPropertyDto.lenderId),
            images: uploadedImages
        };
        const createdProperty = new this.propertyModel(propertyData);
        return createdProperty.save();
    }
    catch(error) {
        console.error('Error creating property:', error);
        throw error;
    }
    async findById(id) {
        try {
            const property = await this.propertyModel.findById(id).exec();
            if (!property) {
                throw new common_1.NotFoundException(`Property with ID ${id} not found`);
            }
            return property;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
    }
    async update(id, updatePropertyDto) {
        try {
            const updatedProperty = await this.propertyModel
                .findByIdAndUpdate(id, updatePropertyDto, { new: true })
                .exec();
            if (!updatedProperty) {
                throw new common_1.NotFoundException(`Property with ID ${id} not found`);
            }
            return updatedProperty;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error updating property: ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const result = await this.propertyModel.findByIdAndDelete(id).exec();
            if (!result) {
                throw new common_1.NotFoundException(`Property with ID ${id} not found`);
            }
        }
        catch (error) {
            throw new common_1.NotFoundException(`Error deleting property: ${error.message}`);
        }
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = PropertyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_schema_1.Property.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], PropertyService);
//# sourceMappingURL=property.service.js.map