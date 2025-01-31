import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './schemas/property.schema';
import { ChatsService } from 'src/chats/chats.service';
export declare class PropertyController {
    private readonly propertyService;
    private readonly chatsService;
    constructor(propertyService: PropertyService, chatsService: ChatsService);
    getAllProperties(lenderId?: string, filters?: any): Promise<Property[]>;
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    getPropertyById(id: string): Promise<Property>;
    updateProperty(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    deleteProperty(id: string): Promise<void>;
}
