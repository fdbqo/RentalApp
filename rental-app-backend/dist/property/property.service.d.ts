import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertyService {
    private propertyModel;
    constructor(propertyModel: Model<PropertyDocument>);
    findAll(lenderId: string): Promise<Property[]>;
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    findById(id: string): Promise<Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    delete(id: string): Promise<void>;
    findAllAvailable(): Promise<Property[]>;
    findByLenderId(lenderId: string): Promise<Property[]>;
}
