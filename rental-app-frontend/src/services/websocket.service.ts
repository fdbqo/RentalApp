import { EventEmitter } from 'events';
import { Message } from '../store/interfaces/Chat';
import { useChatStore } from '../store/chat.store';

class WebSocketService extends EventEmitter {
  emit(event: string | symbol, ...args: any[]): boolean {
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
      console.log('[WebSocket] Received message:', event.data);
      const data = JSON.parse(event.data);
      this.handleSocketMessage(data);
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
      this.emit('error', error);
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
    console.log('[WebSocket] Handling message:', data);
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
  // A helper method to check if the socket is in OPEN state
  private isSocketReady(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
  // A method that waits for the socket to be ready with a timeout
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
    console.log('[WebSocket] Sending message:', { content, roomId });
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.error('[WebSocket] Cannot send message - socket not open');
      return;
    }
    this.send('create', { room_id: roomId, content });
  }

  private send(event: string, data: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({ event, data });
      console.log('[WebSocket] Sending payload:', payload);
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
}

export const wsService = new WebSocketService();