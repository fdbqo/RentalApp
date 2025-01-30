"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chats_service_1 = require("./chats.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
let ChatsGateway = class ChatsGateway {
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    afterInit() {
        console.log('✅ WebSocket gateway initialized');
    }
    handleConnection(client) {
        console.log(`🔵 Client connected: ${client.id}`);
        client.on('error', (err) => {
            console.error(`🚨 Socket Error (Client: ${client.id}):`, err);
        });
        client.on('disconnect', (reason) => {
            console.log(`🔴 Client disconnected: ${client.id}, Reason: ${reason}`);
        });
    }
    handleDisconnect(client) {
        console.log(`🔴 Client disconnected: ${client.id}`);
    }
    async handleMessage(createChatDto) {
        console.log(`📩 Message received from ${createChatDto.senderId}: ${createChatDto.content}`);
        const chat = await this.chatsService.create(createChatDto);
        this.server.to(`chat:${createChatDto.propertyId}`).emit('message', chat);
        return chat;
    }
    handleJoinRoom(client, propertyId) {
        console.log(`✅ Client ${client.id} joined room: chat:${propertyId}`);
        client.join(`chat:${propertyId}`);
    }
    handleLeaveRoom(client, propertyId) {
        console.log(`🚪 Client ${client.id} left room: chat:${propertyId}`);
        client.leave(`chat:${propertyId}`);
    }
};
exports.ChatsGateway = ChatsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatsGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatsGateway.prototype, "handleLeaveRoom", null);
exports.ChatsGateway = ChatsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Authorization'],
            credentials: true
        },
        transports: ['websocket']
    }),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsGateway);
//# sourceMappingURL=chats.gateway.js.map