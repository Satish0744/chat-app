import React from 'react';
import { Chat } from '../../../types/chat.types';
import { useAuth } from '../../../hooks/useAuth';
import { 
  PhoneIcon, 
  VideoCameraIcon, 
  InformationCircleIcon,
  EllipsisVerticalIcon 
} from '@heroicons/react/24/outline';

interface ChatHeaderProps {
  chat: Chat;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const { user } = useAuth();

  const getChatName = (): string => {
    if (chat.isGroup) return chat.name || 'Group Chat';
    const otherUser = chat.participants?.find((p) => p.id !== user?.id);
    return otherUser?.name || 'Unknown';
  };

  const getChatAvatar = (): string => {
    if (chat.avatar) return chat.avatar;
    if (chat.isGroup) {
      return `https://ui-avatars.com/api/?name=Group&background=6366f1&color=fff&size=40`;
    }
    const otherUser = chat.participants?.find((p) => p.id !== user?.id);
    return otherUser?.avatar || `https://ui-avatars.com/api/?name=${otherUser?.name || 'U'}&background=6366f1&color=fff&size=40`;
  };

  const getStatus = (): string => {
    if (chat.isGroup) {
      const online = chat.participants?.filter((p) => p.status === 'online').length || 0;
      return `${online} members online`;
    }
    const otherUser = chat.participants?.find((p) => p.id !== user?.id);
    return otherUser?.status === 'online' ? 'Online' : 'Offline';
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-3">
        <img
          src={getChatAvatar()}
          alt={getChatName()}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {getChatName()}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getStatus()}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <PhoneIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <VideoCameraIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <InformationCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};