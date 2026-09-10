// Import User from auth.types
import type { User } from './auth.types';

// Re-export User so it can be used from chat.types as well
export type { User };

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'location';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  reactions: Record<string, string[]>; // emoji -> userIds
  replyTo?: string;
  attachments?: {
    id: string;
    url: string;
    type: string;
    name: string;
    size: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  adminIds?: string[];
  description?: string;
}

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export interface TypingStatus {
  userId: string;
  chatId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface MessageReaction {
  messageId: string;
  userId: string;
  emoji: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  members: string[];
  avatar?: File;
}