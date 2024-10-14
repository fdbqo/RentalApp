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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const property_schema_1 = require("../property/schemas/property.schema");
let PropertyService = class PropertyService {
    constructor(propertyModel) {
        this.propertyModel = propertyModel;
    }
    async create(createPropertyDto) {
        const newProperty = new this.propertyModel(createPropertyDto);
        return newProperty.save();
    }
    async findAll() {
        return this.propertyModel.find().exec();
    }
    async findOne(id) {
        const property = await this.propertyModel.findById(id).exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return property;
    }
    async update(id, updatePropertyDto) {
        const updatedProperty = await this.propertyModel.findByIdAndUpdate(id, updatePropertyDto, { new: true }).exec();
        if (!updatedProperty) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return updatedProperty;
    }
    async delete(id) {
        const deletedProperty = await this.propertyModel.findByIdAndDelete(id).exec();
        if (!deletedProperty) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return deletedProperty;
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_schema_1.Property.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PropertyService);
//# sourceMappingURL=property.service.js.map