import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout/MainLayout';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  ChatBubbleLeftIcon, 
  UsersIcon, 
  BellIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  UserPlusIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { AIAssistant } from '../components/ai/AIAssistant';
import toast from 'react-hot-toast';

// Mock data for dashboard
const mockStats = [
  { label: 'Active Chats', value: '12', change: '+3', icon: ChatBubbleLeftIcon, color: 'bg-blue-500' },
  { label: 'Online Users', value: '8', change: '+2', icon: UsersIcon, color: 'bg-green-500' },
  { label: 'Notifications', value: '5', change: '-1', icon: BellIcon, color: 'bg-yellow-500' },
  { label: 'Messages Today', value: '47', change: '+12', icon: ArrowTrendingUpIcon, color: 'bg-purple-500' },
];

const mockRecentChats = [
  { id: 1, name: 'John Doe', message: 'Hey, how are you doing?', time: '2m ago', online: true, avatar: 'JD' },
  { id: 2, name: 'Jane Smith', message: 'Let\'s meet tomorrow', time: '15m ago', online: true, avatar: 'JS' },
  { id: 3, name: 'Mike Johnson', message: 'Thanks for the help!', time: '1h ago', online: false, avatar: 'MJ' },
  { id: 4, name: 'Sarah Wilson', message: 'I\'ll send the files', time: '2h ago', online: true, avatar: 'SW' },
];

const mockQuickActions = [
  { label: 'Start New Chat', icon: ChatBubbleLeftIcon, color: 'bg-blue-500', path: '/chat' },
  { label: 'Create Group', icon: UserPlusIcon, color: 'bg-purple-500', path: '/chat' },
  { label: 'View All Chats', icon: UsersIcon, color: 'bg-green-500', path: '/chat' },
  { label: 'Settings', icon: BellIcon, color: 'bg-yellow-500', path: '/settings' },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Update time every minute
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (action: string) => {
    toast.success(`Navigating to ${action}`);
  };

  return (
    <MainLayout>
      <div className="container-custom py-6">
        {/* Welcome Section with AI Integration */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {greeting}{user?.name ? `, ${user.name}` : '!'} 👋
                </h1>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full animate-pulse">
                  Online
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {currentTime} • Here's what's happening with your chats today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toast.success('AI Assistant activated!')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="font-medium">Ask AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mockStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change} from last week
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Chats - Left Column */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Chats
              </h3>
              <Link 
                to="/chat" 
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {mockRecentChats.map((chat) => (
                <Link
                  key={chat.id}
                  to="/chat"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                      chat.online ? 'from-green-500 to-green-400' : 'from-gray-400 to-gray-300'
                    } flex items-center justify-center text-white font-semibold text-lg shadow-md`}>
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {chat.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {chat.message}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Quick Actions & AI */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {mockQuickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.label)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
                  >
                    <div className={`${action.color} p-2 rounded-lg text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Widget */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-card p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">AI Assistant</h3>
                </div>
                <span className="px-2 py-1 text-xs bg-white/20 rounded-full">Beta</span>
              </div>
              <p className="text-sm text-white/80 mb-4">
                Need help? Ask me anything about your chats!
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask AI..."
                  className="flex-1 px-3 py-2 bg-white/20 rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      toast.success('AI is thinking... 🤔');
                    }
                  }}
                />
                <button 
                  className="px-3 py-2 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium text-sm"
                  onClick={() => toast.success('AI is thinking... 🤔')}
                >
                  Ask
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button 
                  onClick={() => toast.success('AI: Summarizing your chats...')}
                  className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  Summarize
                </button>
                <button 
                  onClick={() => toast.success('AI: Generating suggestions...')}
                  className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  Suggestions
                </button>
                <button 
                  onClick={() => toast.success('AI: Analyzing activity...')}
                  className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* Online Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Online Users
                </h3>
                <span className="text-xs text-green-500 dark:text-green-400 font-medium">
                  8 online
                </span>
              </div>
              <div className="flex -space-x-2">
                {['JD', 'JS', 'MJ', 'SW', 'AK', 'RB', 'PT', 'CL'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold shadow-md"
                    style={{ zIndex: 8 - i }}
                  >
                    {initials}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-semibold">
                  +5
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;