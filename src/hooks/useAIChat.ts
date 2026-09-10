import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

// ==================== TYPES ====================
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'document';
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  reactions?: Record<string, string[]>;
  replyTo?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
  bio?: string;
}

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  isAI?: boolean;
  avatar?: string;
  participants: ChatUser[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== AI RESPONSE GENERATOR ====================
const generateAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();

  // Greetings
  if (message.match(/^(hi|hello|hey|hola|namaste|good morning|good afternoon|good evening)/)) {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ☀️ How can I help you today?";
    if (hour < 17) return "Good afternoon! 🌤️ What can I do for you?";
    if (hour < 21) return "Good evening! 🌆 How are you doing?";
    return "Hello! 🌙 How can I help you tonight?";
  }

  // How are you
  if (message.match(/how are you|how.*doing|whats up|what's up/)) {
    const responses = [
      "I'm doing great, thanks for asking! 😊 How are you?",
      "Feeling fantastic! 🚀 Ready to help you with anything!",
      "I'm wonderful! Thanks for asking. How about you?",
      "All systems operational! 💯 How can I assist you today?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Name questions
  if (message.match(/what.*your name|who are you|introduce yourself/)) {
    return "I'm AI Assistant 🤖 - your friendly chatbot! I'm here to help you with anything you need. I can answer questions, tell jokes, have conversations, and much more!";
  }

  // Goodbye
  if (message.match(/bye|goodbye|see you|see ya|cya|take care/)) {
    return "Goodbye! 👋 It was nice chatting with you. Come back anytime!";
  }

  // Thanks
  if (message.match(/thank|thanks|thx|ty/)) {
    return "You're welcome! 😊 Happy to help anytime!";
  }

  // Help
  if (message.match(/help|assist|support/)) {
    return "I can help you with:\n• Answering questions\n• Having a conversation\n• Telling jokes\n• Providing information\n• Brainstorming ideas\n• And much more!\n\nWhat would you like to know?";
  }

  // Jokes
  if (message.match(/joke|funny|make me laugh|humor/)) {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "What do you call a fake noodle? An impasta! 🍝",
      "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
      "What's a computer's favorite snack? Microchips! 💻",
      "Why don't scientists trust atoms? Because they make up everything! ⚛️",
      "What do you call a bear with no teeth? A gummy bear! 🐻",
      "Why did the coffee file a police report? It got mugged! ☕",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus! 🇨🇭",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Weather
  if (message.match(/weather|temperature|rain|sunny|cloudy/)) {
    return "I don't have access to real-time weather data, but I hope it's nice where you are! ☀️🌤️ You could check a weather app for accurate info!";
  }

  // Time/Date
  if (message.match(/what.*time|current time|what.*date|today.*date/)) {
    return `The current time is ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} on ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}. ⏰`;
  }

  // Love/Like
  if (message.match(/love|like you|adore/)) {
    const responses = [
      "Aww, that's so sweet! 💖 I enjoy chatting with you too!",
      "You're too kind! 😊 I appreciate you!",
      "That made my circuits warm! 💕 Thanks!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Sad emotions
  if (message.match(/sad|depressed|upset|unhappy|feeling down|bad day/)) {
    return "I'm sorry to hear that. 😔 Remember, tough times don't last, but tough people do. Is there anything I can do to help? Sometimes talking about it helps!";
  }

  // Happy emotions
  if (message.match(/happy|great|awesome|amazing|fantastic|wonderful/)) {
    const responses = [
      "That's wonderful to hear! 🎉 Keep that positive energy going!",
      "Yay! 😄 I'm so happy for you!",
      "Awesome! ✨ Your happiness makes me happy too!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Questions
  if (message.match(/\?$/)) {
    const questions = [
      "That's a great question! 🤔 Let me think about that... Based on my knowledge, I'd say it depends on the context. Could you provide more details?",
      "Interesting question! 💭 From what I understand, there are several perspectives on this. What specifically would you like to know?",
      "Hmm, that's worth exploring! 🔍 Here's what I think... but I'd love to hear your thoughts too!",
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  // Food
  if (message.match(/food|eat|hungry|dinner|lunch|breakfast/)) {
    return "Mmm, food! 🍕 I wish I could eat, but I'm just code! What's your favorite dish?";
  }

  // Music
  if (message.match(/music|song|sing|listen/)) {
    return "Music is amazing! 🎵 What kind of music do you enjoy? I'm curious about your taste!";
  }

  // Movies
  if (message.match(/movie|film|watch|netflix|series/)) {
    return "Movies are great! 🎬 Got any recommendations? I'm always interested in what people enjoy watching!";
  }

  // Work/Study
  if (message.match(/work|job|study|school|college|exam/)) {
    return "Work and study are important! 📚 How's it going? Need any motivation or tips?";
  }

  // Default responses
  const defaultResponses = [
    "That's interesting! Tell me more about it. 💭",
    "I see what you mean. What else is on your mind?",
    "Thanks for sharing that with me! 😊",
    "That's a great point! Have you thought about it from another angle?",
    "Interesting perspective! I'm learning something new.",
    "I understand. How does that make you feel?",
    "Let me think about that for a moment... 🤔",
    "That's quite fascinating! Tell me more.",
    "I appreciate you sharing that with me.",
    "Got it! Is there anything specific you'd like to know?",
    "Hmm, I hadn't thought of it that way. Thanks for the insight!",
    "That sounds really interesting! Keep going...",
    "I'm all ears! 👂 Tell me more!",
    "Wow, that's cool! What happened next?",
    "Nice! 😎 Sounds like you know what you're doing!",
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// ==================== MOCK USERS ====================
const mockUsers: ChatUser[] = [
  {
    id: 'user-1',
    name: 'AI Assistant',
    email: 'ai@chatapp.com',
    avatar: '🤖',
    status: 'online',
    bio: 'Your friendly AI companion',
  },
  {
    id: 'user-2',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'JD',
    status: 'online',
    bio: 'Software Developer',
  },
  {
    id: 'user-3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'JS',
    status: 'online',
    bio: 'Designer & Creative',
  },
  {
    id: 'user-4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'MJ',
    status: 'away',
    bio: 'Product Manager',
  },
  {
    id: 'user-5',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'SW',
    status: 'offline',
    bio: 'Marketing Specialist',
  },
  {
    id: 'user-6',
    name: 'Alex Kumar',
    email: 'alex@example.com',
    avatar: 'AK',
    status: 'online',
    bio: 'Full Stack Developer',
  },
  {
    id: 'user-7',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    avatar: 'PS',
    status: 'online',
    bio: 'UI/UX Designer',
  },
  {
    id: 'user-8',
    name: 'David Chen',
    email: 'david@example.com',
    avatar: 'DC',
    status: 'busy',
    bio: 'DevOps Engineer',
  },
  {
    id: 'user-9',
    name: 'Emma Brown',
    email: 'emma@example.com',
    avatar: 'EB',
    status: 'online',
    bio: 'Content Writer',
  },
  {
    id: 'user-10',
    name: 'Raj Patel',
    email: 'raj@example.com',
    avatar: 'RP',
    status: 'offline',
    bio: 'Backend Developer',
  },
];

// ==================== INITIAL CHATS ====================
const initialChats: Chat[] = mockUsers.map((user, index) => ({
  id: `chat-${user.id}`,
  name: user.name,
  isGroup: false,
  isAI: user.id === 'user-1',
  avatar: user.avatar,
  participants: [user],
  lastMessage: undefined,
  unreadCount: 0,
  createdAt: new Date(Date.now() - index * 3600000),
  updatedAt: new Date(Date.now() - index * 3600000),
}));

// ==================== INITIAL MESSAGES ====================
const initialMessages: Record<string, Message[]> = {
  'chat-user-1': [
    {
      id: uuidv4(),
      chatId: 'chat-user-1',
      senderId: 'user-1',
      content: "Hello! 👋 I'm your AI Assistant. I'm here to chat with you anytime. What would you like to talk about?",
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 60000),
      reactions: {},
    },
  ],
};

// ==================== MAIN HOOK ====================
export const useAIChat = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [currentChatId, setCurrentChatId] = useState<string>('chat-user-1');
  const [isLoading, setIsLoading] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);

  // ==================== LOAD FROM LOCALSTORAGE ====================
  useEffect(() => {
    try {
      const storedChats = localStorage.getItem('chat_chats');
      const storedMessages = localStorage.getItem('chat_messages');
      
      if (storedChats) {
        const parsed = JSON.parse(storedChats);
        // Merge with initial chats to preserve AI chat
        const merged = initialChats.map(initialChat => {
          const stored = parsed.find((c: Chat) => c.id === initialChat.id);
          if (stored) {
            return {
              ...initialChat,
              lastMessage: stored.lastMessage ? {
                ...stored.lastMessage,
                createdAt: new Date(stored.lastMessage.createdAt),
              } : undefined,
              unreadCount: stored.unreadCount || 0,
              updatedAt: stored.updatedAt ? new Date(stored.updatedAt) : initialChat.updatedAt,
            };
          }
          return initialChat;
        });
        setChats(merged);
      }
      
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        // Convert date strings to Date objects
        const converted: Record<string, Message[]> = {};
        Object.keys(parsed).forEach(chatId => {
          converted[chatId] = parsed[chatId].map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          }));
        });
        // Always ensure AI chat has initial message
        if (!converted['chat-user-1'] || converted['chat-user-1'].length === 0) {
          converted['chat-user-1'] = initialMessages['chat-user-1'];
        }
        setMessages(converted);
      }
    } catch (error) {
      console.error('Error loading chats from localStorage:', error);
    }
  }, []);

  // ==================== SAVE TO LOCALSTORAGE ====================
  useEffect(() => {
    try {
      localStorage.setItem('chat_chats', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  }, [chats]);

  useEffect(() => {
    try {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [messages]);

  // ==================== SEND MESSAGE ====================
  const sendMessage = useCallback((
    chatId: string, 
    content: string, 
    type: 'text' | 'image' | 'video' | 'document' = 'text'
  ) => {
    if (!content.trim()) return;

    const currentChat = chats.find(c => c.id === chatId);
    if (!currentChat) {
      console.error('Chat not found:', chatId);
      return;
    }

    const newMessage: Message = {
      id: uuidv4(),
      chatId,
      senderId: 'current-user',
      content: content.trim(),
      type,
      status: 'sent',
      createdAt: new Date(),
      reactions: {},
    };

    // Add user message
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    // Update chat with last message
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
        : chat
    ));

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        ),
      }));
    }, 500);

    // Simulate message read
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
        ),
      }));
    }, 1500);

    // AI Reply (for AI chat)
    if (currentChat.isAI) {
      setIsAITyping(true);
      
      const typingDelay = 800 + Math.random() * 700;
      
      setTimeout(() => {
        const aiContent = generateAIResponse(content);
        const aiMessage: Message = {
          id: uuidv4(),
          chatId,
          senderId: currentChat.participants[0].id,
          content: aiContent,
          type: 'text',
          status: 'read',
          createdAt: new Date(),
          reactions: {},
        };

        setMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), aiMessage],
        }));

        setChats(prev => prev.map(chat => 
          chat.id === chatId 
            ? { 
                ...chat, 
                lastMessage: aiMessage, 
                updatedAt: new Date(),
                unreadCount: currentChatId === chatId ? 0 : (chat.unreadCount || 0) + 1,
              }
            : chat
        ));
        
        setIsAITyping(false);
      }, typingDelay);
    } else {
      // For non-AI users, send an automated reply after delay
      setTimeout(() => {
        const autoReplies = [
          "Hey! How's it going?",
          "Thanks for the message!",
          "That's interesting!",
          "Got it, thanks!",
          "Talk to you soon!",
          "I'll get back to you!",
          "Sounds good!",
          "Nice to hear from you!",
        ];
        const reply: Message = {
          id: uuidv4(),
          chatId,
          senderId: currentChat.participants[0].id,
          content: autoReplies[Math.floor(Math.random() * autoReplies.length)],
          type: 'text',
          status: 'read',
          createdAt: new Date(),
          reactions: {},
        };

        setMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), reply],
        }));

        setChats(prev => prev.map(chat => 
          chat.id === chatId 
            ? { 
                ...chat, 
                lastMessage: reply, 
                updatedAt: new Date(),
                unreadCount: currentChatId === chatId ? 0 : (chat.unreadCount || 0) + 1,
              }
            : chat
        ));
      }, 2000 + Math.random() * 2000);
    }

    return newMessage;
  }, [chats, currentChatId]);

  // ==================== DELETE MESSAGE ====================
  const deleteMessage = useCallback((chatId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: (prev[chatId] || []).filter(msg => msg.id !== messageId),
    }));
    toast.success('Message deleted');
  }, []);

  // ==================== REACT TO MESSAGE ====================
  const reactToMessage = useCallback((
    chatId: string, 
    messageId: string, 
    emoji: string
  ) => {
    setMessages(prev => {
      const chatMessages = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: chatMessages.map(msg => {
          if (msg.id === messageId) {
            const reactions = { ...(msg.reactions || {}) };
            const users = reactions[emoji] ? [...reactions[emoji]] : [];
            const userId = 'current-user';
            const index = users.indexOf(userId);
            
            if (index > -1) {
              users.splice(index, 1);
              if (users.length === 0) {
                delete reactions[emoji];
              } else {
                reactions[emoji] = users;
              }
            } else {
              users.push(userId);
              reactions[emoji] = users;
            }
            return { ...msg, reactions };
          }
          return msg;
        }),
      };
    });
  }, []);

  // ==================== CLEAR CHAT ====================
  const clearChat = useCallback((chatId: string) => {
    setMessages(prev => ({ ...prev, [chatId]: [] }));
    
    // Update chat to remove last message
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: undefined, updatedAt: new Date() }
        : chat
    ));
    
    toast.success('Chat cleared');
  }, []);

  // ==================== MARK AS READ ====================
  const markAsRead = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ));
  }, []);

  // ==================== CREATE NEW CHAT ====================
  const createNewChat = useCallback((
    user: ChatUser, 
    isAI: boolean = false
  ) => {
    // Check if chat already exists
    const existingChat = chats.find(c => 
      c.participants[0]?.id === user.id
    );
    
    if (existingChat) {
      setCurrentChatId(existingChat.id);
      return existingChat;
    }

    const newChat: Chat = {
      id: `chat-${user.id}`,
      name: user.name,
      isGroup: false,
      isAI,
      avatar: user.avatar,
      participants: [user],
      lastMessage: undefined,
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats(prev => [...prev, newChat]);
    setMessages(prev => ({ ...prev, [newChat.id]: [] }));
    setCurrentChatId(newChat.id);
    
    toast.success(`Chat with ${user.name} created`);
    return newChat;
  }, [chats]);

  // ==================== RESET ALL DATA ====================
  const resetAllData = useCallback(() => {
    if (confirm('Are you sure you want to reset all chat data?')) {
      setChats(initialChats);
      setMessages(initialMessages);
      setCurrentChatId('chat-user-1');
      localStorage.removeItem('chat_chats');
      localStorage.removeItem('chat_messages');
      toast.success('All data reset');
    }
  }, []);

  // ==================== GET AVAILABLE USERS ====================
  const availableUsers = mockUsers.filter(u => u.id !== 'user-1');

  // ==================== UNREAD COUNT ====================
  const totalUnreadCount = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

  // ==================== RETURN ====================
  return {
    // State
    chats,
    messages,
    currentChatId,
    isLoading,
    isAITyping,
    availableUsers,
    totalUnreadCount,
    
    // Actions
    setCurrentChatId,
    sendMessage,
    deleteMessage,
    reactToMessage,
    clearChat,
    markAsRead,
    createNewChat,
    resetAllData,
  };
};