import { 
  WebSocketGateway, 
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { WebSocket, Server } from 'ws';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: true
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatsGateway.name);
  
  constructor(
    private readonly chatsService: ChatsService,
    private readonly jwtService: JwtService
  ) {}

  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<WebSocket, any>();

  async handleConnection(client: WebSocket, request: Request) {
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
      
      // Set up message handler for this client
      client.on('message', async (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(client, message);
        } catch (error) {
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
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.close(1008, 'Authentication failed');
    }
  }

  handleDisconnect(client: WebSocket) {
    this.connectedClients.delete(client);
    this.logger.log('Client disconnected');
  }

  private async handleMessage(client: WebSocket, message: any) {
    const { event, data } = message;
    const userData = this.connectedClients.get(client);

    if (!userData) {
      throw new UnauthorizedException('User not authenticated');
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

  private async handleJoinRoom(client: WebSocket, roomId: string) {
    const userData = this.connectedClients.get(client);
    userData.rooms.add(roomId);
    
    this.logger.log(`User ${userData.user.sub} joined room ${roomId}`);
    
    client.send(JSON.stringify({
      event: 'joined',
      data: `Successfully joined room ${roomId}`
    }));
  }

  private async handleCreateMessage(client: WebSocket, data: CreateChatDto) {
    const userData = this.connectedClients.get(client);
    
    const chat = await this.chatsService.create(userData.user.sub, data);
    
    // Broadcast to all clients in the room
    this.broadcast(data.room_id, {
      event: 'new-chat',
      data: chat
    });

    // Confirm to sender
    client.send(JSON.stringify({
      event: 'created',
      data: chat
    }));
  }

  private async handleLeaveRoom(client: WebSocket, roomId: string) {
    const userData = this.connectedClients.get(client);
    userData.rooms.delete(roomId);
    
    client.send(JSON.stringify({
      event: 'left',
      data: `Successfully left room ${roomId}`
    }));
  }

  private broadcast(roomId: string, message: any) {
    const messageString = JSON.stringify(message);
    
    this.connectedClients.forEach((userData, client) => {
      if (userData.rooms.has(roomId)) {
        client.send(messageString);
      }
    });
  }
}