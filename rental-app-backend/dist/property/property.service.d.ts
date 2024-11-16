import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
export declare class PropertyService {
    private propertyModel;
    constructor(propertyModel: Model<PropertyDocument>);
    findAll(lenderId: string): Promise<Property[]>;
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
}
