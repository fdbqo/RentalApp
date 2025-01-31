import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Socket } from 'socket.io';
export declare class ChatsGateway {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    private server;
    create(client: any, createChatDto: CreateChatDto): Promise<void>;
    afterInit(client: Socket): void;
}
