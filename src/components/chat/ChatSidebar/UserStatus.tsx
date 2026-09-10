import React from 'react';
import type { User } from '../../../types/auth.types';

interface UserStatusProps {
  user: User;
}

export const UserStatus: React.FC<UserStatusProps> = ({ user }) => {
  const getStatusColor = (status?: string) => {
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

  const getStatusText = (status?: string) => {
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

  // Get user avatar with fallback
  const getAvatar = () => {
    if (user.avatar) return user.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=40`;
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={getAvatar()}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(user.status)}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getStatusText(user.status)}
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)} animate-pulse`} />
          <span className="text-xs text-gray-500 dark:text-gray-400">Active</span>
        </div>
      </div>
    </div>
  );
};