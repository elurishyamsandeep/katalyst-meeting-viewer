'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth';
import { GoogleCalendarMCP } from '../lib/mcp/googleCalendarMCP';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
  mcpService: GoogleCalendarMCP | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mcpService, setMcpService] = useState<GoogleCalendarMCP | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user_info');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Initialize MCP service
          const service = new GoogleCalendarMCP();
          service.initialize().then((success) => {
            if (success) {
              setMcpService(service);
            }
          });
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        localStorage.removeItem('user_info');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    
    if (newUser && typeof window !== 'undefined') {
      localStorage.setItem('user_info', JSON.stringify(newUser));
      
      // Initialize MCP service
      const service = new GoogleCalendarMCP();
      service.initialize().then((success) => {
        if (success) {
          setMcpService(service);
        }
      });
    } else {
      setMcpService(null);
    }
  };

  const logout = () => {
    setUser(null);
    setMcpService(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_info');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      logout, 
      isLoading,
      mcpService 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
