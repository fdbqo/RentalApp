import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Property } from './schemas/property.schema';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    getAllProperties(lenderId: string): Promise<Property[]>;
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    getPropertyById(id: string): Promise<Property>;
}
