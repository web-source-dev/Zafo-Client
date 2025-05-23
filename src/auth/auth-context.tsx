'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService, { User, LoginRequest, RegisterRequest, UpdateProfileRequest, AuthResponse } from '../services/auth-service';
import subscriptionService, { Subscription, Plan } from '../services/subscription-service';

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOrganizer: boolean;
  isUser: boolean;
  isSubscribed: boolean;
  subscription: Subscription | null;
  subscribedPlan: Plan | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<AuthResponse>;
  refreshSubscription: () => Promise<void>;
  hasRequiredSubscription: (requiredPlanId?: string) => boolean;
  subscriptionEndsAt: Date | null;
  isSubscriptionActive: boolean;
}

// Create auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isOrganizer: false,
  isUser: false,
  isSubscribed: false,
  subscription: null,
  subscribedPlan: null,
  login: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
  updateProfile: async () => ({ success: false, message: 'Not implemented' }),
  refreshSubscription: async () => {},
  hasRequiredSubscription: () => false,
  subscriptionEndsAt: null,
  isSubscriptionActive: false
});

// Auth provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscribedPlan, setSubscribedPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user's subscription
  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setSubscribedPlan(null);
      return;
    }

    try {
      // First try to sync subscription with Stripe to ensure we have latest data
      const syncResponse = await subscriptionService.syncSubscriptionWithStripe();
      
      if (syncResponse.success) {
        // If sync is successful, set the subscription from sync response
        const syncedSubscription = syncResponse.data?.subscription || null;
        setSubscription(syncedSubscription);
        
        // Set the subscribed plan from the subscription data
        if (syncedSubscription && syncedSubscription.plan) {
          setSubscribedPlan(syncedSubscription.plan);
        } else {
          setSubscribedPlan(null);
        }
        
        return;
      }
      
      // Fallback to regular fetch if sync fails
      console.log('Sync failed, fetching subscription directly');
      const response = await subscriptionService.getCurrentSubscription();
      
      if (response.success) {
        const fetchedSubscription = response.data || null;
        setSubscription(fetchedSubscription);
        
        // Set the subscribed plan from the subscription data
        if (fetchedSubscription && fetchedSubscription.plan) {
          setSubscribedPlan(fetchedSubscription.plan);
        } else {
          setSubscribedPlan(null);
        }
      } else {
        setSubscription(null);
        setSubscribedPlan(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
      setSubscribedPlan(null);
    }
  };

  // Refresh subscription data
  const refreshSubscription = async () => {
    await fetchSubscription();
  };

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
          
          // Fetch subscription data if authenticated
          await fetchSubscription();
        } else {
          // If token is invalid, clear user data
          authService.logout();
          setUser(null);
          setSubscription(null);
          setSubscribedPlan(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
        setUser(null);
        setSubscription(null);
        setSubscribedPlan(null);
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
        
        // Fetch subscription data after login
        await fetchSubscription();
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
        
        // Fetch subscription data after registration
        await fetchSubscription();
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
    setSubscription(null);
    setSubscribedPlan(null);
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

  // Check if user has a specific subscription or higher
  const hasRequiredSubscription = (requiredPlanId?: string): boolean => {
    // Admin users always have access to everything
    if (user?.role === 'admin') {
      return true;
    }
    
    // If no specific plan is required, just check if user has any active subscription
    if (!requiredPlanId) {
      return !!user?.isSubscribed && !!subscription && subscription.status === 'active';
    }
    
    // If user has no subscription or the subscription isn't active, return false
    if (!subscription || subscription.status !== 'active' || !subscribedPlan) {
      return false;
    }
    
    // Check if user has the required plan
    return subscribedPlan._id === requiredPlanId;
  };

  // Compute derived state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || false;
  const isOrganizer = user?.role === 'admin' || user?.role === 'organizer' || false;
  const isUser = user?.role === 'user' || false;
  const isSubscribed = user?.isSubscribed || false;
  const isSubscriptionActive = !!subscription && subscription.status === 'active';
  
  // Calculate subscription end date
  const subscriptionEndsAt = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null;

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
        isSubscribed,
        subscription,
        subscribedPlan,
        login,
        register,
        logout,
        updateProfile,
        refreshSubscription,
        hasRequiredSubscription,
        subscriptionEndsAt,
        isSubscriptionActive
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 