import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { WebSocket, Server } from "ws";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException, Logger } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
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

  handleConnection(client: WebSocket) {
    this.logger.log("Client connected");
    client.on("message", (message: string) => {
      this.handleMessage(client, message);
    });
  }

  handleDisconnect(client: WebSocket) {
    this.logger.log("Client disconnected");
    this.connectedClients.delete(client);
  }

  private async handleAuth(client: WebSocket, data: any) {
    try {
      const decoded = this.jwtService.verify(data.token);
      this.connectedClients.set(client, { user: decoded, rooms: [] });
      client.send(JSON.stringify({ event: "auth_success", data: decoded }));
    } catch (error) {
      client.send(
        JSON.stringify({ event: "auth_error", data: "Invalid token" })
      );
    }
  }

  private async handleMessage(client: WebSocket, rawMessage: string) {
    try {
      this.logger.debug(`Raw message received: ${rawMessage}`);
      const { event, data } = JSON.parse(rawMessage);
      this.logger.debug(`Parsed event: ${event} with data:`, data);

      switch (event) {
        case "auth":
          await this.handleAuth(client, data);
          break;

        case "join":
          await this.handleJoinRoom(client, data);
          break;

        case "create":
          await this.handleCreateMessage(client, data);
          break;

        case "typing":
          await this.handleTypingStatus(client, data, true);
          break;

        case "stop_typing":
          await this.handleTypingStatus(client, data, false);
          break;

        case "mark_read":
          await this.handleMarkRead(client, data);
          break;

        default:
          this.logger.warn(`Unknown event received: ${event}`);
          client.send(
            JSON.stringify({
              event: "error",
              data: `Unknown event: ${event}`,
            })
          );
      }
    } catch (error) {
      this.logger.error("Error handling message:", error);
      client.send(
        JSON.stringify({
          event: "error",
          data: "Internal server error",
        })
      );
    }
  }

  private async handleJoinRoom(client: WebSocket, roomId: string) {
    const userData = this.connectedClients.get(client);
    if (!userData) return;

    if (!userData.rooms) {
      userData.rooms = [];
    }

    if (!userData.rooms.includes(roomId)) {
      userData.rooms.push(roomId);
    }

    this.connectedClients.set(client, userData);

    client.send(
      JSON.stringify({
        event: "joined",
        data: { roomId },
      })
    );
  }

  private async handleCreateMessage(client: WebSocket, data: any) {
    const userData = this.connectedClients.get(client);
    if (!userData) return;

    try {
      const message = await this.chatsService.create({
        senderId: userData.user.sub,
        ...data,
      });

      this.broadcast(data.room_id, {
        event: "new-chat",
        data: message,
      });
    } catch (error) {
      this.logger.error("Error creating message:", error);
      client.send(
        JSON.stringify({
          event: "error",
          data: "Failed to create message",
        })
      );
    }
  }

  private async handleTypingStatus(
    client: WebSocket,
    data: any,
    isTyping: boolean
  ) {
    try {
      const userData = this.connectedClients.get(client);
      if (!userData) {
        this.logger.warn("No user data found for typing status");
        return;
      }

      const { room_id } = data;
      const displayName = data.fullName || userData.user.email;

      this.broadcast(
        room_id,
        {
          event: isTyping ? "user_typing" : "user_stop_typing",
          data: {
            userId: userData.user.sub,
            username: displayName,
          },
        },
        client
      );
    } catch (error) {
      this.logger.error("Error handling typing status:", error);
      client.send(
        JSON.stringify({
          event: "error",
          data: "Failed to update typing status",
        })
      );
    }
  }

  private async handleMarkRead(client: WebSocket, data: any) {
    const userData = this.connectedClients.get(client);
    if (!userData) return;

    try {
      await this.chatsService.markAsRead(data.messageId);

      this.broadcast(data.roomId, {
        event: "message_read",
        data: { messageId: data.messageId },
      });
    } catch (error) {
      this.logger.error("Error marking message as read:", error);
      client.send(
        JSON.stringify({
          event: "error",
          data: "Failed to mark message as read",
        })
      );
    }
  }

  private broadcast(roomId: string, message: any, excludeClient?: WebSocket) {
    this.logger.debug(`Broadcasting to room ${roomId}:`, message);
    this.connectedClients.forEach((userData, client) => {
      if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
        if (userData.rooms?.includes(roomId)) {
          client.send(JSON.stringify(message));
        }
      }
    });
  }
}
