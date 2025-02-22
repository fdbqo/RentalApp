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
  cors: {
    origin: '*',
    credentials: true
  }
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
      client.on('message', async (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('[Gateway] Received message:', message);
          
          if (!this.connectedClients.has(client) && message.event !== 'auth') {
            client.close(1008, 'Authentication required');
            return;
          }

          if (message.event === 'auth') {
            // Handle authentication
            if (!message.data.token) {
              client.close(1008, 'Authentication required');
              return;
            }

            const jwtToken = message.data.token;
            
            const payload = await this.jwtService.verifyAsync(jwtToken, {
              secret: 'jwt_secret_key'
            });

            this.connectedClients.set(client, { 
              user: payload,
              rooms: new Set()
            });

            client.send(JSON.stringify({ 
              event: 'authenticated', 
              data: 'Successfully authenticated' 
            }));
            
            this.logger.log(`Client authenticated: ${payload.sub}`);
          } else {
            // Handle other messages
            await this.handleMessage(client, message);
          }
        } catch (error) {
          this.logger.error(`Message handling error: ${error.message}`);
          client.send(JSON.stringify({
            event: 'error',
            data: error.message
          }));
        }
      });

      // Set timeout for authentication
      setTimeout(() => {
        if (!this.connectedClients.has(client)) {
          client.close(1008, 'Authentication timeout');
        }
      }, 5000);

    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.close(1008, 'Connection failed');
    }
  }

  handleDisconnect(client: WebSocket) {
    const userData = this.connectedClients.get(client);
    if (userData) {
      userData.rooms.clear();
    }
    this.connectedClients.delete(client);
    this.logger.log('Client disconnected');
  }

  private async handleMessage(client: WebSocket, message: any) {
    if (!message || !message.event || !message.data) {
      throw new Error('Invalid message format');
    }

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
    try {
      const userData = this.connectedClients.get(client);
      
      console.log('[Gateway] Creating message:', {
        content: data.content,
        room_id: data.room_id,
        senderId: userData.user.sub
      });
      
      const chat = await this.chatsService.create({
        senderId: userData.user.sub,
        content: data.content,
        room_id: data.room_id
      });
      
      console.log('[Gateway] Created chat:', chat);

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
    } catch (error) {
      this.logger.error(`Error creating message: ${error.message}`);
      client.send(JSON.stringify({
        event: 'error',
        data: 'Failed to create message'
      }));
    }
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

  private handleTyping(client: WebSocket, data: any) {
    const userData = this.connectedClients.get(client);
    const { roomId, isTyping } = data;
    
    if (isTyping) {
      this.broadcast(roomId, {
        event: 'typing',
        data: {
          user: {
            userId: userData.user.sub,
            name: userData.user.name
          }
        }
      });
    }
  }
}