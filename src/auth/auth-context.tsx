'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService, { User, LoginRequest, RegisterRequest, UpdateProfileRequest, AuthResponse } from '../services/auth-service';

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOrganizer: boolean;
  isUser: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<AuthResponse>;
}

// Create auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isOrganizer: false,
  isUser: false,
  login: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
  updateProfile: async () => ({ success: false, message: 'Not implemented' })
});

// Auth provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Try to restore user from localStorage
        const storedUser = authService.getCurrentUser();
        
        if (storedUser && await authService.verifyToken()) {
          // If token is valid, get fresh user data
          const freshUserData = await authService.getProfile();
          setUser(freshUserData);
        } else {
          // If token is invalid, clear user data
          authService.logout();
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    
    try {
      const response = await authService.register(userData);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Registration failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Update profile function
  const updateProfile = async (data: UpdateProfileRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    
    try {
      const response = await authService.updateProfile(data);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Profile update failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Compute derived state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || false;
  const isOrganizer = user?.role === 'admin' || user?.role === 'organizer' || false;
  const isUser = user?.role === 'user' || false;

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isOrganizer,
        isUser,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 