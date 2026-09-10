import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../../components/common/ThemeToggle/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { 
  HomeIcon, 
  ChatBubbleLeftIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserGroupIcon,
  XMarkIcon,
  SparklesIcon,
  UserCircleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/chat?search=${encodeURIComponent(searchQuery)}`);
      toast.success(`Searching for "${searchQuery}"`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New message from AI Assistant', time: '2m ago', unread: true },
    { id: 2, title: 'John Doe replied to your message', time: '15m ago', unread: true },
    { id: 3, title: 'Jane Smith sent you a file', time: '1h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
            
            {/* ===== Left Section: Logo + Nav ===== */}
            <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Menu"
              >
                {showMobileMenu ? (
                  <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {/* Logo */}
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2.5 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    ChatApp
                  </h1>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5 leading-none">
                    Real-time Messaging
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 ml-4">
                <Link
                  to="/dashboard"
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive('/dashboard')
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/chat"
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive('/chat')
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  <span>Chats</span>
                </Link>
               <Link
  to="/contacts"
  className={`
    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
    ${isActive('/contacts')
      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }
  `}
>
  <UserGroupIcon className="w-5 h-5" />
  <span>Contacts</span>
</Link>
              </nav>
            </div>

            {/* ===== Center Section: Search Bar ===== */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearch} className="w-full relative">
                <div className={`
                  relative flex items-center w-full
                  transition-all duration-300
                  ${isSearchFocused ? 'scale-[1.02]' : 'scale-100'}
                `}>
                  <MagnifyingGlassIcon className={`
                    absolute left-3.5 w-5 h-5 transition-colors pointer-events-none
                    ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}
                  `} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search messages, users, or chats..."
                    className={`
                      w-full pl-11 pr-24 py-2.5 rounded-xl text-sm
                      bg-gray-50 dark:bg-gray-800/50
                      border-2 transition-all duration-200
                      text-gray-900 dark:text-white
                      placeholder-gray-400 dark:placeholder-gray-500
                      outline-none
                      ${isSearchFocused
                        ? 'border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/10 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                    <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </form>
            </div>

            {/* ===== Right Section: Actions ===== */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              
              {/* New Chat Button */}
              <Link
                to="/chat"
                className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <PlusCircleIcon className="w-5 h-5" />
                <span className="hidden lg:inline">New Chat</span>
              </Link>

              {/* AI Assistant Button */}
              <Link
                to="/chat"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-medium shadow-md shadow-purple-500/25 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                title="AI Assistant"
              >
                <SparklesIcon className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  aria-label="Notifications"
                >
                  <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                        {unreadCount} new
                      </span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          className={`
                            w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0
                            ${notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`
                              w-2 h-2 rounded-full mt-2 flex-shrink-0
                              ${notif.unread ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                            `} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          toast.success('All marked as read');
                        }}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Settings */}
              <Link
                to="/settings"
                className={`
                  hidden sm:flex items-center justify-center p-2.5 rounded-xl transition-colors group
                  ${isActive('/settings')
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                aria-label="Settings"
              >
                <Cog6ToothIcon className={`
                  w-6 h-6 transition-all duration-300 group-hover:rotate-90
                  ${isActive('/settings')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-600'
                  }
                `} />
              </Link>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="relative">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-white dark:ring-gray-800">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate max-w-[100px]">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-[10px] text-green-500 font-medium leading-tight">Online</p>
                  </div>
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in z-50">
                    {/* User Info */}
                    <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                      >
                        <UserCircleIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                      >
                        <Cog6ToothIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        to="/chat"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                      >
                        <SparklesIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span>AI Assistant</span>
                      </Link>
                      <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== Mobile Search Bar ===== */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </form>
          </div>
        </div>
      </header>

      {/* ==================== MOBILE MENU ==================== */}
      {showMobileMenu && (
        <>
          <div 
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed top-16 left-0 bottom-0 w-72 z-40 bg-white dark:bg-gray-800 shadow-2xl lg:hidden animate-slide-in overflow-y-auto">
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
                Navigation
              </p>
              <Link
                to="/dashboard"
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                  ${isActive('/dashboard')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <HomeIcon className="w-6 h-6" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/chat"
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                  ${isActive('/chat')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <ChatBubbleLeftIcon className="w-6 h-6" />
                <span>Messages</span>
              </Link>
              <Link
                to="/settings"
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                  ${isActive('/settings')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Cog6ToothIcon className="w-6 h-6" />
                <span>Settings</span>
              </Link>

              <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
              
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
                Quick Actions
              </p>
              <Link
                to="/chat"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md"
              >
                <PlusCircleIcon className="w-6 h-6" />
                <span>Start New Chat</span>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 min-h-0">
        {children}
      </main>
    </div>
  );
};