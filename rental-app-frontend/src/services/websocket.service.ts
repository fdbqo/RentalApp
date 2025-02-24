import { EventEmitter } from 'events';
import { Message } from '../store/interfaces/Chat';
import { useChatStore } from '../store/chat.store';
import { useUserStore } from '@/store/user.store';

interface WebSocketEvents {
  connected: () => void;
  error: (error: Error | Event) => void;
  joined: (payload: any) => void;
  auth_success: (payload: any) => void;
  max_reconnect_attempts: () => void;
  user_typing: (payload: { userId: string; username: string }) => void;
  user_stop_typing: (payload: { userId: string }) => void;
}

class WebSocketService extends EventEmitter {
  on<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): this {
    return super.on(event, listener);
  }

  off<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): this {
    return super.off(event, listener);
  }

  emit<K extends keyof WebSocketEvents>(event: K, ...args: Parameters<WebSocketEvents[K]>): boolean {
    return super.emit(event, ...args);
  }

  private socket: WebSocket | null = null;
  private readonly url = 'ws://localhost:3000';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 5000;
  private isAuthenticated = false;

  constructor() {
    super();
  }

  public connect(token: string): void {
    if (!token) {
      this.emit('error', new Error('No token provided'));
      return;
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.socket = new WebSocket(this.url);
    this.setupSocketListeners(token);
  }

  private setupSocketListeners(token: string): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('[WebSocket] Connection opened');
      this.reconnectAttempts = 0;
      this.authenticate(token);
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleSocketMessage(data);
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
      const errorObj = new Error('WebSocket connection error');
      this.emit('error', errorObj);
      useChatStore.getState().setError('WebSocket connection error');
    };

    this.socket.onclose = () => {
      console.log('[WebSocket] Connection closed');
      this.handleDisconnect(token);
    };
  }

  private authenticate(token: string): void {
    this.send('auth', { token });
  }

  private handleSocketMessage(data: any): void {
    const { event, data: payload } = data;

    switch (event) {
      case 'new-chat':
        console.log('[WebSocket] New chat received:', payload);
        useChatStore.getState().addMessage(payload as Message);
        break;
      case 'joined':
        this.emit('joined', payload);
        break;
      case 'auth_success':
        this.isAuthenticated = true;
        this.emit('auth_success', payload);
        break;
      case 'auth_error':
        this.isAuthenticated = false;
        useChatStore.getState().setError('Authentication failed');
        break;
      case 'error':
        useChatStore.getState().setError(payload);
        break;
      case 'user_typing':
        this.emit('user_typing', payload);
        break;
      case 'user_stop_typing':
        this.emit('user_stop_typing', payload);
        break;
    }
  }
  private handleDisconnect(token: string): void {
    this.isAuthenticated = false;
    
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`[WebSocket] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => this.connect(token), this.reconnectTimeout);
      } else {
        this.emit('max_reconnect_attempts');
        useChatStore.getState().setError('Maximum reconnection attempts reached');
      }
    }
  }

  private isSocketReady(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  private async waitForConnection(timeout: number = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isSocketReady()) {
        resolve(true);
        return;
      }

      const checkInterval = 100;
      let totalWait = 0;
      
      const interval = setInterval(() => {
        if (this.isSocketReady()) {
          clearInterval(interval);
          resolve(true);
          return;
        }

        totalWait += checkInterval;
        if (totalWait >= timeout) {
          clearInterval(interval);
          resolve(false);
        }
      }, checkInterval);
    });
  }

  public async joinRoom(roomId: string): Promise<void> {
    if (!this.isSocketReady()) {
      const isConnected = await this.waitForConnection();
      if (!isConnected) {
        console.error('[WebSocket] Failed to join room - connection timeout');
        useChatStore.getState().setError('Failed to join room - connection timeout');
        return;
      }
    }
    
    this.send('join', roomId);
  }

  public sendMessage(content: string, roomId: string): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.error('[WebSocket] Cannot send message - socket not open');
      return;
    }
    this.send('create', { room_id: roomId, content });
  }

  private send(event: string, data: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({ event, data });
      this.socket.send(payload);
    } else {
      console.error('[WebSocket] Cannot send - socket not open. ReadyState:', this.socket?.readyState);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isAuthenticated = false;
      this.reconnectAttempts = 0;
    }
  }

  public sendTypingStatus(roomId: string, isTyping: boolean): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.error('[WebSocket] Cannot send typing status - socket not open');
      return;
    }
    
    const user = useUserStore.getState().user;
    if (!user) {
      console.error('[WebSocket] Cannot send typing status - no user logged in');
      return;
    }
    
    this.send(isTyping ? 'typing' : 'stop_typing', {
      room_id: roomId,
      fullName: `${user.firstName}`
    });
}
}

export const wsService = new WebSocketService();