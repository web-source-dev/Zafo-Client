import api, { ApiResponse } from '../api/api';

// Plan interface
export interface Plan {
  _id: string;
  name: string;
  description: string;
  features: string[];
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  stripeProductId: string;
  isActive: boolean;
  limits?: {
    monthlyEvents: number;
    yearlyEvents: number;
    allowPricing: boolean;
    allowDetailedDescription: boolean;
    allowAdvancedFeatures?: boolean;
    allowPremiumFeatures?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Subscription interface
export interface Subscription {
  _id: string;
  user: string;
  plan: Plan;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  billingCycle: 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

// Premium features interface
export interface PremiumFeatures {
  features: string[];
}

// Checkout session creation request
export interface CheckoutSessionRequest {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
}

// Checkout session response
export interface CheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

// Checkout success request
export interface CheckoutSuccessRequest {
  sessionId: string;
}

// Change plan request
export interface ChangePlanRequest {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
}

/**
 * Service for managing subscription-related API calls
 */
class SubscriptionService {
  /**
   * Get all available subscription plans
   * @returns Promise with plans data
   */
  async getPlans(): Promise<ApiResponse<Plan[]>> {
    return await api.get<Plan[]>('/subscriptions/plans');
  }

  /**
   * Get specific subscription plan by ID
   * @param id Plan ID
   * @returns Promise with plan data
   */
  async getPlanById(id: string): Promise<ApiResponse<Plan>> {
    return await api.get<Plan>(`/subscriptions/plans/${id}`);
  }

  /**
   * Get current user's subscription
   * @returns Promise with subscription data
   */
  async getCurrentSubscription(): Promise<ApiResponse<Subscription | null>> {
    return await api.get<Subscription | null>('/subscriptions/me');
  }

  /**
   * Create a checkout session for subscription
   * @param data Checkout session request data
   * @returns Promise with checkout session data
   */
  async createCheckoutSession(data: CheckoutSessionRequest): Promise<ApiResponse<CheckoutSessionResponse>> {
    return await api.post<CheckoutSessionResponse>('/subscriptions/create-checkout-session', data);
  }

  /**
   * Handle successful checkout
   * @param data Checkout success request data
   * @returns Promise with subscription data
   */
  async handleCheckoutSuccess(data: CheckoutSuccessRequest): Promise<ApiResponse<{ subscription: Subscription }>> {
    return await api.post<{ subscription: Subscription }>('/subscriptions/checkout-success', data);
  }

  /**
   * Cancel current subscription
   * @returns Promise with cancellation result
   */
  async cancelSubscription(): Promise<ApiResponse<{ currentPeriodEnd: string }>> {
    return await api.post<{ currentPeriodEnd: string }>('/subscriptions/cancel');
  }

  /**
   * Change current subscription plan
   * @param data Change plan request data
   * @returns Promise with subscription data
   */
  async changePlan(data: ChangePlanRequest): Promise<ApiResponse<{ subscription: Subscription }>> {
    return await api.post<{ subscription: Subscription }>('/subscriptions/change-plan', data);
  }

  /**
   * Sync subscription data with Stripe
   * This is useful to ensure our database has the latest data from Stripe
   * @returns Promise with synced subscription data
   */
  async syncSubscriptionWithStripe(): Promise<ApiResponse<{ subscription: Subscription | null }>> {
    return await api.post<{ subscription: Subscription | null }>('/subscriptions/sync');
  }

  /**
   * Get premium features (requires subscription)
   * @returns Promise with premium features
   */
  async getPremiumFeatures(): Promise<ApiResponse<PremiumFeatures>> {
    return await api.get<PremiumFeatures>('/subscriptions/premium-features');
  }

  /**
   * Get event counts for current user
   * @returns Promise with event counts
   */
  async getEventCounts(): Promise<ApiResponse<{ monthlyCount: number; yearlyCount: number }>> {
    return await api.get<{ monthlyCount: number; yearlyCount: number }>('/events/counts');
  }

  /**
   * Redirect user to Stripe checkout
   * @param sessionUrl Stripe checkout session URL
   */
  redirectToCheckout(sessionUrl: string): void {
    if (typeof window !== 'undefined') {
      window.location.href = sessionUrl;
    }
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
export default subscriptionService; 