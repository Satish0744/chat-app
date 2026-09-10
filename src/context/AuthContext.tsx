import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types/auth.types';
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '../utils/helpers';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Helper to get users from localStorage
const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

// Helper to save users to localStorage
const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Helper to find user by email
const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = getToken();
    const storedUser = getUser();
    if (token && storedUser) {
      setUserState(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Signup function
  const signup = async (data: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Check if user already exists
        const existingUser = findUserByEmail(data.email);
        if (existingUser) {
          toast.error('User already exists! Please login.');
          reject(new Error('User already exists'));
          return;
        }

        // Create new user
        const newUser: User = {
          id: uuidv4(),
          name: data.name,
          email: data.email,
          password: data.password, // In real app, you'd hash this
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff&size=40`,
          status: 'online',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Save user to localStorage
        const users = getUsers();
        users.push(newUser);
        saveUsers(users);

        // Generate token
        const token = `token_${Date.now()}_${newUser.id}`;
        setToken(token);
        
        // Save user data (without password)
        const { password, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        setUserState(userWithoutPassword);

        toast.success('Account created successfully! 🎉');
        resolve();
      } catch (error) {
        toast.error('Signup failed. Please try again.');
        reject(error);
      }
    });
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Find user
        const user = findUserByEmail(email);
        if (!user) {
          toast.error('User not found! Please sign up.');
          reject(new Error('User not found'));
          return;
        }

        // Check password (in real app, you'd compare hashed passwords)
        if (user.password !== password) {
          toast.error('Invalid password!');
          reject(new Error('Invalid password'));
          return;
        }

        // Update user status
        user.status = 'online';
        user.lastSeen = new Date();
        
        // Update users list
        const users = getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          users[index] = user;
          saveUsers(users);
        }

        // Generate token
        const token = `token_${Date.now()}_${user.id}`;
        setToken(token);

        // Save user data (without password)
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        setUserState(userWithoutPassword);

        toast.success('Welcome back! 🎉');
        resolve();
      } catch (error) {
        toast.error('Login failed. Please try again.');
        reject(error);
      }
    });
  };

  // Logout function
  const logout = (): void => {
    // Update user status to offline
    if (user) {
      const users = getUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index].status = 'offline';
        users[index].lastSeen = new Date();
        saveUsers(users);
      }
    }
    
    removeToken();
    removeUser();
    setUserState(null);
    toast.success('Logged out successfully');
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const user = findUserByEmail(email);
        if (!user) {
          toast.error('Email not found!');
          reject(new Error('Email not found'));
          return;
        }
        
        // In real app, you'd send an email
        toast.success('Password reset link sent to your email! 📧');
        resolve();
      } catch (error) {
        toast.error('Failed to send reset link.');
        reject(error);
      }
    });
  };

  // Update user function
  const updateUser = (updatedUser: User): void => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      saveUsers(users);
      
      const { password, ...userWithoutPassword } = updatedUser;
      setUser(userWithoutPassword);
      setUserState(userWithoutPassword);
      toast.success('Profile updated successfully!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        forgotPassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};