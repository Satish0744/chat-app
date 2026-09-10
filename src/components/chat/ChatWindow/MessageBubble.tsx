import React, { useState } from 'react';
import { Message } from '../../../hooks/useAIChat';
import { 
  CheckIcon, 
  CheckBadgeIcon,
  TrashIcon,
  ClipboardIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUserId: string;
  onDelete: () => void;
  onReact: (emoji: string) => void;
}

const reactionOptions = ['❤️', '👍', '😂', '😮', '😢', '🎉'];

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  currentUserId,
  onDelete,
  onReact,
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = () => {
    if (!isOwn) return null;
    switch (message.status) {
      case 'sent':
        return <CheckIcon className="w-3.5 h-3.5 text-white/70" />;
      case 'delivered':
        return <CheckBadgeIcon className="w-3.5 h-3.5 text-white/70" />;
      case 'read':
        return <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-200" />;
      default:
        return null;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Copied!');
    setShowActions(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this message?')) {
      onDelete();
    }
    setShowActions(false);
  };

  const handleReact = (emoji: string) => {
    onReact(emoji);
    setShowActions(false);
  };

  const hasReactions = message.reactions && Object.keys(message.reactions).length > 0;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] group`}>
        {/* Actions Menu (for own messages) */}
        {isOwn && showActions && (
          <div className="absolute -top-10 right-0 flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-10 animate-fade-in">
            {/* Quick reactions */}
            {reactionOptions.slice(0, 4).map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-base transition-colors"
              >
                {emoji}
              </button>
            ))}
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Copy"
            >
              <ClipboardIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              title="Delete"
            >
              <TrashIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Message bubble */}
        <div
          onMouseEnter={() => isOwn && setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
          className={`
            relative px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl
            text-sm sm:text-[15px] break-words shadow-sm
            ${isOwn
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-100 dark:border-gray-700'
            }
          `}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          
          {/* Time + Status */}
          <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
            <span className="text-[10px]">{formatTime(message.createdAt)}</span>
            {getStatusIcon()}
          </div>
        </div>

        {/* Reactions */}
        {hasReactions && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {Object.entries(message.reactions!).map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => onReact(emoji)}
                className={`
                  inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs
                  transition-colors
                  ${users.includes(currentUserId)
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                    : 'bg-gray-100 dark:bg-gray-700 border border-transparent'
                  }
                `}
              >
                <span>{emoji}</span>
                <span className="text-gray-600 dark:text-gray-400 text-[10px] font-medium">
                  {users.length}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};