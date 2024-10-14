import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    create(createPropertyDto: CreatePropertyDto): Promise<import("./schemas/property.schema").Property>;
    findAll(): Promise<import("./schemas/property.schema").Property[]>;
    findOne(id: string): Promise<import("./schemas/property.schema").Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<import("./schemas/property.schema").Property>;
    remove(id: string): Promise<import("./schemas/property.schema").Property>;
}
