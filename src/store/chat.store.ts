import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Chat, Message, User } from '../types/chat.types';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  setChats: (chats: Chat[]) => void;
  setCurrentChat: (chat: Chat | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        chats: [],
        currentChat: null,
        messages: [],
        users: [],
        isLoading: false,
        error: null,

        setChats: (chats) => set({ chats }),
        
        setCurrentChat: (chat) => set({ currentChat: chat }),
        
        setMessages: (messages) => set({ messages }),
        
        addMessage: (message) => 
          set((state) => ({ 
            messages: [...state.messages, message] 
          })),
        
        updateMessage: (messageId, updates) =>
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          })),
        
        deleteMessage: (messageId) =>
          set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== messageId),
          })),
        
        setUsers: (users) => set({ users }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        clearChat: () => set({ messages: [], currentChat: null, error: null }),
      }),
      {
        name: 'chat-storage',
        partialize: (state) => ({ chats: state.chats }),
      }
    )
  )
);