import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
export declare class ChatsService {
    private chatModel;
    constructor(chatModel: Model<ChatDocument>);
    create(createChatDto: CreateChatDto): Promise<Chat>;
    findByProperty(propertyId: string, getChatDto: GetChatDto): Promise<Chat[]>;
}
