import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { WebSocket, Server } from 'ws';
import { JwtService } from '@nestjs/jwt';
export declare class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatsService;
    private readonly jwtService;
    private readonly logger;
    constructor(chatsService: ChatsService, jwtService: JwtService);
    server: Server;
    private connectedClients;
    handleConnection(client: WebSocket, request: Request): Promise<void>;
    handleDisconnect(client: WebSocket): void;
    private handleMessage;
    private handleJoinRoom;
    private handleCreateMessage;
    private handleLeaveRoom;
    private broadcast;
}
