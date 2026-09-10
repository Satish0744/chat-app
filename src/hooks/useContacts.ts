import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  bio?: string;
  isFriend: boolean;
  isAI?: boolean;
  lastSeen?: Date;
  addedAt?: Date;
}

// All available users in the system
const allUsers: Contact[] = [
  {
    id: 'user-1',
    name: 'AI Assistant',
    email: 'ai@chatapp.com',
    avatar: '🤖',
    status: 'online',
    bio: 'Your friendly AI companion',
    isFriend: true,
    isAI: true,
  },
  {
    id: 'user-2',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'JD',
    status: 'online',
    bio: 'Software Developer',
    isFriend: false,
  },
  {
    id: 'user-3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'JS',
    status: 'online',
    bio: 'Designer & Creative',
    isFriend: false,
  },
  {
    id: 'user-4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'MJ',
    status: 'away',
    bio: 'Product Manager',
    isFriend: false,
  },
  {
    id: 'user-5',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'SW',
    status: 'offline',
    bio: 'Marketing Specialist',
    isFriend: false,
  },
  {
    id: 'user-6',
    name: 'Alex Kumar',
    email: 'alex@example.com',
    avatar: 'AK',
    status: 'online',
    bio: 'Full Stack Developer',
    isFriend: false,
  },
  {
    id: 'user-7',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    avatar: 'PS',
    status: 'online',
    bio: 'UI/UX Designer',
    isFriend: false,
  },
  {
    id: 'user-8',
    name: 'David Chen',
    email: 'david@example.com',
    avatar: 'DC',
    status: 'busy',
    bio: 'DevOps Engineer',
    isFriend: false,
  },
  {
    id: 'user-9',
    name: 'Emma Brown',
    email: 'emma@example.com',
    avatar: 'EB',
    status: 'online',
    bio: 'Content Writer',
    isFriend: false,
  },
  {
    id: 'user-10',
    name: 'Raj Patel',
    email: 'raj@example.com',
    avatar: 'RP',
    status: 'offline',
    bio: 'Backend Developer',
    isFriend: false,
  },
];

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('contacts');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with allUsers to get latest data
        const merged = allUsers.map(user => {
          const storedUser = parsed.find((c: Contact) => c.id === user.id);
          return storedUser ? { ...user, isFriend: storedUser.isFriend, addedAt: storedUser.addedAt } : user;
        });
        setContacts(merged);
      } else {
        setContacts(allUsers);
        localStorage.setItem('contacts', JSON.stringify(allUsers));
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts(allUsers);
    }
  }, []);

  // Save to localStorage whenever contacts change
  useEffect(() => {
    if (contacts.length > 0) {
      try {
        localStorage.setItem('contacts', JSON.stringify(contacts));
      } catch (error) {
        console.error('Error saving contacts:', error);
      }
    }
  }, [contacts]);

  const addFriend = useCallback((userId: string) => {
    setContacts(prev => prev.map(c => 
      c.id === userId 
        ? { ...c, isFriend: true, addedAt: new Date() }
        : c
    ));
    const contact = contacts.find(c => c.id === userId);
    toast.success(`${contact?.name || 'User'} added as friend! 🎉`);
  }, [contacts]);

  const unfriend = useCallback((userId: string) => {
    setContacts(prev => prev.map(c => 
      c.id === userId 
        ? { ...c, isFriend: false, addedAt: undefined }
        : c
    ));
    const contact = contacts.find(c => c.id === userId);
    toast.success(`${contact?.name || 'User'} removed from friends`);
  }, [contacts]);

  const toggleFriend = useCallback((userId: string) => {
    const contact = contacts.find(c => c.id === userId);
    if (contact?.isFriend) {
      unfriend(userId);
    } else {
      addFriend(userId);
    }
  }, [contacts, addFriend, unfriend]);

  const friends = contacts.filter(c => c.isFriend);
  const suggestions = contacts.filter(c => !c.isFriend);

  return {
    contacts,
    friends,
    suggestions,
    addFriend,
    unfriend,
    toggleFriend,
  };
};