import React from 'react';
import type { Chat } from '../../../types/chat.types';
import { formatDistanceToNow } from 'date-fns';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  currentUserId?: string;
  currentChatId?: string;
}

export const ChatList: React.FC<ChatListProps> = ({ 
  chats, 
  onChatSelect, 
  currentUserId,
  currentChatId 
}) => {
  const getChatName = (chat: Chat): string => {
    if (chat.id === '1') return 'AI Assistant';
    if (chat.isGroup) return chat.name || 'Group';
    const otherUser = chat.participants?.find((p) => p.id !== currentUserId);
    return otherUser?.name || 'Unknown User';
  };

  const getChatAvatar = (chat: Chat): string => {
    if (chat.id === '1') return '🤖';
    if (chat.avatar) return chat.avatar;
    if (chat.isGroup) {
      return `https://ui-avatars.com/api/?name=Group&background=6366f1&color=fff&size=40`;
    }
    const otherUser = chat.participants?.find((p) => p.id !== currentUserId);
    return otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'U')}&background=6366f1&color=fff&size=40`;
  };

  const getLastMessage = (chat: Chat): string => {
    if (!chat.lastMessage) return 'No messages yet';
    return chat.lastMessage.content || 'Media message';
  };

  const getStatus = (chat: Chat): string => {
    if (chat.id === '1') return 'AI Online';
    if (chat.isGroup) {
      const online = chat.participants?.filter((p) => p.status === 'online').length || 0;
      return `${online} online`;
    }
    const otherUser = chat.participants?.find((p) => p.id !== currentUserId);
    return otherUser?.status === 'online' ? 'Online' : 'Offline';
  };

  const getStatusColor = (chat: Chat): string => {
    if (chat.id === '1') return 'bg-purple-500';
    if (chat.isGroup) return 'bg-blue-500';
    const otherUser = chat.participants?.find((p) => p.id !== currentUserId);
    return otherUser?.status === 'online' ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onChatSelect(chat)}
          className={`w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 text-left group ${
            currentChatId === chat.id ? 'bg-gray-50 dark:bg-gray-700/50' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {chat.id === '1' ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  🤖
                </div>
              ) : (
                <>
                  <img
                    src={getChatAvatar(chat)}
                    alt={getChatName(chat)}
                    className="w-12 h-12 rounded-full object-cover shadow-md group-hover:shadow-lg transition-all"
                  />
                  {!chat.isGroup && chat.id !== '1' && (
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(chat)}`} />
                  )}
                </>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 dark:text-white truncate flex items-center gap-2">
                  {getChatName(chat)}
                  {chat.id === '1' && (
                    <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                      AI
                    </span>
                  )}
                </p>
                {chat.lastMessage?.createdAt && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {getLastMessage(chat)}
                </p>
                {chat.unreadCount && chat.unreadCount > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(chat)} animate-pulse`} />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {getStatus(chat)}
                </p>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};