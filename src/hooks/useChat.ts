import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '../api/chat.api';
import { useSocket } from './useSocket';
import type { Message, Chat } from '../types/chat.types';

export const useChat = (chatId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { emit, on, off } = useSocket();

  const loadChats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await chatApi.getChats();
      setChats(data);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (reset = false) => {
    if (!chatId) return;
    try {
      setIsLoading(true);
      const currentPage = reset ? 1 : page;
      const data = await chatApi.getMessages(chatId, currentPage, 20);
      
      if (reset) {
        setMessages(data.messages);
        setPage(2);
      } else {
        setMessages(prev => [...data.messages, ...prev]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [chatId, page]);

  const sendMessage = useCallback(async (content: string, type: string = 'text') => {
    if (!chatId) return;
    try {
      const message = await chatApi.sendMessage(chatId, content, type);
      setMessages(prev => [...prev, message]);
      emit('send-message', { chatId, message });
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [chatId, emit]);

  const editMessage = useCallback(async (messageId: string, content: string) => {
    try {
      const updated = await chatApi.editMessage(messageId, content);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? updated : msg
      ));
      emit('edit-message', { messageId, content });
    } catch (error) {
      console.error('Error editing message:', error);
    }
  }, [emit]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await chatApi.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      emit('delete-message', { messageId });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, [emit]);

  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    try {
      const { reactions } = await chatApi.reactToMessage(messageId, emoji);
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, reactions } : msg
      ));
      emit('react-message', { messageId, emoji });
    } catch (error) {
      console.error('Error reacting to message:', error);
    }
  }, [emit]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!chatId) return;
    emit(isTyping ? 'typing' : 'stop-typing', { chatId });
  }, [chatId, emit]);

  useEffect(() => {
    if (chatId) {
      loadMessages(true);
      emit('join-chat', { chatId });
      return () => {
        emit('leave-chat', { chatId });
      };
    }
  }, [chatId, loadMessages, emit]);

  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (data.chatId === chatId) {
        setMessages(prev => [...prev, data.message]);
      }
    };

    const handleMessageUpdate = (data: any) => {
      setMessages(prev => prev.map(msg =>
        msg.id === data.messageId ? { ...msg, ...data.updates } : msg
      ));
    };

    on('receive-message', handleNewMessage);
    on('edit-message', handleMessageUpdate);

    return () => {
      off('receive-message', handleNewMessage);
      off('edit-message', handleMessageUpdate);
    };
  }, [chatId, on, off]);

  return {
    messages,
    chats,
    isLoading,
    hasMore,
    loadChats,
    loadMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    sendTyping,
  };
};