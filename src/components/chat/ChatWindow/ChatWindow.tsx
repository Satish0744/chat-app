import React, { useEffect, useRef } from 'react';
import { Chat, Message } from '../../../hooks/useAIChat';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string, type?: 'text' | 'image' | 'video' | 'document') => void;
  onDeleteMessage: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onClearChat: () => void;
  isAITyping: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  onSendMessage,
  onDeleteMessage,
  onReact,
  onClearChat,
  isAITyping,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAITyping]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-h-0">
      <ChatHeader chat={chat} onClearChat={onClearChat} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400 max-w-xs">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl">
                {chat.avatar}
              </div>
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Start chatting with {chat.name}
              </h3>
              <p className="text-xs sm:text-sm">
                Send a message to begin the conversation
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === 'current-user'}
                currentUserId="current-user"
                onDelete={() => onDeleteMessage(message.id)}
                onReact={(emoji) => onReact(message.id, emoji)}
              />
            ))}
          </>
        )}

        {/* AI Typing Indicator */}
        {isAITyping && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs">
              🤖
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                <span className="ml-2 text-xs text-purple-500 dark:text-purple-400 font-medium">
                  AI is typing
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        isAI={chat.isAI}
      />
    </div>
  );
};