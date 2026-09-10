import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChatUser, Chat } from '../../../hooks/useAIChat';
import { 
  MagnifyingGlassIcon, 
  SparklesIcon,
  UsersIcon,
  UserPlusIcon,
  PlusCircleIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
  availableUsers: ChatUser[];
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  currentChatId,
  onChatSelect,
  availableUsers = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'friends'>('all');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Filter chats based on search and active filter
  const filteredChats = useMemo(() => {
    let result = [...chats];

    // Apply filter
    if (activeFilter === 'unread') {
      result = result.filter(chat => chat.unreadCount > 0);
    }

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by last message time
    result.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.updatedAt).getTime();
      const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.updatedAt).getTime();
      return bTime - aTime;
    });

    return result;
  }, [chats, searchQuery, activeFilter]);

  // Count unread chats
  const unreadCount = useMemo(() => {
    return chats.filter(c => c.unreadCount > 0).length;
  }, [chats]);

  // Count online users
  const onlineCount = useMemo(() => {
    return chats.filter(c => 
      c.isAI || c.participants[0]?.status === 'online'
    ).length;
  }, [chats]);

  const formatTime = (date?: Date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      default:
        return 'Offline';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* ============ HEADER ============ */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Messages
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          {/* New Chat Button */}
          <Link
            to="/contacts"
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="New Chat"
          >
            <PlusCircleIcon className="w-5 h-5" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
          <button
            onClick={() => setActiveFilter('all')}
            className={`
              flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all
              ${activeFilter === 'all'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            All ({chats.length})
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`
              flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all
              ${activeFilter === 'unread'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* ============ CHAT LIST ============ */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              {searchQuery ? (
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              ) : activeFilter === 'unread' ? (
                <CheckIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              ) : (
                <UsersIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {searchQuery 
                ? 'No conversations found' 
                : activeFilter === 'unread'
                  ? 'No unread messages'
                  : 'No conversations yet'
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery 
                ? 'Try a different search term' 
                : activeFilter === 'unread'
                  ? 'You\'re all caught up! 🎉'
                  : 'Add friends from contacts to start chatting'
              }
            </p>
            {!searchQuery && activeFilter === 'all' && (
              <Link
                to="/contacts"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <UserPlusIcon className="w-4 h-4" />
                <span>Browse Contacts</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredChats.map((chat) => {
              const participant = chat.participants[0];
              const isActive = currentChatId === chat.id;
              const isAI = chat.isAI;

              return (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`
                    w-full p-3 flex items-center gap-3 text-left
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent'
                    }
                  `}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`
                      w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                      text-white text-sm sm:text-base font-semibold
                      ${isAI 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      }
                    `}>
                      {participant.avatar}
                    </div>
                    
                    {/* Status Indicator (non-AI) */}
                    {!isAI && (
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(participant.status)}`} />
                    )}
                    
                    {/* AI Sparkle Badge */}
                    {isAI && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-purple-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <SparklesIcon className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name + Time Row */}
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3 className={`
                        text-sm font-semibold truncate
                        ${isActive 
                          ? 'text-blue-700 dark:text-blue-300' 
                          : 'text-gray-900 dark:text-white'
                        }
                      `}>
                        {chat.name}
                        {isAI && (
                          <span className="ml-1 text-[10px] font-bold text-purple-500">
                            AI
                          </span>
                        )}
                      </h3>
                      <span className={`
                        text-[10px] sm:text-xs flex-shrink-0
                        ${isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-400 dark:text-gray-500'
                        }
                      `}>
                        {formatTime(chat.lastMessage?.createdAt || chat.updatedAt)}
                      </span>
                    </div>

                    {/* Last Message Row */}
                    <div className="flex items-center justify-between gap-2">
                      <p className={`
                        text-xs sm:text-sm truncate
                        ${isActive 
                          ? 'text-blue-600/80 dark:text-blue-300/80' 
                          : 'text-gray-500 dark:text-gray-400'
                        }
                      `}>
                        {chat.lastMessage?.content || 'Start a conversation'}
                      </p>
                      
                      {/* Unread Badge */}
                      {chat.unreadCount > 0 && (
                        <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Status Text */}
                    <div className="flex items-center gap-1.5 mt-1">
                      {isAI ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                          <span className="text-[10px] text-purple-500 dark:text-purple-400 font-medium">
                            Always online
                          </span>
                        </>
                      ) : (
                        <>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(participant.status)}`} />
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {getStatusText(participant.status)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ============ FOOTER ============ */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                {onlineCount} online
              </span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              {chats.length} chats
            </span>
          </div>
          
          <Link
            to="/contacts"
            className="flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <UserPlusIcon className="w-3.5 h-3.5" />
            <span>Add</span>
          </Link>
        </div>
      </div>
    </div>
  );
};