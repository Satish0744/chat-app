import React, { createContext, ReactNode } from 'react';

interface SocketContextType {
  socket: any;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

export const SocketContext = createContext<SocketContextType>({} as SocketContextType);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock socket implementation
  const socket = null;

  const emit = (event: string, data: any) => {
    console.log('Emitting event:', event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    console.log('Listening to event:', event);
  };

  const off = (event: string, callback?: (data: any) => void) => {
    console.log('Removing listener for event:', event);
  };

  return (
    <SocketContext.Provider value={{ socket, emit, on, off }}>
      {children}
    </SocketContext.Provider>
  );
};