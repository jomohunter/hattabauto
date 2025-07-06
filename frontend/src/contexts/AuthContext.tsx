'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, LoginDTO } from '@/types';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDTO) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing token on mount
    const token = Cookies.get('auth-token');
    const userData = Cookies.get('user-data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('auth-token');
        Cookies.remove('user-data');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Add a function to validate token on page load
  const validateToken = async () => {
    if (typeof window === 'undefined') return;
    
    const token = Cookies.get('auth-token');
    if (token && !user) {
      try {
        // Try to make a request to validate the token
        const response = await fetch('https://hattabauto-production.up.railway.app/api/products/admin/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          // Token is invalid, clear cookies
          Cookies.remove('auth-token');
          Cookies.remove('user-data');
          setUser(null);
        }
      } catch (error) {
        console.error('Token validation error:', error);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      validateToken();
    }
  }, [user]);

  const login = async (credentials: LoginDTO): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      // Store token and user data
      Cookies.set('auth-token', response.token, { expires: 7, sameSite: 'lax' });
      Cookies.set('user-data', JSON.stringify(response.user), { expires: 7, sameSite: 'lax' });
      
      setUser(response.user);
      toast.success('Login successful!');
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('auth-token');
    Cookies.remove('user-data');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 