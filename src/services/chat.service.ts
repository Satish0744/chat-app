import { axiosInstance } from '../api/axios.config';
import { Message, Chat, User } from '../types/chat.types';

export const chatService = {
  getChats: async (): Promise<Chat[]> => {
    const response = await axiosInstance.get('/chat/chats');
    return response.data;
  },

  getMessages: async (chatId: string, page: number = 1, limit: number = 20): Promise<{ messages: Message[]; total: number }> => {
    const response = await axiosInstance.get(`/chat/messages/${chatId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  sendMessage: async (chatId: string, content: string, type: string = 'text', attachments?: File[]): Promise<Message> => {
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('content', content);
    formData.append('type', type);
    
    if (attachments) {
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await axiosInstance.post('/chat/send', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  editMessage: async (messageId: string, content: string): Promise<Message> => {
    const response = await axiosInstance.put(`/chat/edit/${messageId}`, { content });
    return response.data;
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    await axiosInstance.delete(`/chat/delete/${messageId}`);
  },

  reactToMessage: async (messageId: string, emoji: string): Promise<{ reactions: Record<string, string[]> }> => {
    const response = await axiosInstance.post(`/chat/react/${messageId}`, { emoji });
    return response.data;
  },

  createGroup: async (name: string, members: string[], avatar?: File): Promise<Chat> => {
    const formData = new FormData();
    formData.append('name', name);
    members.forEach((member) => formData.append('members', member));
    if (avatar) formData.append('avatar', avatar);

    const response = await axiosInstance.post('/chat/group/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  addGroupMembers: async (groupId: string, members: string[]): Promise<Chat> => {
    const response = await axiosInstance.post(`/chat/group/add-members/${groupId}`, { members });
    return response.data;
  },

  removeGroupMembers: async (groupId: string, members: string[]): Promise<Chat> => {
    const response = await axiosInstance.post(`/chat/group/remove-members/${groupId}`, { members });
    return response.data;
  },

  getUsers: async (search?: string): Promise<User[]> => {
    const response = await axiosInstance.get('/chat/users', { params: { search } });
    return response.data;
  },

  markAsRead: async (chatId: string): Promise<void> => {
    await axiosInstance.post(`/chat/read/${chatId}`);
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await axiosInstance.get('/chat/unread');
    return response.data;
  },
};