import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway(3001, {
    cors: {
        origin: '*',
    },
})
export class ChatsGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatsService: ChatsService) {}

    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() createChatDto: CreateChatDto) {
        const chat = await this.chatsService.create(createChatDto);
        this.server.emit(`chat:${createChatDto.propertyId}`, chat);
        return chat;
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: any, propertyId: string) {
        client.join(`chat:${propertyId}`);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: any, propertyId: string) {
        client.leave(`chat:${propertyId}`);
    }
}
