import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout/MainLayout';
import { useContacts, Contact } from '../hooks/useContacts';
import { 
  MagnifyingGlassIcon, 
  UserPlusIcon,
  UserMinusIcon,
  ChatBubbleLeftIcon,
  CheckIcon,
  XMarkIcon,
  UsersIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const { friends, suggestions, addFriend, unfriend, toggleFriend } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'suggestions'>('friends');

  const filteredList = useMemo(() => {
    const list = activeTab === 'friends' ? friends : suggestions;
    if (!searchQuery.trim()) return list;
    return list.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, friends, suggestions, searchQuery]);

  const handleStartChat = (contact: Contact) => {
    navigate(`/chat?user=${contact.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Contacts
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {friends.length} friends • {suggestions.length} suggestions
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts by name or email..."
              className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-full sm:w-auto sm:inline-flex">
          <button
            onClick={() => setActiveTab('friends')}
            className={`
              flex-1 sm:flex-none flex items-center justify-center gap-2 
              px-4 sm:px-6 py-2.5 rounded-lg 
              text-sm font-medium transition-all duration-200
              ${activeTab === 'friends'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            <UsersIcon className="w-4 h-4" />
            <span>Friends</span>
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full min-w-[20px]
              ${activeTab === 'friends'
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}>
              {friends.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`
              flex-1 sm:flex-none flex items-center justify-center gap-2 
              px-4 sm:px-6 py-2.5 rounded-lg 
              text-sm font-medium transition-all duration-200
              ${activeTab === 'suggestions'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            <UserPlusIcon className="w-4 h-4" />
            <span>Suggestions</span>
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full min-w-[20px]
              ${activeTab === 'suggestions'
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}>
              {suggestions.length}
            </span>
          </button>
        </div>

        {/* Contacts Grid */}
        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              {activeTab === 'friends' ? (
                <UsersIcon className="w-8 h-8 text-gray-400" />
              ) : (
                <UserPlusIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {searchQuery 
                ? 'No contacts found' 
                : activeTab === 'friends' 
                  ? 'No friends yet' 
                  : 'No suggestions available'
              }
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? 'Try a different search term' 
                : activeTab === 'friends'
                  ? 'Add friends from suggestions to start chatting'
                  : 'Check back later for new people'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredList.map((contact) => (
              <div
                key={contact.id}
                className="
                  bg-white dark:bg-gray-800 
                  rounded-2xl p-5 
                  border border-gray-200 dark:border-gray-700
                  hover:border-blue-300 dark:hover:border-blue-700
                  hover:shadow-lg 
                  transition-all duration-300 
                  group
                "
              >
                {/* Avatar & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center
                      text-white text-2xl font-bold shadow-lg
                      ${contact.isAI 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      }
                    `}>
                      {contact.avatar}
                    </div>
                    <span className={`
                      absolute -bottom-0.5 -right-0.5 
                      w-4 h-4 rounded-full 
                      border-2 border-white dark:border-gray-800 
                      ${getStatusColor(contact.status)}
                    `} />
                    {contact.isAI && (
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <SparklesIcon className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </div>
                  
                  <span className={`
                    text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide
                    ${contact.isFriend 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }
                  `}>
                    {contact.isFriend ? 'Friend' : 'New'}
                  </span>
                </div>

                {/* Info */}
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-0.5">
                    {contact.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
                    {contact.email}
                  </p>
                  {contact.bio && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {contact.bio}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(contact.status)}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getStatusText(contact.status)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {contact.isFriend ? (
                    <>
                      <button
                        onClick={() => handleStartChat(contact)}
                        className="
                          flex-1 flex items-center justify-center gap-1.5 
                          px-3 py-2 rounded-xl 
                          bg-blue-600 hover:bg-blue-700 
                          text-white text-xs font-medium
                          transition-all duration-200 
                          hover:scale-[1.02] active:scale-[0.98]
                        "
                      >
                        <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                      <button
                        onClick={() => unfriend(contact.id)}
                        className="
                          p-2 rounded-xl 
                          bg-gray-100 dark:bg-gray-700 
                          hover:bg-red-100 dark:hover:bg-red-900/30 
                          text-gray-600 dark:text-gray-400 
                          hover:text-red-600 dark:hover:text-red-400
                          transition-all duration-200
                          group/btn
                        "
                        title="Unfriend"
                      >
                        <UserMinusIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => addFriend(contact.id)}
                      className="
                        flex-1 flex items-center justify-center gap-1.5 
                        px-3 py-2 rounded-xl 
                        bg-gradient-to-r from-blue-600 to-indigo-600 
                        hover:from-blue-700 hover:to-indigo-700 
                        text-white text-xs font-medium
                        transition-all duration-200 
                        hover:scale-[1.02] active:scale-[0.98]
                        shadow-md shadow-blue-500/20
                      "
                    >
                      <UserPlusIcon className="w-3.5 h-3.5" />
                      <span>Add Friend</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ContactsPage;