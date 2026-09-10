import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '../config/constants';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  connect(token: string): void {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
    
    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.setupListeners();

    // Reconnect handler
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.socket?.disconnect();
      }
    });
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('WebSocket connected successfully');
      this.reconnectAttempts = 0;
      this.emit(SOCKET_EVENTS.USER_ONLINE, { userId: this.getUserId() });
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log('WebSocket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, attempt to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on(SOCKET_EVENTS.RECONNECT, (attempt) => {
      console.log(`WebSocket reconnected after ${attempt} attempts`);
      this.emit(SOCKET_EVENTS.USER_ONLINE, { userId: this.getUserId() });
    });

    this.socket.on(SOCKET_EVENTS.RECONNECT_ERROR, (error) => {
      console.error('WebSocket reconnection error:', error);
    });

    // Listen to events and trigger callbacks
    Object.values(SOCKET_EVENTS).forEach((event) => {
      this.socket?.on(event, (data) => {
        const callbacks = this.eventListeners.get(event);
        if (callbacks) {
          callbacks.forEach((callback) => callback(data));
        }
      });
    });
  }

  private getUserId(): string | null {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user).id;
      }
      return null;
    } catch {
      return null;
    }
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: Socket not connected`);
      // Queue message for when connection is restored
      this.queueMessage(event, data);
    }
  }

  private messageQueue: Array<{ event: string; data: any }> = [];

  private queueMessage(event: string, data: any): void {
    this.messageQueue.push({ event, data });
    
    // Try to process queue when reconnected
    if (this.socket?.connected) {
      this.processQueue();
    }
  }

  private processQueue(): void {
    while (this.messageQueue.length > 0) {
      const { event, data } = this.messageQueue.shift()!;
      this.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
  }

  off(event: string, callback?: (data: any) => void): void {
    if (callback) {
      const callbacks = this.eventListeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.eventListeners.delete(event);
        }
      }
    } else {
      this.eventListeners.delete(event);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.eventListeners.clear();
      this.messageQueue = [];
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();