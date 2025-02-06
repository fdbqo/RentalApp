import { Message } from '../store/interfaces/Chat';
import { useChatStore } from '../store/chat.store';

class WebSocketService {
  private socket: WebSocket | null = null;
  private readonly url = 'ws://localhost:3000'; // Update with your WebSocket URL
  private connectionAttempts = 0;
  private isAuthenticated = false;

  connect(token: string) {
    const timestamp = new Date().toISOString();
    
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log(`[${timestamp}] WebSocket already connected, skipping connection`);
      return;
    }

    this.connectionAttempts++;
    console.log(`[${timestamp}] Attempting WebSocket connection #${this.connectionAttempts}`);
    console.log(`[${timestamp}] Previous socket state:`, this.socket?.readyState);

    this.socket = new WebSocket(this.url);
    
    this.socket.onopen = () => {
      console.log(`[${timestamp}] WebSocket Connected - Attempt #${this.connectionAttempts}`);
      if (this.socket) {
        console.log(`[${timestamp}] Sending authentication token`);
        this.socket.send(JSON.stringify({
          event: 'auth',
          data: { token }
        }));
      }
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(`[${timestamp}] Received WebSocket message:`, data);
      this.handleMessage(data);
    };

    this.socket.onerror = (error) => {
      console.error(`[${timestamp}] WebSocket Error:`, error);
      console.error(`[${timestamp}] Socket state:`, this.socket?.readyState);
      useChatStore.getState().setError('WebSocket connection error');
    };

    this.socket.onclose = (event) => {
      console.log(`[${timestamp}] WebSocket Disconnected - Code:`, event.code);
      console.log(`[${timestamp}] Clean close:`, event.wasClean);
      console.log(`[${timestamp}] Close reason:`, event.reason);
      
      if (!this.isAuthenticated) {
        console.log(`[${timestamp}] Reconnecting due to no authentication...`);
        setTimeout(() => this.connect(token), 5000);
      }
    };
  }

  private handleMessage(data: any) {
    const timestamp = new Date().toISOString();
    const { event, data: payload } = data;

    console.log(`[${timestamp}] Handling WebSocket event:`, event);

    switch (event) {
      case 'new-chat':
        console.log(`[${timestamp}] New chat message received`);
        useChatStore.getState().addMessage(payload as Message);
        break;
      case 'joined':
        console.log(`[${timestamp}] Successfully joined room:`, payload);
        break;
      case 'auth_success':
        console.log(`[${timestamp}] Authentication successful`);
        this.isAuthenticated = true;
        break;
      case 'auth_error':
        console.error(`[${timestamp}] Authentication failed:`, payload);
        this.isAuthenticated = false;
        break;
      case 'error':
        console.error(`[${timestamp}] WebSocket error event:`, payload);
        useChatStore.getState().setError(payload);
        break;
      default:
        console.log(`[${timestamp}] Unhandled event:`, event);
    }
  }

  joinRoom(roomId: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        event: 'join',
        data: roomId
      }));
    }
  }

  sendMessage(content: string, roomId: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        event: 'create',
        data: {
          room_id: roomId,
          content
        }
      }));
    }
  }

  disconnect() {
    const timestamp = new Date().toISOString();
    if (this.socket) {
      console.log(`[${timestamp}] Initiating WebSocket disconnect`);
      this.isAuthenticated = false;
      this.connectionAttempts = 0;
      this.socket.close();
      this.socket = null;
      console.log(`[${timestamp}] WebSocket disconnected and cleaned up`);
    }
  }
}

export const wsService = new WebSocketService();