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
var ChatsGateway_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chats_service_1 = require("./chats.service");
const ws_1 = require("ws");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
let ChatsGateway = ChatsGateway_1 = class ChatsGateway {
    constructor(chatsService, jwtService) {
        this.chatsService = chatsService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(ChatsGateway_1.name);
        this.connectedClients = new Map();
    }
    async handleConnection(client, request) {
        try {
            const token = request.headers['authorization'];
            if (!token) {
                client.close(1008, 'No token provided');
                return;
            }
            const jwtToken = token.replace('Bearer ', '');
            const payload = await this.jwtService.verifyAsync(jwtToken, {
                secret: 'jwt_secret_key'
            });
            this.connectedClients.set(client, {
                user: payload,
                rooms: new Set()
            });
            client.on('message', async (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    await this.handleMessage(client, message);
                }
                catch (error) {
                    this.logger.error(`Error handling message: ${error.message}`);
                    client.send(JSON.stringify({
                        event: 'error',
                        data: 'Invalid message format'
                    }));
                }
            });
            client.send(JSON.stringify({
                event: 'connected',
                data: 'Successfully connected'
            }));
            this.logger.log(`Client connected: ${payload.sub}`);
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.close(1008, 'Authentication failed');
        }
    }
    handleDisconnect(client) {
        const userData = this.connectedClients.get(client);
        if (userData) {
            userData.rooms.clear();
        }
        this.connectedClients.delete(client);
        this.logger.log('Client disconnected');
    }
    async handleMessage(client, message) {
        if (!message || !message.event || !message.data) {
            throw new Error('Invalid message format');
        }
        const { event, data } = message;
        const userData = this.connectedClients.get(client);
        if (!userData) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        switch (event) {
            case 'join':
                await this.handleJoinRoom(client, data);
                break;
            case 'create':
                await this.handleCreateMessage(client, data);
                break;
            case 'leave':
                await this.handleLeaveRoom(client, data);
                break;
            default:
                client.send(JSON.stringify({
                    event: 'error',
                    data: `Unknown event: ${event}`
                }));
        }
    }
    async handleJoinRoom(client, roomId) {
        const userData = this.connectedClients.get(client);
        userData.rooms.add(roomId);
        this.logger.log(`User ${userData.user.sub} joined room ${roomId}`);
        client.send(JSON.stringify({
            event: 'joined',
            data: `Successfully joined room ${roomId}`
        }));
    }
    async handleCreateMessage(client, data) {
        const userData = this.connectedClients.get(client);
        const chat = await this.chatsService.create(userData.user.sub, data);
        this.broadcast(data.room_id, {
            event: 'new-chat',
            data: chat
        });
        client.send(JSON.stringify({
            event: 'created',
            data: chat
        }));
    }
    async handleLeaveRoom(client, roomId) {
        const userData = this.connectedClients.get(client);
        userData.rooms.delete(roomId);
        client.send(JSON.stringify({
            event: 'left',
            data: `Successfully left room ${roomId}`
        }));
    }
    broadcast(roomId, message) {
        const messageString = JSON.stringify(message);
        this.connectedClients.forEach((userData, client) => {
            if (userData.rooms.has(roomId)) {
                client.send(messageString);
            }
        });
    }
};
exports.ChatsGateway = ChatsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
], ChatsGateway.prototype, "server", void 0);
exports.ChatsGateway = ChatsGateway = ChatsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true
    }),
    __metadata("design:paramtypes", [chats_service_1.ChatsService,
        jwt_1.JwtService])
], ChatsGateway);
//# sourceMappingURL=chats.gateway.js.map