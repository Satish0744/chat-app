import React from 'react';
import { ChatContainer } from '../components/chat/ChatContainer/ChatContainer';
import { MainLayout } from '../layouts/MainLayout/MainLayout';

const ChatPage: React.FC = () => {
  return (
    <MainLayout>
      <ChatContainer />
    </MainLayout>
  );
};

export default ChatPage;