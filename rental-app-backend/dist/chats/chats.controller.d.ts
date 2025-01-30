import { ChatsService } from './chats.service';
import { GetChatDto } from './dto/get-chat.dto';
export declare class ChatsController {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    getPropertyChats(propertyId: string, getChatDto: GetChatDto): Promise<import("./schemas/chat.schema").Chat[]>;
}
