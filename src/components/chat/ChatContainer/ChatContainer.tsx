import React, { useState, useEffect } from 'react';
import { useAIChat } from '../../../hooks/useAIChat';
import { ChatSidebar } from '../ChatSidebar/ChatSidebar';
import { ChatWindow } from '../ChatWindow/ChatWindow';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export const ChatContainer: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    chats,
    messages,
    currentChatId,
    isAITyping,
    setCurrentChatId,
    sendMessage,
    deleteMessage,
    reactToMessage,
    clearChat,
    markAsRead,
  } = useAIChat();

  const currentChat = chats.find(c => c.id === currentChatId);
  const currentMessages = messages[currentChatId] || [];

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    markAsRead(chatId);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = (content: string, type?: 'text' | 'image' | 'video' | 'document') => {
    if (currentChatId) {
      sendMessage(currentChatId, content, type);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 relative">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden absolute top-3 left-3 z-40 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Bars3Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 xl:w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-col">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onChatSelect={handleChatSelect}
          availableUsers={[]}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-72 sm:w-80 lg:hidden
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full bg-white dark:bg-gray-800 shadow-xl flex flex-col">
          <ChatSidebar
            chats={chats}
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            availableUsers={[]}
          />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentChat ? (
          <ChatWindow
            chat={currentChat}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            onDeleteMessage={(msgId) => deleteMessage(currentChatId, msgId)}
            onReact={(msgId, emoji) => reactToMessage(currentChatId, msgId, emoji)}
            onClearChat={() => clearChat(currentChatId)}
            isAITyping={isAITyping}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center space-y-3 p-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Select a conversation</h3>
                <p className="text-xs sm:text-sm">Choose a chat to start messaging</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};