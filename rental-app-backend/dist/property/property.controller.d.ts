import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './schemas/property.schema';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    getAllProperties(lenderId?: string, filters?: any): Promise<Property[]>;
    create(createPropertyDto: CreatePropertyDto, images: Express.Multer.File[]): Promise<Property>;
    getPropertyById(id: string): Promise<Property>;
    updateProperty(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    deleteProperty(id: string): Promise<void>;
}
