import { Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
export declare class ChatsGateway {
    private readonly chatsService;
    server: Server;
    constructor(chatsService: ChatsService);
    handleMessage(createChatDto: CreateChatDto): Promise<import("./schemas/chat.schema").Chat>;
    handleJoinRoom(client: any, propertyId: string): void;
    handleLeaveRoom(client: any, propertyId: string): void;
}
