import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
export declare class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatsService;
    server: Server;
    constructor(chatsService: ChatsService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(createChatDto: CreateChatDto): Promise<import("./schemas/chat.schema").Chat>;
    handleJoinRoom(client: Socket, propertyId: string): void;
    handleLeaveRoom(client: Socket, propertyId: string): void;
}
